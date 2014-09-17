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

        socket.on('disconnect', function (){
            console.log('Disconnecting');
            var i = robots.indexOf(socket);
            robots.splice(i, 1);
        });
    });
};
