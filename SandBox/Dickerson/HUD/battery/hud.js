var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io').listen(server),
    nconf = require('nconf'),
    RedisStore = require('socket.io/lib/stores/redis'),
    redis = require('socket.io/node_modules/redis'),
    pub = redis.createClient(),
    sub = redis.createClient(),
    client = redis.createClient(),
    sugar = require('sugar');
    
var batteryPower = 100;


var clients = [];

// Setup redis store for socket.io
io.set('store', new RedisStore({
    redisPub: pub,
    redisSub: sub,
    redisClient: client
}));

// Setup config
nconf.file({file: 'conf/config.json'});
nconf.load();

io.of('/hud').on('connection', function(socket){
    clients.push(socket);

    socket.on('response', function(data){
        console.log(data);
    });

    socket.on('disconnect', function(){
        console.log('Disconnecting');
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
    });

    setInterval(function() 
    {
      socket.emit('battery', {power: batteryPower});
    }, 150);
});

setInterval(function()
{
  batteryPower = batteryPower > 0 ? batteryPower - 1 : 100;
}, 150);

server.listen(3002);
