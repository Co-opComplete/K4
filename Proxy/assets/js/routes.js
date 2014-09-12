define([
    'angular',
    'app'
], function (angular, app) {
    
    return app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'assets/partials/control.html',
            controller: 'controller'
        });
        $routeProvider.otherwise({redirectTo: '/'});
    }]);
});
