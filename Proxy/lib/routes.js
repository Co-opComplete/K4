module.exports = function(app){
    // Home Url
    app.get('/', function(req, res){
        res.render('base', {port: app.get('port')});
    });
};
