var authenticate = require('../middleware/authenticate');

module.exports = function(app) {
    // Home Url
    app.get('/', authenticate, function(req, res){
        res.render('control', {port: app.get('port')});
    });
};
