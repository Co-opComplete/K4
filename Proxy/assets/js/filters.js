define([
    'angular',
    'services'
], function (angular, services) {
    
    /* Filters */
    angular.module('app.filters', ['app.services'])
        .filter('interpolate', ['version', function (version) {
            return function (text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }]);
});
