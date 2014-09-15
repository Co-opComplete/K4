define([
    'angular',
    'services',
    'gamepad/gamepad',
    'gamepad/controller'
], function (angular, services) {
    'use strict';
    
    /* Directives */
    angular.module('app.directives', ['app.services'])
        .directive('appVersion', ['version', function (version) {
                return function (scope, elm, attrs) {
                    elm.text(version);
                };
        }])
        .directive('k4Controller', [function () {
            return {
                link: function (scope, element, attrs) {
                        // Start up the controller support
                        controller.init();
                        gamepadSupport.init();
                    }
            };
        }]);
});
