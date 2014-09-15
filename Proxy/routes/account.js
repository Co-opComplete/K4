var authenticate = require('../middleware/authenticate');

module.exports = function(app) {
    router = app.get('routers').authed;

    router.get('/account', function(req, res) {
        User.findById(req.session.passport.user, function(err, user) {
            if(err) {
                console.log(err);
            } else {
                res.render('account', { user: user});
            }
        });
    });
};
