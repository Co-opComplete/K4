var utils = require('./utils'),
    _ = require('lodash');

module.exports = function (app) { 
    _.each(utils.getModulesInDirectory(app.get('paths').middleware, ['_', '.']), function(middleware) {
        require(middleware)(app);
    });
};
