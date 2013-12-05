var server = require('http').Server(),
    io = require('socket.io').listen(server),
    nconf = require('nconf'),
    RedisStore = require('socket.io/lib/stores/redis'),
    redis = require('socket.io/node_modules/redis'),
    pub = redis.createClient(),
    sub = redis.createClient(),
    client = redis.createClient(),
    sugar = require('sugar');

// Setup redis store for socket.io
io.set('store', new RedisStore({
    redisPub: pub,
    redisSub: sub,
    redisClient: client
}));

// Setup config
nconf.file({file: 'conf/config.json'});
nconf.load();

io.of('/remote').on('connection', function(socket){
    socket.emit('event', {hello: 'world'});

    socket.on('response', function(data){
        console.log(data);
    });

    socket.on('disconnect', function(){
        console.log('Disconnecting');
    });

    // Up Action
    socket.on('up', function(data){
        console.log('Up - ' + data.action);
    });

    // Down Action
    socket.on('down', function(data){
        console.log('Down - ' + data.action);
    });

    // Left Action
    socket.on('left', function(data){
        console.log('Left - ' + data.action);
    });

    // Right Action
    socket.on('right', function(data){
        console.log('Right - ' + data.action);
    });
});

server.listen(3000);
