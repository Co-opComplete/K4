define([
    'angular',
    'services',
    'filters',
    'directives',
    'controllers',
    'angularUIRouter',
    'angularSocketIO'
], function (angular) {
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
