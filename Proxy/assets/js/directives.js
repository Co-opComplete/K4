define([
    'jquery',
    'lodash',
    'angular',
    'services',
    'directives/video',
    'directives/control',
    'gamepad/gamepad',
    'gamepad/controller'
], function ($, _, angular, services) {
    'use strict';

    function onAddIceCandidateSuccess () {
        console.log('Remote candidate added successfully');
    }
    
    function onAddIceCandidateError (err) {
        console.log('Error adding ice candidate: ', err);
    }

    /* Directives */
    angular.module('app.directives', [
        'app.services',
        'app.directives.video',
        'app.directives.control'
    ]);
});
