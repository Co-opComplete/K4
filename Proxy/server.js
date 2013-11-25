var server = require('http').Server(),
    io = require('socket.io').listen(server),
    nconf = require('nconf');

// Setup config
nconf.file({file: 'conf/config.json'});
nconf.load();

io.on('connection', function(socket){
    socket.on('event', function(data){});

    socket.on('disconnect', function(){});
});

server.listen(3000);
