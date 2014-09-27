var utils = require('./utils'),
    path = require('path'),
    _ = require('lodash');

module.exports = function (app, io) {
    var rooms = app.get('rooms');
    // Websocket variables
    app.set('websocketConnections', {
        robots: {},
        clients: {}
    });

    _.each(utils.getModulesInDirectory(app.get('paths').websockets, ['_', '.']), function(websocket) {
        rooms[path.basename(websocket, '.js')] = require(websocket)(app, io);
        app.set('rooms', rooms);
    });
};
