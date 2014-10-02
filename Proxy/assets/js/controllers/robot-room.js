define([
    'angular'
], function (angular) {
    'use strict';

    angular.module('app.controllers.robot-room', ['app.services'])
        .controller('robotRoom', [
            '$rootScope',
            '$scope',
            '$state',
            'gamepad',
            'remoteControl',
            'socket',
            function ($rootScope, $scope, $state, gamepad, remoteControl, socket) {
                $scope.gamepads = gamepad.gamepads;
                $scope.gamepadSupported = gamepad.gamepadSupported;
                $scope.gamepadConnected = gamepad.gamepadConnected;

                // Make sure when we leave this page, we are announcing the destruction
                // of the connection
                var destroyOnStateChangeStart = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                        socket.emit('disconnectFromRobot');
                    }),
                    onGamepadConnected = function () {
                        $scope.gamepadConnected = true;
                    },
                    onGamepadDisconnected = function () {
                        if (!this.length) {
                            $scope.gamepadConnected = false;
                        }
                    };

                gamepad.on('gamepad_connected', onGamepadConnected);

                gamepad.on('gamepad_disconnected', onGamepadDisconnected);

                gamepad.on('up_pressed', function (gamepad) {
                    console.log('gamepad: ', gamepad);
                }); 

                socket.on('robotDisconnecting', function () {
                    console.log('got here');
                    $state.go('dashboard');
                });

                // Make sure we unsubscribe any listeners when this scope is destroyed
                $scope.$on('$destroy', function () {
                    destroyOnStateChangeStart();
                    gamepad.off('gamepad_connected', onGamepadConnected);
                    gamepad.off('gamepad_disconnected', onGamepadDisconnected);
                });
            }
        ]);
});
