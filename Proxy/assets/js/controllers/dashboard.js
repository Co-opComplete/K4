define([
    'angular',
    'services'
], function (angular, services) {
    'use strict';

    angular.module('app.controllers.dashboard', ['app.services'])
        .controller('dashboard', ['$scope', 'socket', function ($scope, socket) {
            $scope.test = 'Test Variable';
        }]);
});
