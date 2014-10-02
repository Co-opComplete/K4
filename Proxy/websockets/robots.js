var _ = require('lodash'),
    Robot = require('../models/robot');

module.exports = function (app, io) {
    var robots = app.get('websocketConnections').robots,
        clients = app.get('websocketConnections').clients,
        connections = app.get('connections');

    return io.of('/robot').on('connection', function (socket) {
        console.log('got robot connnection');

        socket.join('robot');
        //robots.push(socket);

        socket.on('message', function (data) {
            console.log('got message: ', data);

            socket.send('OMGZ it worked!!!');
        });

        socket.on('announceId', function (data) {
            Robot.findOne({ mac: data.mac }, function(err, robot) {
                if (err) {
                    console.log('error finding robot: ', err);
                } else {
                    if (robot !== null) {
                        robot.ip = data.ip;
                    } else {
                        robot = new Robot({
                            mac: data.mac,
                            ip: data.ip,
                            name: data.name
                        }); 
                    }
                    robot.socket = socket;
                    robots[socket.id] = robot;
                    // Update the list of robots on all clients
                    app.get('rooms').clients.emit('updateRobots', robots);

                    // Save the robot
                    robot.save(function (err) {
                        if (err) {
                            console.log('Error saving robot: ', err);
                        } else {
                        }
                    });
                }
            });
        });

        socket.on('disconnect', function (){
            console.log('Disconnecting');
            delete robots[socket.id];

            // If there is a connected client, announce the disconnect and delete
            // the connection
            var openConnectionId = _.findKey(connections, function (c) {return c.robot === socket.id;});
            if (openConnectionId) {
                clients[connections[openConnectionId].client].emit('robotDisconnecting');
                delete connections[openConnectionId];
            }

            // Make sure everyone knows this robot is disconnecting
            app.get('rooms').clients.emit('updateRobots', robots);
        });

        // {{{ Client connection endpoints

        socket.on('initConnect', function (connectionId) {
        });

        // }}}
    });
};
