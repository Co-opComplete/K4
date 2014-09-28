/**
* Copyright 2012 Google Inc. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* @author mwichary@google.com (Marcin Wichary)
*/

define([
    'jquery',
    '../websocket'
], function ($, socket) {

    var gamepadSupport = {
        // A number of typical buttons recognized by Gamepad API and mapped to
        // standard controls. Any extraneous buttons will have larger indexes.
        TYPICAL_BUTTON_COUNT: 16,

        // A number of typical axes recognized by Gamepad API and mapped to
        // standard controls. Any extraneous buttons will have larger indexes.
        TYPICAL_AXIS_COUNT: 4,

        // Whether we’re requestAnimationFrameing like it’s 1999.
        ticking: false,

        // The canonical list of attached gamepads, without “holes” (always
        // starting at [0]) and unified between Firefox and Chrome.
        gamepads: [],

        // Remembers the connected gamepads at the last check; used in Chrome
        // to figure out when gamepads get connected or disconnected, since no
        // events are fired.
        prevRawGamepadTypes: [],

        // Previous timestamps for gamepad state; used in Chrome to not bother with
        // analyzing the polled data if nothing changed (timestamp is the same
        // as last time).
        prevTimestamps: [],

        // Previous states for gamepad buttons; will be either a 1 (pressed) or
        // a 0 (released).
        prevButtonStates: [],

        prevMessage: {magnitude: '0.0000', radians: '0.0000', rotation: '+0.0000', tilt: '+0.0000'},

        prevMessageTimestamp: new Date().getTime(),

        /**
        * Initialize support for Gamepad API.
        */
        init: function() {
            var gamepadSupportAvailable = navigator.getGamepads ||
            !!navigator.webkitGetGamepads ||
            !!navigator.webkitGamepads;

            if (!gamepadSupportAvailable) {
                // It doesn’t seem Gamepad API is available – show a message telling
                // the visitor about it.
                controller.showNotSupported();
            } else {
                // Check and see if gamepadconnected/gamepaddisconnected is supported.
                // If so, listen for those events and don't start polling until a gamepad
                // has been connected.
                if ('ongamepadconnected' in window) {
                    window.addEventListener('gamepadconnected',
                    gamepadSupport.onGamepadConnect, false);
                    window.addEventListener('gamepaddisconnected',
                    gamepadSupport.onGamepadDisconnect, false);
                } else {
                    // If connection events are not supported just start polling
                    gamepadSupport.startPolling();
                }
            }
        },

        /**
        * React to the gamepad being connected.
        */
        onGamepadConnect: function(event) {
            // Add the new gamepad on the list of gamepads to look after.
            gamepadSupport.gamepads.push(event.gamepad);

            // Add the buttons states for the new gamepad
            gamepadSupport.prevButtonStates.push(event.gamepad.buttons);

            // Ask the controller to update the screen to show more gamepads.
            controller.updateGamepads(gamepadSupport.gamepads);

            // Start the polling loop to monitor button changes.
            gamepadSupport.startPolling();
        },

        /**
        * React to the gamepad being disconnected.
        */
        onGamepadDisconnect: function(event) {
            // Remove the gamepad from the list of gamepads to monitor and its previous
            // button statuses
            for (var i in gamepadSupport.gamepads) {
                if (gamepadSupport.gamepads[i].index == event.gamepad.index) {
                    gamepadSupport.gamepads.splice(i, 1);
                    gamepadSupport.prevButtonStates.splice(i, 1);
                    break;
                }
            }

            // If no gamepads are left, stop the polling loop.
            if (gamepadSupport.gamepads.length === 0) {
                gamepadSupport.stopPolling();
            }

            // Ask the controller to update the screen to remove the gamepad.
            controller.updateGamepads(gamepadSupport.gamepads);
        },

        /**
        * Starts a polling loop to check for gamepad state.
        */
        startPolling: function() {
            // Don’t accidentally start a second loop, man.
            if (!gamepadSupport.ticking) {
                gamepadSupport.ticking = true;
                gamepadSupport.tick();
            }
        },

        /**
        * Stops a polling loop by setting a flag which will prevent the next
        * requestAnimationFrame() from being scheduled.
        */
        stopPolling: function() {
            gamepadSupport.ticking = false;
        },

        /**
        * A function called with each requestAnimationFrame(). Polls the gamepad
        * status and schedules another poll.
        */
        tick: function() {
            gamepadSupport.pollStatus();
            gamepadSupport.scheduleNextTick();
        },

        scheduleNextTick: function() {
            // Only schedule the next frame if we haven’t decided to stop via
            // stopPolling() before.
            if (gamepadSupport.ticking) {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(gamepadSupport.tick);
                } else if (window.mozRequestAnimationFrame) {
                    window.mozRequestAnimationFrame(gamepadSupport.tick);
                } else if (window.webkitRequestAnimationFrame) {
                    window.webkitRequestAnimationFrame(gamepadSupport.tick);
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
        pollStatus: function() {
            // Poll to see if gamepads are connected or disconnected. Necessary
            // only on Chrome.
            gamepadSupport.pollGamepads();

            for (var i in gamepadSupport.gamepads) {
                var gamepad = gamepadSupport.gamepads[i],
                    currentTimestamp = new Date().getTime();

                // Don’t do anything if the current timestamp is the same as previous
                // one, which means that the state of the gamepad hasn’t changed.
                // This is only supported by Chrome right now, so the first check
                // makes sure we’re not doing anything if the timestamps are empty
                // or undefined.
                if (gamepad.timestamp &&
                    (gamepad.timestamp == gamepadSupport.prevTimestamps[i])) {
                        if (currentTimestamp - gamepadSupport.prevMessageTimestamp > 250) {
                            socket.emit('controller', gamepadSupport.prevMessage);
                            gamepadSupport.prevMessageTimestamp = currentTimestamp;
                        }
                        continue;
                    }
                    gamepadSupport.prevTimestamps[i] = gamepad.timestamp;

                    gamepadSupport.updateDisplay(i);
            }
        },

        // This function is called only on Chrome, which does not yet support
        // connection/disconnection events, but requires you to monitor
        // an array for changes.
        pollGamepads: function() {
            // Get the array of gamepads – the first method (getGamepads)
            // is the most modern one and is supported by Firefox 28+ and
            // Chrome 35+. The second one (webkitGetGamepads) is a deprecated method
            // used by older Chrome builds.
            var rawGamepads =
            (navigator.getGamepads && navigator.getGamepads()) ||
            (navigator.webkitGetGamepads && navigator.webkitGetGamepads());

            if (rawGamepads) {
                // We don’t want to use rawGamepads coming straight from the browser,
                // since it can have “holes” (e.g. if you plug two gamepads, and then
                // unplug the first one, the remaining one will be at index [1]).
                gamepadSupport.gamepads = [];

                // We only refresh the display when we detect some gamepads are new
                // or removed; we do it by comparing raw gamepad table entries to
                // “undefined.”
                var gamepadsChanged = false;

                for (var i = 0; i < rawGamepads.length; i++) {
                    if (typeof rawGamepads[i] != gamepadSupport.prevRawGamepadTypes[i]) {
                        gamepadsChanged = true;
                        gamepadSupport.prevRawGamepadTypes[i] = typeof rawGamepads[i];
                    }

                    if (rawGamepads[i]) {
                        gamepadSupport.gamepads.push(rawGamepads[i]);
                        // Update the prevButtonStatuses only if some gamepads are new or
                        // removeda.
                        if (gamepadsChanged) {
                            gamepadSupport.prevButtonStates[i] = rawGamepads[i].buttons;
                        }
                    }
                }

                // Ask the controller to refresh the visual representations of gamepads
                // on the screen.
                if (gamepadsChanged) {
                    controller.updateGamepads(gamepadSupport.gamepads);
                    // Delete any old gamepad statuses from the array by comparing the 
                    // lengths of the two arrays
                    if (gamepadSupport.gamepads.length < gamepadSupport.prevButtonStates.length) {
                        gamepadSupport.prevButtonStates.splice(gamepadSupport.gamepads.length, gamepadSupport.prevButtonStates.length - gamepadSupport.gamepads.length);
                    }
                }
            }
        },

        // Call the controller with new state and ask it to update the visual
        // representation of a given gamepad.
        updateDisplay: function(gamepadId) {
            var gamepad = gamepadSupport.gamepads[gamepadId],
                prevStates = gamepadSupport.prevButtonStates[gamepadId],
                magnitude,
                maxMagnitude = 1,
                magnitudeStr,
                angle,
                radians,
                radianStr,
                rotation,
                rotationStr,
                tilt,
                tiltStr,
                msg,
                currentTimestamp = new Date().getTime();

            // Update all the analogue sticks.
            controller.updateAxis(gamepad.axes[0], gamepadId,
            'stick-1-axis-x', 'stick-1', true);

            controller.updateAxis(gamepad.axes[1], gamepadId,
            'stick-1-axis-y', 'stick-1', false);
            controller.updateAxis(gamepad.axes[2], gamepadId,
            'stick-2-axis-x', 'stick-2', true);
            controller.updateAxis(gamepad.axes[3], gamepadId,
            'stick-2-axis-y', 'stick-2', false);

            //console.log(gamepad.buttons);

            // Publish button press events if a button has been pressed
            // ==================================================================
            // Button 1 (A)
            if (gamepad.buttons[0] === 0 && prevStates[0] === 1) {
                $.publish('/gamepad/button/1');
            }
            // Button 2 (B)
            if (gamepad.buttons[1] === 0 && prevStates[1] === 1) {
                $.publish('/gamepad/button/2');
            }
            // Button 3 (X)
            if (gamepad.buttons[2] === 0 && prevStates[2] === 1) {
                $.publish('/gamepad/button/3');
            }
            // Button 4 (Y)
            if (gamepad.buttons[3] === 0 && prevStates[3] === 1) {
                $.publish('/gamepad/button/4');
            }
            // Left Bumper
            if (gamepad.buttons[4] === 0 && prevStates[4] === 1) {
                $.publish('/gamepad/button/l-bumper');
            }
            // Right Bumper
            if (gamepad.buttons[5] === 0 && prevStates[5] === 1) {
                $.publish('/gamepad/button/r-bumper');
            }
            // Option 1 (Back)
            if (gamepad.buttons[8] === 0 && prevStates[8] === 1) {
                $.publish('/gamepad/button/option-1');
            }
            // Option 2 (Start)
            if (gamepad.buttons[9] === 0 && prevStates[9] === 1) {
                $.publish('/gamepad/button/option-2');
            }
            // Left Stick Button
            if (gamepad.buttons[10] === 0 && prevStates[10] === 1) {
                $.publish('/gamepad/button/l-stick');
            }
            // Right Stick Button
            if (gamepad.buttons[11] === 0 && prevStates[11] === 1) {
                $.publish('/gamepad/button/r-stick');
            }
            // Up
            if (gamepad.buttons[12] === 0 && prevStates[12] === 1) {
                $.publish('/gamepad/button/up');
            }
            // Down
            if (gamepad.buttons[13] === 0 && prevStates[13] === 1) {
                $.publish('/gamepad/button/down');
            }
            // Left
            if (gamepad.buttons[14] === 0 && prevStates[14] === 1) {
                $.publish('/gamepad/button/left');
            }
            // Right
            if (gamepad.buttons[15] === 0 && prevStates[15] === 1) {
                $.publish('/gamepad/button/right');
            }
            // Super (Xbox)
            if (gamepad.buttons[16] === 0 && prevStates[16] === 1) {
                $.publish('/gamepad/button/super');
            }

            // Update the previous button states with the current states
            gamepadSupport.prevButtonStates[gamepadId] = gamepad.buttons;

            // Find the magnitude with pathagoreans theorem (mag^2 = x^2 + y^2)
            magnitude = Math.sqrt(Math.pow(gamepad.axes[0], 2) + Math.pow(gamepad.axes[1], 2));

            // Find the angle of the triangle (using sin(0) = opp/hyp), then
            // determine the quadrant to figure out the angle in radians (with
            // North being 0 and 2pi). Keep in mind that Math.asin returns radians.
            angle = Math.asin(Math.abs(gamepad.axes[0]) / magnitude);

            // Y value is inverted from what you would expect O.o (wtf)
            // Top left quadrant
            if (gamepad.axes[0] <= 0 && gamepad.axes[1] <= 0) {
                radians = angle;
            // Bottom left quadrant
            } else if (gamepad.axes[0] <= 0 && gamepad.axes[1] > 0) {
                radians = Math.PI - angle;
            // Bottom right quadrant
            } else if (gamepad.axes[0] > 0 && gamepad.axes[1] > 0) {
                radians = Math.PI + angle;
            // Top right quadrant
            } else if (gamepad.axes[0] > 0 && gamepad.axes[1] <= 0) {
                radians = (2 * Math.PI) - angle;
            }

            // The rotation value will just be the x-value of the right stick
            rotation = gamepad.axes[2];

            // The tilt value will just be the y-value of the right stick
            tilt = gamepad.axes[3];

            console.log('magnitude: ' + magnitude.toFixed(4) + ', radians: ' + radians.toFixed(4) + ', rotation: ' + rotation.toFixed(4) + ', tilt: ' + tilt.toFixed(4));

            magnitudeStr = '' + (magnitude > 1 ? maxMagnitude.toFixed(4) : magnitude.toFixed(4));
            radianStr = '' + radians.toFixed(4);
            rotationStr = '' + (rotation.toFixed(4) >= 0 ? '+' + rotation.toFixed(4) : rotation.toFixed(4));
            tiltStr = '' + (tilt.toFixed(4) >= 0 ? '+' + tilt.toFixed(4) : tilt.toFixed(4));

            msg = {
                'magnitude': magnitudeStr,
                'radians': radianStr,
                'rotation': rotationStr === '0.0000' ? '+0.0000' : rotationStr,
                'tilt': tiltStr === '0.0000' ? '+0.0000' : tiltStr
            };

            if(socket){
                if (currentTimestamp - gamepadSupport.prevMessageTimestamp > 100) {
                    console.log('emitting message');
                    socket.emit('controller', msg);
                    gamepadSupport.prevMessageTimestamp = currentTimestamp;
                    gamepadSupport.prevMessage = msg;
                }
            }
        }
    };

    window.gamepadSupport = gamepadSupport;
});
