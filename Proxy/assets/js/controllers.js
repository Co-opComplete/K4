define([
    'angular',
    'services'
], function (angular) {
    
    /* Controllers */
    return angular.module('app.controllers', ['app.services'])
        .controller('controller', ['$scope', 'version', function ($scope, version) {
            $scope.scopedAppVersion = version;
        }]);
});
