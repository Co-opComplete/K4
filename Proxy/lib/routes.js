var passport = require('passport');

module.exports = function(app){
    // Home Url
    app.get('/', function(req, res){
        res.render('base', {port: app.get('port')});
    });

    // Login
    app.get('/login', function(req, res) {
        res.render('login', {});
    });
    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/loginSuccess',
            failureRedirect: '/loginFailure'
        })
    );
    app.get('/loginFailure', function(req, res, next) {
        res.send('Failure to authenticate');
    });
    app.get('/loginSuccess', function(req, res, next) {
        res.send('Successfully authenticated');
    });

    // 403
    app.get('/403', function(req, res) {
        res.render('403', {});
    });

    // Github OAuth
    app.get('/auth/github', passport.authenticate('github'));

    app.get('/auth/github/callback', passport.authenticate('github', {
        successRedirect: '/success',
        failureRedirect: '/error'
    }));

    app.get('/success', function(req, res, next) {
        res.send('Successfully logged in.');
    });

    app.get('/error', function(req, res, next) {
        res.send('Error logging in.');
    });
};
