module.exports = function (app) {
    router = app.get('routers').authed;

    router.use(function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log('got here');
            app.locals.user = req.user;
            return next();
        } else {
            res.redirect('/login');
        }
    });
};
