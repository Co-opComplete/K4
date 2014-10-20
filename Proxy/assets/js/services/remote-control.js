define([
    'jquery',
    'angular',
    'lodash'
], function ($, angular, _) {
    'use strict';

    angular.module('app.services.remoteControl', ['app.services'])
        .factory('remoteControl', ['gamepad', 'socket', function (gamepad, socket) {
            var RemoteControl = function () {
                this.connected = false;

                this.connect = function () {
                    this.connected = true;
                    //gamepad.on('axes_changed', onAxesChanged);

                    // Re-emit the last message every 250 ms if nothing is being
                    // emitted by a change event as a pulse
                    var messages = [
                            {magnitude: '0.2000', radians: '0.0000', rotation: '+0.0000', tilt: '+0.0000'},
                            {magnitude: '0.2000', radians: '3.1415', rotation: '+0.0000', tilt: '+0.0000'},
                            {magnitude: '0.2000', radians: '1.5700', rotation: '+0.0000', tilt: '+0.0000'},
                            {magnitude: '0.2000', radians: '4.7115', rotation: '+0.0000', tilt: '+0.0000'}
                        ],
                        index = 0;
                    tickInterval = setInterval(function () {
                        /*
                        var currentTimestamp = new Date().getTime();
                        if (currentTimestamp - prevMessageTimestamp > 250) {
                            socket.emit('controller', prevMessage);
                            prevMessageTimestamp = currentTimestamp;
                        }
                        */ 
                        socket.emit('controller', messages[index]);
                        if (index === 3) {
                            index = 0;
                        } else {
                            index++;
                        }
                    }, 6000);
                };

                this.disconnect = function () {
                    this.connected = false;
                    gamepad.off('axes_changed', onAxesChanged); 

                    // Stop emitting the pulse message
                    clearInterval(tickInterval);
                };

                var that = this,
                    tickInterval,
                    prevMessageTimestamp = new Date().getTime(),
                    prevMessage = {magnitude: '0.0000', radians: '0.0000', rotation: '+0.0000', tilt: '+0.0000'},
                    onAxesChanged = function (gamepad) {
                        var magnitude,
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
                            if (currentTimestamp - prevMessageTimestamp > 100) {
                                socket.emit('controller', msg);
                                prevMessageTimestamp = currentTimestamp;
                                prevMessage = msg;
                            }
                        }
                    };
            };

            return new RemoteControl();
        }]);
});
