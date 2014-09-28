define([
    'angular',
    'filters',
    'services',
    'directives',
    'controllers',
    'angularUIRouter',
    'angularSocketIO'
], function (angular, filters, services, directives, controllers) {
    'use strict';

    var app = angular.module('app', [
            'ui.router',
            'btford.socket-io',
            'app.filters',
            'app.services',
            'app.directives',
            'app.controllers'
        ]);

    app.config(function ($locationProvider) {
        // Configure angular to use the history API for navigation
        $locationProvider.html5Mode(true);
    });

    return app;
});
