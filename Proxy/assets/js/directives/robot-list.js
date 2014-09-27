define([
    'angular',
    'services',
    'websocket',
    'gamepad/gamepad',
    'gamepad/controller'
], function (angular, services, socket) {
    'use strict';

    /* Directives */
    angular.module('app.directives.robot-list', ['app.services'])
        .directive('robotList', [function () {
            return {
                link: function (scope, el, attrs) {
                        socket.on('updateRobots', function (data) {
                            console.log('robots data: ', data);
                        });
                    }
            };
        }]);
});
