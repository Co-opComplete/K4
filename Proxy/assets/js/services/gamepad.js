define([
    'jquery',
    'angular',
    'lodash'
], function ($, angular, _) {
    'use strict';

    angular.module('app.services.gamepad', ['app.services'])
        .factory('gamepad', ['$rootScope', 'socket', function ($rootScope, socket) {
            var generateUUID = function () {
                    var d = new Date().getTime(),
                        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            var r = (d + Math.random()*16)%16 | 0;
                            d = Math.floor(d/16);
                            return (c==='x' ? r : (r&0x7|0x8)).toString(16);
                        });
                    return uuid;
                },
                
                // This class will be exposed to the user of this service
                GamepadService = function () {
                    // The canonical list of attached gamepads, without “holes” (always
                    // starting at [0]) and unified between Firefox and Chrome.
                    this.gamepads = [];

                    // A boolean indicating whether or not the gamepad API is supported
                    // on this browser
                    this.gamepadSupported = navigator.getGamepads ||
                        !!navigator.webkitGetGamepads ||
                        !!navigator.webkitGamepads;

                    // A flag to indicate whether or not a gamepad is connected
                    this.gamepadConnected = false;

                    // A dictionary of event listeners. The keys will be UUID's and the value
                    // will be a function. This is used to remove event listeners in an
                    // orderly fashion.
                    this.__listeners = {};

                    var that = this,
                        // A number of typical buttons recognized by Gamepad API and mapped to
                        // standard controls. Any extraneous buttons will have larger indexes.
                        TYPICAL_BUTTON_COUNT = 16,

                        // A number of typical axes recognized by Gamepad API and mapped to
                        // standard controls. Any extraneous buttons will have larger indexes.
                        TYPICAL_AXIS_COUNT = 4,

                        // Whether we’re requestAnimationFrameing like it’s 1999.
                        ticking = false,

                        // Remembers the connected gamepads at the last check; used in Chrome
                        // to figure out when gamepads get connected or disconnected, since no
                        // events are fired.
                        prevRawGamepadTypes = [],

                        // Previous timestamps for gamepad state; used in Chrome to not bother with
                        // analyzing the polled data if nothing changed (timestamp is the same
                        // as last time).
                        prevTimestamps = [],

                        // Previous states for gamepad buttons; will be either a 1 (pressed) or
                        // a 0 (released).
                        prevButtonStates = [],

                        // Previous states for gamepad axes; will be a float value between -1.00
                        // and 1.00
                        prevAxesStates = [], 

                        // A collection of events to fire when the state of the controller changes
                        gamepadEvents = [],

                        /*
                        * Helper function for creating custom events for a controller
                        */
                        createGamepadEvents = function (gamepad) {
                            var detail = {
                                gamepad: gamepad
                            };
                            return {
                                aPressed: new CustomEvent('a_pressed', {
                                        detail: detail
                                    }),
                                xPressed: new CustomEvent('x_pressed', {
                                        detail: detail
                                    }),
                                yPressed: new CustomEvent('y_pressed', {
                                        detail: detail
                                    }),
                                bPressed: new CustomEvent('b_pressed', {
                                        detail: detail
                                    }),
                                leftBumperPressed: new CustomEvent('left_bumper_pressed', {
                                        detail: detail
                                    }),
                                rightBumperPressed: new CustomEvent('right_bumper_pressed', {
                                        detail: detail
                                    }),
                                backPressed: new CustomEvent('back_pressed', {
                                        detail: detail
                                    }),
                                startPressed: new CustomEvent('start_pressed', {
                                        detail: detail
                                    }),
                                leftStickPressed: new CustomEvent('left_stick_pressed', {
                                        detail: detail
                                    }),
                                rightStickPressed: new CustomEvent('right_stick_pressed', {
                                        detail: detail
                                    }),
                                upPressed: new CustomEvent('up_pressed', {
                                        detail: detail
                                    }),
                                downPressed: new CustomEvent('down_pressed', {
                                        detail: detail
                                    }),
                                leftPressed: new CustomEvent('left_pressed', {
                                        detail: detail
                                    }),
                                rightPressed: new CustomEvent('right_pressed', {
                                        detail: detail
                                    }),
                                superPressed: new CustomEvent('super_pressed', {
                                        detail: detail
                                    }),
                                leftStickChanged: new CustomEvent('left_stick_changed', {
                                        detail: detail
                                    }),
                                rightStickChanged: new CustomEvent('right_stick_changed', {
                                        detail: detail
                                    }),
                                gamepadChanged: new CustomEvent('gamepad_changed', {
                                        detail: detail
                                    }),
                                axesChanged: new CustomEvent('axes_changed', {
                                        detail: detail
                                    })
                            };
                        },

                        /**
                        * React to the gamepad being connected.
                        */
                        onGamepadConnect = function(event) {
                            var gamepadEvents = createGamepadEvents(event.gamepad),
                                gamepadConnectedEvent;

                            // Add the new gamepad on the list of gamepads to look after.
                            that.gamepads.push(event.gamepad);

                            // Add custom events for this gamepad to the gamepadEvents collection
                            gamepadEvents.push(gamepadEvents);

                            // Add the buttons and axes states for the new gamepad
                            prevButtonStates.push(event.gamepad.buttons);
                            prevAxesStates.push(event.gamepad.axes);

                            // Ask the controller to update the screen to show more gamepads.
                            //controller.updateGamepads(gamepadSupport.gamepads);

                            // Start the polling loop to monitor button changes.
                            startPolling();

                            // Dispatch the gamepad_connected event and make sure the
                            // gamepadConnected flag is turned on
                            gamepadConnectedEvent = new CustomEvent('gamepad_connected', {
                                detail: {
                                    gamepads: that.gamepads
                                }
                            });
                            document.dispatchEvent(gamepadConnectedEvent);
                            that.gamepadConnected = true;
                        },

                        /**
                        * React to the gamepad being disconnected.
                        */
                        onGamepadDisconnect = function(event) {
                            var gamepadDisconnectedEvent;
                            // Remove the gamepad from the list of gamepads to monitor, its previous
                            // button states, axes states and its custom events
                            for (var i in that.gamepads) {
                                if (that.gamepads[i].index == event.gamepad.index) {
                                    that.gamepads.splice(i, 1);
                                    prevButtonStates.splice(i, 1);
                                    prevAxesStates.splice(i, 1);
                                    gamepadEvents.splice(i, 1);
                                    break;
                                }
                            }

                            // If no gamepads are left, stop the polling loop.
                            if (that.gamepads.length === 0) {
                                stopPolling();
                            }

                            // Ask the controller to update the screen to remove the gamepad.
                            //controller.updateGamepads(gamepadSupport.gamepads);
                            
                            // Dispatch the gamepad_disconnected event
                            gamepadDisconnectedEvent = new CustomEvent('gamepad_disconnected', {
                                detail: {
                                    gamepads: that.gamepads
                                }
                            });
                            document.dispatchEvent(gamepadDisconnectedEvent);
                            // If there are no more gamepads connected, turn of the
                            // gamepadConnected flag
                            if (!that.gamepads.length) {
                                that.gamepadConnected = false;
                            }
                        },

                        /**
                        * Starts a polling loop to check for gamepad state.
                        */
                        startPolling = function() {
                            // Don’t accidentally start a second loop, man.
                            if (!ticking) {
                                ticking = true;
                                tick();
                            }
                        },

                        /**
                        * Stops a polling loop by setting a flag which will prevent the next
                        * requestAnimationFrame() from being scheduled.
                        */
                        stopPolling = function() {
                            ticking = false;
                        },

                        /**
                        * A function called with each requestAnimationFrame(). Polls the gamepad
                        * status and schedules another poll.
                        */
                        tick = function() {
                            pollStatus();
                            scheduleNextTick();
                        },

                        // A helper function to schedule the next poll tick using requestAnimationFrame
                        scheduleNextTick = function() {
                            // Only schedule the next frame if we haven’t decided to stop via
                            // stopPolling() before.
                            if (ticking) {
                                if (window.requestAnimationFrame) {
                                    window.requestAnimationFrame(tick);
                                } else if (window.mozRequestAnimationFrame) {
                                    window.mozRequestAnimationFrame(tick);
                                } else if (window.webkitRequestAnimationFrame) {
                                    window.webkitRequestAnimationFrame(tick);
                                }
                                // Note lack of setTimeout since all the browsers that support
                                // Gamepad API are already supporting requestAnimationFrame().
                            }
                        },

                        /**
                        * Checks for the gamepad status. Monitors the necessary data and notices
                        * the differences from previous state (buttons for Chrome/Firefox,
                        * new connects/disconnects for Chrome). If differences are noticed, asks
                        * to update the display accordingly. Should run as close to 60 frames per
                        * second as possible.
                        */
                        pollStatus = function() {
                            // Poll to see if gamepads are connected or disconnected. Necessary
                            // only on Chrome.
                            pollGamepads();

                            for (var i in that.gamepads) {
                                var gamepad = that.gamepads[i];

                                // Don’t do anything if the current timestamp is the same as previous
                                // one, which means that the state of the gamepad hasn’t changed.
                                // This is only supported by Chrome right now, so the first check
                                // makes sure we’re not doing anything if the timestamps are empty
                                // or undefined.
                                if (gamepad.timestamp &&
                                    (gamepad.timestamp == prevTimestamps[i])) {
                                        continue;
                                    }
                                    prevTimestamps[i] = gamepad.timestamp;

                                    broadcastStateChanges(i);
                            }
                        },

                        // This function is called only on Chrome, which does not yet support
                        // connection/disconnection events, but requires you to monitor
                        // an array for changes.
                        pollGamepads = function() {
                            // Get the array of gamepads – the first method (getGamepads)
                            // is the most modern one and is supported by Firefox 28+ and
                            // Chrome 35+. The second one (webkitGetGamepads) is a deprecated method
                            // used by older Chrome builds.
                            var rawGamepads =
                            (navigator.getGamepads && navigator.getGamepads()) ||
                            (navigator.webkitGetGamepads && navigator.webkitGetGamepads()),
                                gamepadsChanged = false,
                                gamepadCount,
                                newGamepadEvents,
                                gamepadConnectedEvent,
                                gamepadDisconnectedEvent;

                            if (rawGamepads) {
                                // We don’t want to use rawGamepads coming straight from the browser,
                                // since it can have “holes” (e.g. if you plug two gamepads, and then
                                // unplug the first one, the remaining one will be at index [1]).
                                that.gamepads = [];

                                // We only refresh the display when we detect some gamepads are new
                                // or removed; we do it by comparing raw gamepad table entries to
                                // “undefined.”
                                for (var i = 0; i < rawGamepads.length; i++) {
                                    if (typeof rawGamepads[i] != prevRawGamepadTypes[i]) {
                                        gamepadsChanged = true;
                                        prevRawGamepadTypes[i] = typeof rawGamepads[i];
                                    }

                                    if (rawGamepads[i]) {
                                        that.gamepads.push(rawGamepads[i]);
                                        // Update the prevButtonStates, prevAxesStates and custom
                                        // events only if some gamepads are new or removed.
                                        if (gamepadsChanged) {
                                            prevButtonStates[i] = rawGamepads[i].buttons;
                                            prevAxesStates[i] = rawGamepads[i].axes;
                                            newGamepadEvents = createGamepadEvents(rawGamepads[i]);
                                            gamepadEvents[i] = newGamepadEvents;
                                        }
                                    }
                                }

                                // Ask the controller to refresh the visual representations of gamepads
                                // on the screen.
                                if (gamepadsChanged) {
                                    //controller.updateGamepads(gamepadSupport.gamepads);
                                    // Delete any old gamepad button and axes states and custom
                                    // events from the respective arrays by comparing the lengths
                                    // of the two arrays
                                    gamepadCount = that.gamepads.length;
                                    if (gamepadCount < prevButtonStates.length) {
                                        prevButtonStates.splice(gamepadCount, prevButtonStates.length - gamepadCount);
                                        // Dispatch the gamepad disconnected event
                                        gamepadDisconnectedEvent = new CustomEvent('gamepad_disconnected', {
                                            detail: {
                                                gamepads: that.gamepads
                                            }
                                        });
                                        document.dispatchEvent(gamepadDisconnectedEvent);
                                        // If there are no more gamepads connected, turn on the
                                        // gamepadConnected flag
                                        if (!that.gamepads.length) {
                                            that.gamepadConnected = false;
                                        }
                                    } else {
                                        gamepadConnectedEvent = new CustomEvent('gamepad_connected', {
                                            detail: {
                                                gamepads: that.gamepads
                                            }
                                        });
                                        // Dispatch the gamepad connected event and make sure the
                                        // gamepadConnected flag is on
                                        document.dispatchEvent(gamepadConnectedEvent);
                                        that.gamepadConnected = true;
                                    }
                                    if (gamepadCount < prevAxesStates.length) {
                                        prevAxesStates.splice(gamepadCount, prevAxesStates.length - gamepadCount);
                                    }
                                    if (gamepadCount < gamepadEvents.length) {
                                        gamepadEvents.splice(gamepadCount, gamepadEvents.length - gamepadCount);
                                    }
                                }
                            }
                        },

                        // Broadcast state changes for the gamepad at the given index using custom events
                        broadcastStateChanges = function(gamepadId) {
                            var gamepad = that.gamepads[gamepadId],
                                gamepadPrevButtonStates = prevButtonStates[gamepadId],
                                gamepadPrevAxesStates = prevAxesStates[gamepadId],
                                events = gamepadEvents[gamepadId],
                                axesChanged = false;

                            // Publish the gamepad changed event always
                            document.dispatchEvent(events.gamepadChanged);

                            // Publish button press events if a button has been pressed
                            // Button 1 (A)
                            if (gamepad.buttons[0] === 0 && gamepadPrevButtonStates[0] === 1) {
                                document.dispatchEvent(events.aPressed);
                            }
                            // Button 2 (B)
                            if (gamepad.buttons[1] === 0 && gamepadPrevButtonStates[1] === 1) {
                                document.dispatchEvent(events.bPressed);
                            }
                            // Button 3 (X)
                            if (gamepad.buttons[2] === 0 && gamepadPrevButtonStates[2] === 1) {
                                document.dispatchEvent(events.xPressed);
                            }
                            // Button 4 (Y)
                            if (gamepad.buttons[3] === 0 && gamepadPrevButtonStates[3] === 1) {
                                document.dispatchEvent(events.yPressed);
                            }
                            // Left Bumper
                            if (gamepad.buttons[4] === 0 && gamepadPrevButtonStates[4] === 1) {
                                document.dispatchEvent(events.leftBumperPressed);
                            }
                            // Right Bumper
                            if (gamepad.buttons[5] === 0 && gamepadPrevButtonStates[5] === 1) {
                                document.dispatchEvent(events.rightBumperPressed);
                            }
                            // Option 1 (Back)
                            if (gamepad.buttons[8] === 0 && gamepadPrevButtonStates[8] === 1) {
                                document.dispatchEvent(events.backPressed);
                            }
                            // Option 2 (Start)
                            if (gamepad.buttons[9] === 0 && gamepadPrevButtonStates[9] === 1) {
                                document.dispatchEvent(events.startPressed);
                            }
                            // Left Stick Button
                            if (gamepad.buttons[10] === 0 && gamepadPrevButtonStates[10] === 1) {
                                document.dispatchEvent(events.leftStickPressed);
                            }
                            // Right Stick Button
                            if (gamepad.buttons[11] === 0 && gamepadPrevButtonStates[11] === 1) {
                                document.dispatchEvent(events.rightStickPressed);
                            }
                            // Up
                            if (gamepad.buttons[12] === 0 && gamepadPrevButtonStates[12] === 1) {
                                document.dispatchEvent(events.upPressed);
                            }
                            // Down
                            if (gamepad.buttons[13] === 0 && gamepadPrevButtonStates[13] === 1) {
                                document.dispatchEvent(events.downPressed);
                            }
                            // Left
                            if (gamepad.buttons[14] === 0 && gamepadPrevButtonStates[14] === 1) {
                                document.dispatchEvent(events.leftPressed);
                            }
                            // Right
                            if (gamepad.buttons[15] === 0 && gamepadPrevButtonStates[15] === 1) {
                                document.dispatchEvent(events.rightPressed);
                            }
                            // Super (Xbox)
                            if (gamepad.buttons[16] === 0 && gamepadPrevButtonStates[16] === 1) {
                                document.dispatchEvent(events.superPressed);
                            }

                            // Update the previous button states with the current states
                            prevButtonStates[gamepadId] = gamepad.buttons;

                            // Check if any axes have changed and publish related events
                            // Left Stick
                            if (gamepad.axes[0] !== gamepadPrevAxesStates[0] ||
                                gamepad.axes[1] !== gamepadPrevAxesStates[1]) {
                                document.dispatchEvent(events.leftStickChanged);
                                axesChanged = true;
                            }

                            // Right Stick
                            if (gamepad.axes[2] !== gamepadPrevAxesStates[2] ||
                                gamepad.axes[3] !== gamepadPrevAxesStates[3]) {
                                document.dispatchEvent(events.rightStickChanged);
                                axesChanged = true;
                            }

                            // Dispatch the axesChanged event if the left or the right
                            // axes values have changed
                            if (axesChanged) {
                                document.dispatchEvent(events.axesChanged);
                            }

                            // Update the previous axes states with the current states
                            prevAxesStates[gamepadId] = gamepad.axes; 
                        };

                    /**
                    * Initialize support for Gamepad API.
                    */
                    if (this.gamepadSupported) {
                        // Check and see if gamepadconnected/gamepaddisconnected is supported.
                        // If so, listen for those events and don't start polling until a gamepad
                        // has been connected.
                        if ('ongamepadconnected' in window) {
                            window.addEventListener('gamepadconnected',
                                onGamepadConnect, false);
                            window.addEventListener('gamepaddisconnected',
                                onGamepadDisconnect, false);
                        } else {
                            // If connection events are not supported just start polling
                            startPolling();
                        }
                    }
                };

            GamepadService.prototype.on = function (eventName, callback) {
                // Generate a UUID for this function, if it doesn't already have one, and
                // save a reference to it's listener function for removal later. We have to
                // do this because we are passing an anonymous function to addEventListener.
                if (!_.has(callback, '__uuid')) {
                    callback.__uuid = generateUUID();
                }

                // The callback is wrapped in $apply to ensure that angular's $digest cycle
                // is initiated, just in case someone updates a scope in the callback
                this.__listeners[callback.__uuid] = function (event) {
                    $rootScope.$apply(function () {
                        callback.apply(event.detail.gamepad, [event.detail.gamepad]);
                    });
                };

                // Add the event listener. 
                document.addEventListener(eventName, this.__listeners[callback.__uuid], false);
            };

            GamepadService.prototype.off = function (eventName, callback) {
                // If the passed callback has an __uuid property, then this is
                // a reference to a function passed to on() earlier, so it can be removed
                // as a listener (otherwise it's probably an anonymous function).
                if (_.has(callback, '__uuid')) {
                    document.removeEventListener(eventName, this.__listeners[callback.__uuid], false);
                    // Delete the function from the listeners object
                    delete this.__listeners[callback.__uuid];
                } else {
                    // Log a message to indicate that off() can't do anything
                    console.log('GamepadService: The function passed could not be identified for removal as a listener. You cannot remove anonymous functions as listeners.');
                }
            };

            return new GamepadService();
        }]);
});
