define([
    'angular',
    'socketio',
    'services/gamepad',
    'services/remote-control'
], function (angular, io) {
    
    /* Services */
    angular.module('app.services', [
        'app.services.gamepad',
        'app.services.remoteControl'
    ])
        // Websocket
        .factory('socket', ['socketFactory', function (socketFactory) {
            var clientSocket = io.connect('/remote');
            console.log('created socket');
            return socketFactory({
                ioSocket: clientSocket
            });
        }])
        .value('version', '0.1');
});
