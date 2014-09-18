var utils = require('./utils'),
    _ = require('lodash');

module.exports = function (app, io) {
    // Websocket variables
    app.set('websocketConnections', {
        robots: [],
        clients: {}
    });

    _.each(utils.getModulesInDirectory(app.get('paths').websockets, ['_', '.']), function(websocket) {
        require(websocket)(app, io);
    });
};
