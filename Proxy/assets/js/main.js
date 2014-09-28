define([
    'jquery',
    'angular',
    'app',
    'routes'
], function ($, angular, app, routes) {
    'use strict';

    $(function(){
        angular.resumeBootstrap([app.name]);
    });  
});
