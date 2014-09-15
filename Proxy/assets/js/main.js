define([
    'jquery',
    'socketio',
    'angular',
    'app',
    'routes',
    'websocket'
], function ($, io, angular, app, routes, socket) {
    'use strict';

    var upPressed,
        downPressed,
        leftPressed,
        rightPressed; 

    // Logging for the client
    function logMessage(message) {
        var msg = $('<span class="info">'+message+'</span>');
        $('#log').prepend(msg);
        setTimeout(function(){
            logMessage.animate({opacity: 0}, 300, function(){
                $(this).remove();
            });
        }, 3000);
    }

    $(function(){

        angular.resumeBootstrap([app.name]);

        /* Connect Button
        $('#connect-button').click(function(){
            connect();
            logMessage('Connected');
        });

        // Disconnect Button
        $('#disconnect-button').click(function(){
            socket.socket.disconnect();
            logMessage('Disconnecting');
        });
        */

        // Directional Buttons
        // Up
        $('#up-button').mousedown(function(){
            socket.emit('up', {action: 'pressed'});
            // Log the event
            logMessage('Up Pressed');
        }).mouseup(function(){
            socket.emit('up', {action: 'released'});
            // Log the event
            logMessage('Up Released');
        });
        // Down
        $('#down-button').mousedown(function(){
            socket.emit('down', {action: 'pressed'});
            // Log the event
            logMessage('Down Pressed');
        }).mouseup(function(){
            socket.emit('down', {action: 'released'});
            // Log the event
            logMessage('Down Released');
        });
        // Left
        $('#left-button').mousedown(function(){
            socket.emit('left', {action: 'pressed'});
            // Log the event
            logMessage('Left Pressed');
        }).mouseup(function(){
            socket.emit('left', {action: 'released'});
            // Log the event
            logMessage('Left Released');
        });
        // Right
        $('#right-button').mousedown(function(){
            socket.emit('right', {action: 'pressed'});
            // Log the event
            logMessage('Right Pressed');
        }).mouseup(function(){
            socket.emit('right', {action: 'released'});
            // Log the event
            logMessage('Right Released');
        });

        // Keyboard Directional Buttons
        $(document).keydown(function(e){
            console.log(e.which);
            switch(e.which) {
                // Up
                case 38:
                case 87:
					if(!upPressed)
					{
						socket.emit('up', {action: 'pressed'});
						upPressed = true;
                        // Log the event
                        logMessage('Up Pressed');
					}
                    break;
                // Down
                case 40:
                case 83:
					if(!downPressed)
					{
						socket.emit('down', {action: 'pressed'});
						downPressed = true;
                        // Log the event
                        logMessage('Down Pressed');
					}
                    break;
                // Left
                case 37:
                case 65:
					if(!leftPressed)
					{
						socket.emit('left', {action: 'pressed'});
						leftPressed = true;
                        // Log the event
                        logMessage('Left Pressed');
					}
                    break;
                // Right
                case 39:
                case 68:
					if(!rightPressed)
					{
						socket.emit('right', {action: 'pressed'});
						rightPressed = true;
                        // Log the event
                        logMessage('Right Pressed');
					}
                    break;
                default:
                    break;
            }
        }).keyup(function(e){
            switch(e.which) {
                // Up
                case 38:
                case 87:
                    socket.emit('up', {action: 'released'});
					upPressed = false;
                    // Log the event
                    logMessage('Up Released');
                    break;
                // Down
                case 40:
                case 83:
                    socket.emit('down', {action: 'released'});
					downPressed = false;
                    // Log the event
                    logMessage('Down Released');
                    break;
                // Left
                case 37:
                case 65:
                    socket.emit('left', {action: 'released'});
					leftPressed = false;
                    // Log the event
                    logMessage('Left Released');
                    break;
                // Right
                case 39:
                case 68:
                    socket.emit('right', {action: 'released'});
					rightPressed = false;
                    // Log the event
                    logMessage('Right Released');
                    break;
                default:
                    break;
            }
        }); 
    });  
});
