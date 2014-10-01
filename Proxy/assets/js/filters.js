define([
    'angular'
], function (angular) {
    
    /* Filters */
    angular.module('app.filters', ['app.services'])
        .filter('interpolate', ['version', function (version) {
            return function (text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }]);
});
