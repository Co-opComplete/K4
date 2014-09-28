define([
    'angular',
    'services'
], function (angular, services) {
    'use strict';

    angular.module('app.controllers.robot-room', ['app.services'])
        .controller('robotRoom', ['$scope', 'version', 'gamepad', function ($scope, version, gamepad) {
            $scope.scopedAppVersion = version;
            gamepad.on('up_pressed', function () {
                console.log('up pressed');
                console.log('gamepad: ', this);
            });
        }]);
});
