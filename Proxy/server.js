var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require('path'),
    //engine = require('engine.io'),
    nconf = require('nconf'),
    //RedisStore = require('socket.io/lib/stores/redis'),
    //redis = require('socket.io/node_modules/redis'),
    //pub = redis.createClient(),
    //sub = redis.createClient(),
    //client = redis.createClient(),
    sugar = require('sugar'),
    swig = require('swig'),
    sockets;

app.set('port', 8000);
app.set('rootPath', __dirname);

/***************************************************************************
* Global Paths
***************************************************************************/
app.set('paths', {
    views: path.join(app.get('rootPath'), 'views'),
    assets: path.join(app.get('rootPath'), 'assets'),
    routes: path.join(app.get('rootPath'), 'routes'),
    conf: path.join(app.get('rootPath'), 'conf'),
    lib: path.join(app.get('rootPath'), 'lib')
});

server.listen(app.get('port'));

/*
sockets = engine.attach(server);

sockets.on('connection', function(socket) {
    console.log('got connection');

    socket.on('message', function (data) {
        console.log('got message: ', data);

        socket.send('OMGZ it worked!!');
    });
});
*/

var clients = [];
var robots = [];

/*
// Setup redis store for socket.io
io.set('store', new RedisStore({
    redisPub: pub,
    redisSub: sub,
    redisClient: client
}));
*/

// Setup config
nconf.file({file: 'conf/config.json'});
nconf.load();

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

/*******************************
------ Setup for Express -------
********************************/
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/assets', express.static('assets'));
// Swig Templating Engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({cache: false});

/*******************************
------ Express routes ----------
********************************/
require('./lib/routes.js')(app);
