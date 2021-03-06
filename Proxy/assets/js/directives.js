define([
    'angular',
    'directives/video',
    'directives/control',
    'directives/context-menu',
    'directives/robot-list'
], function (angular) {
    'use strict';

    /* Directives */
    angular.module('app.directives', [
        'app.services',
        'app.directives.video',
        'app.directives.control',
        'app.directives.contextMenu',
        'app.directives.robot-list'
    ]);
});
