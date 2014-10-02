var _ = require('lodash'),
    Robot = require('../models/robot'),
    uuid = require('node-uuid');

module.exports = function (app, io) {
    var clients = app.get('websocketConnections').clients,
        robots = app.get('websocketConnections').robots,
        connections = app.get('connections');

    return io.of('/remote').on('connection', function (socket) {
        clients[socket.id] = socket;

        // Join the remote room so this socket can receive messages
        // directed to all connected clients
        socket.join('remote');

        console.log('Got connection');

        socket.on('disconnect', function () {
            console.log('Disconnecting');
            // Delete from the list of clients
            delete clients[socket.id];
            
            // Delete any open connections to a robot
            var openConnectionId = _.findKey(connections, function (c) {return c.client === socket.id;});
            if (openConnectionId) {
                delete connections[openConnectionId];
            }
        });

        socket.on('response', function (data) {
            console.log(data);
        });

        // {{{ WebRTC endpoints
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
        // }}} 

        // {{{ Dashboard endpoints

        socket.on('initDashboard', function () {
            // Send back all of the connected robots
            socket.emit('updateRobots', robots);
        });

        socket.on('connectToRobot', function (socketId) {
            var connectionId = uuid.v4();

            // Make sure this client isn't already connected to another robot
            if (_.find(connections, function (c) {return c.client === socket.id;})) {
                socket.emit('connectError', 'Cannot connect to a second robot');
                return;
            }

            // Make sure someone isn't already connected to the target robot
            if (_.find(connections, function (c) {return c.robot === socketId;})) { 
                socket.emit('connectError', 'Someone is already connected to this robot');
                return;
            }

            // Save the connection info
            connections[connectionId] = {
                robot: socketId,
                client: socket.id
            };

            // Tell the robot we want to connect
            // TODO: not working
            io.to(socketId).emit('initConnect', connectionId);

            // Tell the client we successfully connected
            socket.emit('connectSuccess', {});
        });

        // }}}

        // {{{ Control endpoints

        // Intentional disconnect event
        socket.on('disconnectFromRobot', function () {
            // Find the open connection and delete it if it exist
            var openConnectionId = _.findKey(connections, function (c) {return c.client === socket.id;});
            if (openConnectionId) {
                delete connections[openConnectionId];
            }
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

        // }}}
    });
};
