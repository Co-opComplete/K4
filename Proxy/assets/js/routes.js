define([
    'angular',
    'app'
], function (angular, app) {
    
    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // For any unmatched url redirect to the dashboard
        $urlRouterProvider.otherwise('/');

        // Setup the states
        $stateProvider.state('base', {
            url: '/',
            views: {
                'content': {
                    templateUrl: 'assets/partials/dashboard.html',
                    controller: 'dashboard'
                }
            }
        })
        .state('control', {
            url: '/control',
            views: {
                'content': {
                    templateUrl: 'assets/partials/control.html',
                    controller: 'robotRoom'
                }
            }
        });
    }]);
});
