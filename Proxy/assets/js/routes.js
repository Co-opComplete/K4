define([
    'angular',
    'app'
], function (angular, app) {
    
    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // For any unmatched url redirect to the dashboard
        $urlRouterProvider.otherwise('/');

        // Setup the states
        $stateProvider.state('dashboard', {
            url: '/',
            resolve: {
                'socket': 'socket'
            },
            views: {
                'content': {
                    templateUrl: 'assets/partials/dashboard.html',
                    controller: 'dashboard'
                }
            }
        })
        .state('robot-room', {
            url: '/robot-room',
            resolve: {
                'remoteControl': 'remoteControl'
            },
            views: {
                'content': {
                    templateUrl: 'assets/partials/robot-room.html',
                    controller: 'robotRoom'
                }
            },
            onEnter: function (remoteControl) {
                remoteControl.connect();
            },
            onExit: function (remoteControl) {
                remoteControl.disconnect();
            }
        });
    }]);
});
