var _ = require('lodash'),
    redis = require('redis'),
    client = redis.createClient();

module.exports = function (app, io) {
    var clients = app.get('websocketConnections').clients,
        robots = app.get('websocketConnections').robots;

    return io.of('/remote').on('connection', function (socket) {
        clients[socket.id] = socket;

        socket.join('remote');

        console.log('Got connection');

        socket.on('callRequest', function () {
            console.log('call initiated');
            if (_.keys(clients).length > 1) {
                // Find the peers socket id
                var peerId = _.find(_.keys(clients), function (key) {
                    return key !== socket.id;
                });
                // emit the offer to that peer
                clients[peerId].emit('callRequest', {});
            } else {
                socket.emit('alone', ':(');
            }
        });

        /* webRTC signaling */
        socket.on('offer', function (offer) {
            console.log('got offer');
            if (_.keys(clients).length > 1) {
                // Find the peers socket id
                var peerId = _.find(_.keys(clients), function (key) {
                    return key !== socket.id;
                });
                // emit the offer to that peer
                clients[peerId].emit('offer', offer);
            } else {
                socket.emit('alone', ':(');
            }
        });

        socket.on('answer', function (answer) {
            console.log('got answer');
            if (_.keys(clients).length > 1) {
                // Find the peers socket id
                var peerId = _.find(_.keys(clients), function (key) {
                    return key !== socket.id;
                });
                // emit the offer to that peer
                clients[peerId].emit('answer', answer);
            } else {
                socket.emit('alone', ':(');
            }
        });

        socket.on('iceCandidate', function (candidate) {
            console.log('candidate: ', candidate);
            console.log('got iceCandidate');
            if (_.keys(clients).length > 1) {
                // Find the peers socket id
                var peerId = _.find(_.keys(clients), function (key) {
                    return key !== socket.id;
                });
                // emit the offer to that peer
                clients[peerId].emit('iceCandidate', candidate);
            } else {
                socket.emit('alone', ':(');
            }
        });

        socket.on('readyToStream', function (ready) {
            if (_.keys(clients).length > 1) {
                // Find the peers socket id
                var peerId = _.find(_.keys(clients), function (key) {
                    return key !== socket.id;
                });
                // emit the offer to that peer
                clients[peerId].emit('readyToStream', ready);
            } else {
                socket.emit('alone', ':(');
            }
        });

        socket.on('response', function (data) {
            console.log(data);
        });

        socket.on('disconnect', function () {
            console.log('Disconnecting');
            delete clients[socket.id];
        });

        // Robot info
        socket.on('requestRobots', function () {
        });

        // Controller Action
        socket.on('controller', function (data) {
            if (robots[_.keys(robots)[0]]) {
                robots[_.keys(robots)[0]].socket.emit('controller', data);
            }
        });

        // Up Action
        socket.on('up', function (data) {
            console.log('Up - ' + data.action);
            //socket.in('robot').send('up');
            if(data.action === 'released' && robots[0]) {
                robots[0].send('up');
            }
        });

        // Down Action
        socket.on('down', function (data) {
            console.log('Down - ' + data.action);
            //socket.in('robot').send('down');
            if(data.action === 'released' && robots[0]) {
                robots[0].send('down');
            }
        });

        // Left Action
        socket.on('left', function (data) {
            console.log('Left - ' + data.action);
            if(data.action === 'released') {
                socket.in('robot').emit('left', {});
            }
        });

        // Right Action
        socket.on('right', function (data) {
            console.log('Right - ' + data.action);
            if(data.action === 'released') {
                socket.in('robot').emit('right', {});
            }
        });
    });
};
