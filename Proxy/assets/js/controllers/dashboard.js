define([
    'angular',
    'services'
], function (angular, services) {
    'use strict';

    angular.module('app.controllers.dashboard', ['app.services'])
        .controller('dashboard', ['$scope', 'socket', function ($scope, socket) {
            console.log('socket: ', socket);
            $scope.test = 'Test Variable';
        }]);
});
