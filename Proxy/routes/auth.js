var passport = require('passport');

module.exports = function (app) {
    // Login
    app.get('/login', function(req, res) {
        res.render('login', { user: req.user });
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
