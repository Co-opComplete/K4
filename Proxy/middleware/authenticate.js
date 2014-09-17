module.exports = function (app) {
    var router = app.get('routers').authed;

    router.use(function (req, res, next) {
        if (req.isAuthenticated()) {
            app.locals.user = req.user;
            return next();
        } else {
            res.redirect('/login');
        }
    });
};
