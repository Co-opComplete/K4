var utils = require('./utils'),
    _ = require('lodash');

module.exports = function (app) {  
    _.each(utils.getModulesInDirectory(app.get('paths').routes, ['_', '.']), function(route) {
        require(route)(app);
    });
};
