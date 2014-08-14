var passport = require('passport');

module.exports = function(app){
    // Home Url
    // app.get('/', function(req, res){
    //     res.render('base', {port: app.get('port')});
    // });
    app.get('/', ensureAuthenticated, function(req, res) {
        res.render('base', { user: req.user});
    });

    // Login
    app.get('/login', function(req, res) {
        res.render('login', { user: req.user });
    });
    // app.post('/login',
    //     passport.authenticate('local', {
    //         successRedirect: '/loginSuccess',
    //         failureRedirect: '/loginFailure'
    //     })
    // );
    // app.get('/loginFailure', function(req, res, next) {
    //     res.send('Failure to authenticate');
    // });
    // app.get('/loginSuccess', function(req, res, next) {
    //     res.send('Successfully authenticated');
    // });

    app.get('/account', ensureAuthenticated, function(req, res) {
        res.render('account', { user: req.user});
    });

    // 403
    app.get('/403', function(req, res) {
        res.render('403', {});
    });

    // Logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    // Github OAuth
    app.get('/auth/github', passport.authenticate('github'), function(req, res) {});

    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
        res.redirect('/');
    });

};

// test authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}
