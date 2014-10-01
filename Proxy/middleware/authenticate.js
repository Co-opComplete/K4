var _ = require('lodash');

module.exports = function (app) {
    var ignoredPaths = [
        '/login',
        '/logout',
        '/auth/github',
        '/auth/github/callback',
        '/favicon.ico' // Holy shit this was annoying
    ];

    app.use(function (req, res, next) {
        // Skip if this is a path where authentication is not needed
        if (_.indexOf(ignoredPaths, req.path.replace(/\/$/g,'')) >= 0) {
            return next();
        }

        // Check if the user is authenticated and set the user as a local
        // variable for templates
        if (req.isAuthenticated()) {
            app.locals.user = req.user;
            return next();
        } 
        res.redirect('/login');
    });
};
