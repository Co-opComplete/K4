define([
    'angular',
], function (angular) {
    'use strict';

    /* Directives */
    angular.module('app.directives.robot-list', ['app.services'])
        .directive('robotList', ['socket', function (socket) {
            return {
                link: function (scope, el, attrs) {
                    }
            };
        }]);
});
