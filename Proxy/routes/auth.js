var passport = require('passport'),
    GitHubApi = require('github'),
    _ = require('lodash'),
    github = new GitHubApi({
        version: '3.0.0',
        protocol: 'https'
    });

module.exports = function (app) {
    // Login 

    app.route('/login')
        .get(function(req, res) {
            console.log('got to login get method');
            if (req.isAuthenticated()) {
                res.redirect('/');
            } else {
                res.render('login', { user: req.user , messages: req.session.messages});
            }
        })
        .post(function (req, res, next) {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    console.log('Error authenticating:'.error, JSON.stringify(err, null, 2).error);
                    return next(err);
                }
                // Redirect to login with a message if failed
                if (!user) {
                    req.session.messages = [info.message];
                    console.log('Could not find user: '.info, JSON.stringify(info, null, 2).info);
                    return res.redirect('/login');
                }
                // Log the user in
                req.logIn(user, function (err) {
                    if (err) {
                        console.log('Error loggin user in: '.error, JSON.stringify(err, null, 2).error);
                        return next(err);
                    }
                    return res.redirect('/');
                });
            })(req, res, next);
        });

    // Logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    // Github OAuth
    app.get('/auth/github', passport.authenticate('github'), function(req, res) {});

    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
        // Use the oauth token to authenticate the following github requests
        github.authenticate({
            type: 'oauth',
            token: req.user.oauthToken
        });
        github.user.getOrgs({}, function (err, orgs) {
            // Only allow users who are in the DTInteractive organization
            _.filter(orgs, function (org) {
                return org.login === 'dtinteractive';
            });
            if (orgs.length > 0) {
                res.redirect('/');
            } else {
                req.logout();
                res.redirect('/login');
            }
        });
    });
};
