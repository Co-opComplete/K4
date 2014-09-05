module.exports = function(app) {
    // Home Url
    app.get('/', function(req, res){
        res.render('control', {port: app.get('port')});
    });
};
