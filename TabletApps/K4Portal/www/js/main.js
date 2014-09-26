define([
    'jquery',
    'socketio',
    'websocket'
], function ($, io, socket) {
    'use strict';

    $(function(){
        // Start angular when document is ready
        console.log('document ready');
    });

    function onAddIceCandidateSuccess () {
        console.log('Remote candidate added successfully');
    }
    
    function onAddIceCandidateError (err) {
        console.log('Error adding ice candidate: ', err);
    }

    document.addEventListener('deviceready', function () {
        console.log('device ready');
        var localVideo = $('#local-video')[0],
            remoteVideo = $('#remote-video')[0],
            connectButton = $('#connect-video'),
            answerButton = $('#answer-call'),
            createSrc = window.URL ?
                window.URL.createObjectURL :
                (window.webkitURL ?
                    window.webkitURL.createObjectURL :
                    function (stream) {return stream;}
                ),
            peerConnectionConfig = {
                iceServers: [{'url': 'stun:stun.l.google.com:19302'},
                    {'url': 'turn:k4@192.168.114.203:8001', 'credential': 'on3dt2.0'}]
            },
            sdpConstraints = {
                'mandatory': {
                    'OfferToReceiveAudio': true,
                    'OfferToReceiveVideo': true
                },
                'optional': [{
                    'VoiceActivityDetection': false
                }]
            },
            peerConnection,
            localStream,
            remoteStream,
            offer,
            answer,
            status,
            readyForCandidates = false,
            iceCandidates = [],
            onIceCandidate = function (event) {
                if (event.candidate) {
                    console.log('Got ice candidate: ', event.candidate);
                    socket.emit('iceCandidate', event.candidate);
                } else {
                    console.log('End of ice candidates');
                }
            },
            onRemoteStreamAdded = function (event) {
                console.log('Attaching remote stream');
                attachMediaStream(remoteVideo, event.stream);
                remoteStream = event.stream;
            },
            onRemoteStreamRemoved = function () {
                console.log('Remote stream removed');
            },
            onSignalingStateChanged = function () {
                console.log('Signaling state changed to: ', peerConnection.signalingState);
            },
            onIceConnectionStateChanged = function () {
                console.log('Ice connection state changed to: ', peerConnection.iceConnectionState);
            };

        socket.on('callRequest', function (offer) {
            connectButton.prop('disabled', true);
            answerButton.prop('disabled', false);
            status = 'answering';
        });

        socket.on('alone', function (data) {
            console.log('I am alone ' + data);
            connectButton.prop('disabled', false);
            answerButton.prop('disabled', true);
        });

        socket.on('offer', function (description) {
            console.log('Received offer: ', description);
            try {
                peerConnection = new RTCPeerConnection(peerConnectionConfig);
                peerConnection.onicecandidate = onIceCandidate;
            } catch (e) {
                console.log('Failed to create RTCPeerConnection object: ', e);
                return;
            }
            peerConnection.onaddstream = onRemoteStreamAdded;
            peerConnection.onremovestream = onRemoteStreamRemoved;
            peerConnection.onsignalingstatechange = onSignalingStateChanged;
            peerConnection.oniceconnectionstatechange = onIceConnectionStateChanged;

            peerConnection.addStream(localStream);

            readyForCandidates = true;

            peerConnection.setRemoteDescription(new RTCSessionDescription(description),
                function () {
                    console.log('Finished setting remote Description');
                },
                function (err) {
                    console.log('Error setting remote description: ', err);
                }
            );

            peerConnection.createAnswer(function (description) {
                peerConnection.setLocalDescription(description, function () {
                    console.log('Set local description success');
                }, function (err) {
                    console.log('Error setting local description: ', err);
                });
                console.log('Sending answer: ', description);
                socket.emit('answer', description);
            }, function (err) {
                console.log('Error creating answer: ', err);
            });
        });

        socket.on('answer', function (description) {
            console.log('Received answer: ', description);
            peerConnection.setRemoteDescription(new RTCSessionDescription(description),
                function () {
                    console.log('Finished setting remote Description');
                },
                function (err) {
                    console.log('Error setting remote description: ', err);
                }
            );
        });

        socket.on('iceCandidate', function (data) {
            console.log('candidate: ', data);
            if (readyForCandidates) {
                iceCandidates.push(data);
                while (iceCandidates.length > 0) {
                    var next = iceCandidates.shift(),
                        candidate = new RTCIceCandidate({
                            sdbMLineIndex: next.label,
                            candidate: next.candidate
                        });

                    peerConnection.addIceCandidate(candidate, onAddIceCandidateSuccess, onAddIceCandidateError);
                    console.log('processed ice candidate: ', next);
                }
            } else {
                iceCandidates.push(data);
            }
        });

        $('body').on('click', '#connect-video', function () {
            console.log('clicked connect');
            socket.emit('callRequest', {});
        }).on('click', '#answer-call', function () {
            try {
                peerConnection = new RTCPeerConnection(peerConnectionConfig);
                peerConnection.onicecandidate = onIceCandidate;
            } catch (e) {
                console.log('Failed to create RTCPeerConnection object: ', e);
                return;
            }
            peerConnection.onaddstream = onRemoteStreamAdded;
            peerConnection.onremovestream = onRemoteStreamRemoved;
            peerConnection.onsignalingstatechange = onSignalingStateChanged;
            peerConnection.oniceconnectionstatechange = onIceConnectionStateChanged;

            peerConnection.addStream(localStream);

            readyForCandidates = true;

            console.log('Creating offer');
            peerConnection.createOffer(function (description) {
                peerConnection.setLocalDescription(description, function () {
                    console.log('Set local description success');
                }, function (err) {
                    console.log('Error setting local description: ', err);
                });
                console.log('Sending offer: ', description);
                socket.emit('offer', description);
            }, function (err) {
                console.log('Error creating offer: ', err);
            });
        });

        getUserMedia({
            video: true,
            audio: true
        }, function (stream) { // Success callback
            console.log('got local stream');
            attachMediaStream(localVideo, stream);
            localStream = stream;
            localVideo.play();
        }, function (error) { // Error callback
            console.log('getUserMedia error: ', error);
        });
    }, false);
});
