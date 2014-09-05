module.exports = function(app) {
    // Login
    app.get('/login', function(req, res) {
        res.render('login', {});
    });
};
