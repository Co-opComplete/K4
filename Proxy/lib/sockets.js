module.exports = function (io) {
    var clients = [],
        robots = [];

    io.of('/robot').on('connection', function (socket) {
        console.log('got robot connnection');

        socket.join('robot');
        robots.push(socket);

        socket.on('message', function (data) {
            console.log('got message: ', data);

            socket.send('OMGZ it worked!!!');
        });

        socket.on('disconnect', function(){
            console.log('Disconnecting');
            var i = robots.indexOf(socket);
            robots.splice(i, 1);
        });
    });

    io.of('/remote').on('connection', function(socket){
        clients.push(socket);

        socket.join('remote');

        console.log('Got connection');

        socket.on('response', function(data){
            console.log(data);
        });

        socket.on('disconnect', function(){
            console.log('Disconnecting');
            var i = clients.indexOf(socket);
            clients.splice(i, 1);
        });

        // Controller Action
        socket.on('controller', function(data) {
            console.log('Recieved controller data: ', data);
            if (robots[0]) {
                robots[0].emit('controller', data);
            }
        });

        // Up Action
        socket.on('up', function(data){
            console.log('Up - ' + data.action);
            //socket.in('robot').send('up');
            if(data.action === 'released' && robots[0]) {
                robots[0].send('up');
            }
        });

        // Down Action
        socket.on('down', function(data){
            console.log('Down - ' + data.action);
            //socket.in('robot').send('down');
            if(data.action === 'released' && robots[0]) {
                robots[0].send('down');
            }
        });

        // Left Action
        socket.on('left', function(data){
            console.log('Left - ' + data.action);
            if(data.action === 'released') {
                socket.in('robot').emit('left', {});
            }
        });

        // Right Action
        socket.on('right', function(data){
            console.log('Right - ' + data.action);
            if(data.action === 'released') {
                socket.in('robot').emit('right', {});
            }
        });
    });
};
