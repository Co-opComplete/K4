module.exports = function(app){  
    var fs = require('fs'),
        path = require('path'),
        _ = require('lodash');

    // This function scrapes the routes directory for route modules
    function getRoutes(dirPath) {
        var files = fs.readdirSync(dirPath),
            routes = [];
        _.each(files, function(file) {
            var filePath = path.join(dirPath, file),
                fileStat = fs.statSync(filePath);
            if(fileStat.isDirectory()) {
                routes = routes.concat(getRoutes(filePath));
            }else{
                // Only include .js files and don't include files that start with "_"
                if(fileStat.isFile() && path.basename(file).charAt(0) !== '_' && path.extname(file) === '.js') {
                    routes.push(filePath);
                }
            }
        });
        return routes;
    }

    _.each(getRoutes(app.get('paths').routes), function(route) {
        require(route)(app);
    });
};
