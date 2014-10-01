define([
    'angular'
], function (angular) {
    'use strict';

    /* Directives */
    angular.module('app.directives.control', ['app.services'])
        .directive('k4Controller', ['gamepad', function (gamepad) {
            return {
                link: function (scope, el, attrs) {
                        // Start up the controller support
                        //controller.controller.init();
                        //controller.gamepadSupport.init();
                    }
            };
        }]);
});
