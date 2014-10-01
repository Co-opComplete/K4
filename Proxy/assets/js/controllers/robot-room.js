define([
    'angular'
], function (angular) {
    'use strict';

    angular.module('app.controllers.robot-room', ['app.services'])
        .controller('robotRoom', [
            '$scope',
            'version',
            'gamepad',
            'remoteControl',
            function ($scope, version, gamepad, remoteControl) {
                console.log('remoteControl: ', remoteControl);
                $scope.scopedAppVersion = version;
                $scope.gamepads = gamepad.gamepads;
                $scope.gamepadSupported = gamepad.gamepadSupported;
                $scope.gamepadConnected = gamepad.gamepadConnected;

                gamepad.on('gamepad_connected', function () {
                    $scope.gamepadConnected = true;
                });

                gamepad.on('gamepad_disconnected', function () {
                    if (!this.length) {
                        $scope.gamepadConnected = false;
                    }
                });

                gamepad.on('up_pressed', function (gamepad) {
                    console.log('gamepad: ', gamepad);
                });
            }
        ]);
});
