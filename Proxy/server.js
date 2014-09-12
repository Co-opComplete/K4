var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
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

app.set('sessionSecret', '924e7df028edae457068783e6ebd5dc0');

// connect to the database
mongoose.connect('mongodb://localhost/K4');

/*******************************
----- Authentication Setup -----
*******************************/
require('./lib/auth.js');

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
app.use(session({
    secret: app.get('sessionSecret'),
    resave: true,
    saveUninitialized: true
    }
));
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
