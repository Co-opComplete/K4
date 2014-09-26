var Robot = require('../models/robot');

module.exports = function (app, io) {
    var robots = app.get('websocketConnections').robots;

    io.of('/robot').on('connection', function (socket) {
        console.log('got robot connnection');

        socket.join('robot');
        robots.push(socket);

        socket.on('message', function (data) {
            console.log('got message: ', data);

            socket.send('OMGZ it worked!!!');
        });

        socket.on('announceIP', function (data) {
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
                            name: 'K4'
                        }); 
                    }
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
            var i = robots.indexOf(socket);
            robots.splice(i, 1);
        });
    });
};
