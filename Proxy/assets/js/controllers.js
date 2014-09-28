define([
    'angular',
    'services',
    'controllers/dashboard',
    'controllers/robot-room'
], function (angular) {
    
    /* Controllers */
    return angular.module('app.controllers', [
        'app.services',
        'app.controllers.dashboard',
        'app.controllers.robot-room'
    ]); 
});
