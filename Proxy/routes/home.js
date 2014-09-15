var authenticate = require('../middleware/authenticate');

module.exports = function(app) {
    router = app.get('routers').authed;

    // Home Url
    router.get('/', function(req, res){
        res.render('control', {
            port: app.get('port'),
            serverIp: app.get('ipAddress')
        });
    });
};
