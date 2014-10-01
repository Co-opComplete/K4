define([
    'jquery',
    'angular',
], function ($, angular) {
    'use strict';

    /* Directives */
    angular.module('app.directives.contextMenu', ['app.services'])
        .directive('k4ContextMenu', ['gamepad', function (gamepad) {
            return {
                templateUrl: 'assets/partials/contextMenu.html',
                link: function (scope, el, attrs) {
                    var menuOpen = false,
                        $el = $(el),
                        $menu = $el.find('.context-menu'),
                        // Event listener for the up button
                        onUpPressed = function () {
                            var activeItem = $menu.find('li.active');

                            // Deactivate the current item
                            activeItem.removeClass('active');

                            // Determine which item is next and activate it
                            if (activeItem.prev().length) {
                                activeItem.prev().addClass('active');
                            } else {
                                activeItem.siblings().last().addClass('active');
                            }
                        },
                        // Event listener for the down button
                        onDownPressed = function () {
                            var activeItem = $menu.find('li.active');

                            // Deactivate the current item
                            activeItem.removeClass('active');

                            // Determine which item is next and activate it
                            if (activeItem.next().length) {
                                activeItem.next().addClass('active');
                            } else {
                                activeItem.siblings().first().addClass('active');
                            }
                        };

                    // Open the menu when the option 2 button is clicked
                    gamepad.on('start_pressed', function () {
                        // Toggle the class
                        $el.toggleClass('active');

                        if (menuOpen) {
                            // Unsubscribe to the navigation buttons
                            gamepad.off('up_pressed', onUpPressed);
                            gamepad.off('down_pressed', onDownPressed);

                            // Reset the active item to the first item, but wait for
                            // the animation to finish.
                            setTimeout(function () {
                                $menu.find('li.active').removeClass('active').parent().children('li').first().addClass('active');
                            }, 500);
                        } else {
                            // Center the menu
                            $menu.css({
                                'margin-left': ($menu.outerWidth() / 2) * -1,
                                'margin-top': ($menu.outerHeight() / 2) * -1
                            });

                            // Subscribe to the navigation buttons
                            gamepad.on('up_pressed', onUpPressed);
                            gamepad.on('down_pressed', onDownPressed);
                        }

                        // Update the menuOpen status
                        menuOpen = !menuOpen; 
                    });
                }
            };
        }]);
});
