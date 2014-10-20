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
                $scope.serialLogs = [];
                $scope.proxyLogs = [];

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
                    },
                    onSerialLog = function (data) {
                        $scope.serialLogs.push(JSON.stringify(data));
                    },
                    onProxyLog = function (data) {
                        $scope.proxyLogs.push(JSON.stringify(data));
                    },
                    onRobotDisconnecting = function () {
                        $state.go('dashboard');
                    };

                gamepad.on('gamepad_connected', onGamepadConnected);

                gamepad.on('gamepad_disconnected', onGamepadDisconnected);

                gamepad.on('up_pressed', function (gamepad) {
                    console.log('gamepad: ', gamepad);
                }); 

                // When the robot disconnects, go back to the dashboard
                socket.on('robotDisconnecting', onRobotDisconnecting);

                // Listen for serial and proxy logs to append to the log list
                socket.on('serialLog', onSerialLog);
                socket.on('proxyLog', onProxyLog);

                // Make sure we unsubscribe any listeners when this scope is destroyed and
                // disconnect the remote-control
                $scope.$on('$destroy', function () {
                    destroyOnStateChangeStart();
                    gamepad.off('gamepad_connected', onGamepadConnected);
                    gamepad.off('gamepad_disconnected', onGamepadDisconnected);
                    socket.removeListener('robotDisconnecting', onRobotDisconnecting);
                    socket.removeListener('serialLog', onSerialLog);
                    socket.removeListener('proxyLog', onProxyLog);
                });
            }
        ]);
});
