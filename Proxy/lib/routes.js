module.exports = function(app){
    // Home Url
    app.get('/', function(req, res){
        res.render('base', {port: app.get('port')});
    });

    // Login
    app.get('/login', function(req, res) {
        res.render('login', {});
    });

    // 403
    app.get('/403', function(req, res) {
        res.render('403', {});
    });
};
