var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    //engine = require('engine.io'),
    nconf = require('nconf'),
    //RedisStore = require('socket.io/lib/stores/redis'),
    //redis = require('socket.io/node_modules/redis'),
    //pub = redis.createClient(),
    //sub = redis.createClient(),
    //client = redis.createClient(),
    sugar = require('sugar'),
    swig = require('swig'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    // LocalStrategy = require('passport-local').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    sockets;

// Set port
app.configure(function(){
    app.set('port', 8000);
});

// connect to the database
mongoose.connect('mongodb://localhost/K4');

// create a user model
var User = mongoose.model('User', {
    oauthID: Number,
    name: String
});

// passport.use(new LocalStrategy( function(username, password, done) {
//     process.nextTick( function() {
//         // Auth check logic
//     });
// }));

passport.use(new GitHubStrategy({
    // clientID: '124f0309abe008b9a88e',
    // clientSecret: 'e680ffa1851db07a4dbdc947e61b535ee70ed665',
    // callbackURL: 'http://k4-dev.cmgeneral.local:8000/auth/github/callback'
    clientID: 'a82cde9a46d14ea1209f',
    clientSecret: '39940c2a559af15dff833b523f554f9778090d1c',
    callbackURL: 'http://localhost:8000/auth/github/callback'
}, function(accessToken, refreshToken, profile, done) {
    // process.nextTick(function() {
    //     return done(null, profile);
    // });
    User.findOne({ oauthID: profile.id }, function(err, user) {
        if(err) { console.log(err); }
        if (!err && user !== null) {
            done(null, user);
        } else {
            var user = new User({
                oauthID: profile.id,
                name: profile.displayName,
                created: Date.now()
            });
            user.save(function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Saving user...");
                    done(null, user);
                }
            });
        }
    });
}
));

passport.serializeUser( function(user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});
passport.deserializeUser( function(id, done) {
    User.findById(id, function(err, user) {
        console.log(user);
        if (!err) { done(null, user); }
        else { done(err, null); }
    });
});

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
        robots[0].emit('controller', data);
    });

    // Up Action
    socket.on('up', function(data){
        console.log('Up - ' + data.action);
        //socket.in('robot').send('up');
        if(data.action === 'released') {
            robots[0].send('up');
        }
    });

    // Down Action
    socket.on('down', function(data){
        console.log('Down - ' + data.action);
        //socket.in('robot').send('down');
        if(data.action === 'released') {
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
app.use('/assets', express.static('assets'));
// Swig Templating Engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({cache: false});
// app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'my_precious' }));

/*******************************
------ Setup for Passport -------
********************************/
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

/*******************************
------ Express routes ----------
********************************/
require('./lib/routes.js')(app);

server.listen(app.get('port'));
// console.log('Running on http://k4-dev.cmgeneral.local:' + app.get('port'));
console.log('Running on http://localhost:' + app.get('port'));
