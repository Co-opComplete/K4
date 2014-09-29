define([
    'angular',
    'services'
], function (angular, services) {
    'use strict';

    angular.module('app.controllers.robot-room', ['app.services'])
        .controller('robotRoom', ['$scope', 'version', 'gamepad', function ($scope, version, gamepad) {
            $scope.scopedAppVersion = version;
            $scope.gamepads = gamepad.gamepads;
            $scope.gamepadSupported = gamepad.gamepadSupported;
            $scope.gamepadConnected = gamepad.gamepadConnected;

            console.log('connected: ', gamepad.gamepadConnected);

            gamepad.on('gamepad_connected', function () {
                $scope.gamepadConnected = true;
                console.log('got here');
            });

            gamepad.on('gamepad_disconnected', function () {
                if (!this.length) {
                    $scope.gamepadConnected = false;
                }
            });

            gamepad.on('up_pressed', function () {
                console.log('up pressed');
                console.log('gamepad: ', this);
            });
        }]);
});
