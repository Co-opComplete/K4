define([
    'angular',
], function (angular) {
    'use strict';

    angular.module('app.controllers.dashboard', ['app.services'])
        .controller('dashboard', [
            '$scope',
            'socket',
            '$state',
            function ($scope, socket, $state) {
                $scope.test = 'Test Variable';
                $scope.robots = {};
                $scope.connectError = null;

                var onConnectSuccess = function () {
                        $state.go('control');
                    },
                    onConnectError = function (msg) {
                        $scope.connectError = msg;
                    },
                    onUpdateRobots = function (robots) {
                        console.log('robots: ', robots);
                        $scope.robots = robots;
                    };

                // Callback for the connect button
                $scope.connect = function (socketId) {
                    console.log('connecting to: ', socketId);
                    socket.emit('connectToRobot', socketId);
                };

                socket.on('connectSuccess', onConnectSuccess);

                // Connect failure listener
                socket.on('connectError', onConnectError);

                // Listener for updating the list of robots
                socket.on('updateRobots', onUpdateRobots);

                // Kick off initialization
                socket.emit('initDashboard');

                $scope.$on('$destroy', function () {
                    socket.removeListener('connectSuccess', onConnectSuccess);
                    socket.removeListener('connectError', onConnectError);
                    socket.removeListener('updateRobots', onUpdateRobots);
                });
            }
        ]);
});
