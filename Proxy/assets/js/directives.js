define([
    'jquery',
    'angular',
    'services',
    'websocket',
    'rtcPeerConnection',
    'gamepad/gamepad',
    'gamepad/controller'
], function ($, angular, services, socket, PeerConnection) {
    'use strict';

    /* Directives */
    angular.module('app.directives', ['app.services'])
        .directive('appVersion', ['version', function (version) {
                return function (scope, elm, attrs) {
                    elm.text(version);
                };
        }])
        .directive('k4Controller', [function () {
            return {
                link: function (scope, el, attrs) {
                        // Start up the controller support
                        controller.init();
                        gamepadSupport.init();
                    }
            };
        }])
        .directive('webrtcVideo', [function () {
            return {
                link: function (scope, el, attrs) {
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
                            iceServers: [{'url': 'stun:localhost:8001'}]
                        },
                        peerConnection = new PeerConnection(peerConnectionConfig);

                    peerConnection.on('ice', function (candidate) {
                        socket.emit('iceCandidate', candidate);
                    });

                    peerConnection.on('streamAdded', function (stream) {
                        console.log('got remote stream');
                        remoteVideo.src = createSrc(stream);
                        remoteVideo.play();
                    });

                    socket.on('offer', function (offer) {
                        connectButton.prop('disabled', true);
                        answerButton.data('offer', offer).prop('disabled', false);
                    });

                    socket.on('alone', function (data) {
                        console.log('I am alone ' + data);
                        connectButton.prop('disabled', false);
                        answerButton.prop('disabled', true);
                    });

                    socket.on('answer', function (answer) {
                        peerConnection.handleAnswer(answer);
                    });

                    socket.on('iceCandidate', function (candidate) {
                        peerConnection.processIce(candidate);
                    });

                    $('#content').on('click', '#connect-video', function () {
                        peerConnection.offer(function (offer) {
                            socket.emit('offer', offer);
                        });
                    }).on('click', '#answer-call', function () {
                        peerConnection.handleOffer($(this).data('offer'), function (err) {
                            if (err) {
                                console.log('handleOffer error: ', err);
                                return;
                            }

                            peerConnection.answer(function (err, answer) {
                                if (err) {
                                    console.log('answer error: ', err);
                                    return;
                                }
                                socket.emit('answer', answer);
                            });
                        });
                    });

                    getUserMedia({
                        video: true,
                        audio: true,
                        el: 'local-video',
                        width: 320,
                        height: 240,
                        mode: 'callback'
                    }, function (stream) { // Success callback
                        console.log('got local stream');
                        localVideo.src = createSrc(stream);
                        localVideo.play();
                    }, function (error) { // Error callback
                        console.log('getUserMedia error: ', error);
                    });
                }
            };
        }]);
});
