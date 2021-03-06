var os = require('os'),
    config = require('getconfig'),
    colors = require('colors'),
    ifaces = os.networkInterfaces(),
    _ = require('lodash'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    nconf = require('nconf'),
    sugar = require('sugar'),
    swig = require('swig'),
    dbAddress = process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT,
    sockets;

console.log('got here!!!!!!!!');

// Config colors for logging
colors.setTheme(config.colors);

app.set('port', 8000);
app.set('rootPath', __dirname);

// Rooms
app.set('rooms', {});

// Client-to-Robot connections
app.set('connections', {});

// Global Paths
app.set('paths', {
    views: path.join(app.get('rootPath'), 'views'),
    assets: path.join(app.get('rootPath'), 'assets'),
    routes: path.join(app.get('rootPath'), 'routes'),
    middleware: path.join(app.get('rootPath'), 'middleware'),
    websockets: path.join(app.get('rootPath'), 'websockets'),
    conf: path.join(app.get('rootPath'), 'conf'),
    lib: path.join(app.get('rootPath'), 'lib')
});

// Secret for session storage
app.set('sessionSecret', '924e7df028edae457068783e6ebd5dc0');

// Get this machine's ip address for websocket clients to use
_.each(_.keys(ifaces), function (iface) {
    if (iface !== 'lo') {
        var info = _.filter(ifaces[iface], function (details) {
                return details.family === 'IPv4' && !details.internal;
            });
        if (info.length > 0) {
            app.set('ipAddress', info[0].address);
            return false;
        }
    }
});

// connect to the database
mongoose.connect('mongodb://' + dbAddress + '/K4');

/*******************************
----- Authentication Setup -----
*******************************/
require('./lib/auth.js');

server.listen(app.get('port'));

// Set up the proxy sockets for communication between the remote client and the robots
require('./lib/websockets.js')(app, io);

// Setup config
nconf.file({file: 'conf/config.json'});
nconf.load();

/*******************************
------ Setup for Express -------
********************************/
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));
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
 Express routes and middleware
********************************/
require('./lib/middleware.js')(app);
require('./lib/routes.js')(app);
