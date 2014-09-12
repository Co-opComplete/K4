var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
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

// connect to the database
mongoose.connect('mongodb://localhost/K4');

// create a user model
var User = mongoose.model('User', {
    oauthID: Number,
    name: String
});

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
            user = new User({
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

server.listen(app.get('port'));

// Set up the proxy sockets for communication between the remote client and the robots
require('./lib/sockets.js')(io);

// Setup config
nconf.file({file: 'conf/config.json'});
nconf.load();

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
------ Setup for Passport -------
********************************/
app.use(passport.initialize());
app.use(passport.session());

/*******************************
------ Express routes ----------
********************************/
require('./lib/routes.js')(app);
