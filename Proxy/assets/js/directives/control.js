define([
    'angular',
    'services',
    'gamepad/gamepad',
    'gamepad/controller'
], function (angular, services) {
    'use strict';

    /* Directives */
    angular.module('app.directives.control', ['app.services'])
        .directive('k4Controller', [function () {
            return {
                link: function (scope, el, attrs) {
                        // Start up the controller support
                        controller.init();
                        gamepadSupport.init();
                    }
            };
        }]);
});
