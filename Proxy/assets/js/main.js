define([
    'jquery',
    'socketio',
    'control/gamepad',
    'control/controller'
], function ($, io) {
    'use strict';

    var upPressed,
        downPressed,
        leftPressed,
        rightPressed,
        websocketHost = '127.0.0.1';
        //websocketHost = '192.168.114.170';
    //websocketHost = '10.128.243.206';
    
    function connect() {
        if (!window.socket) {
            window.socket = io.connect('http://'+websocketHost+':'+port+'/remote');

            window.socket.on('event', function(data){
                console.log(data);
                window.socket.emit('response', {response: 'response'});
            });
            
            window.socket.on('connect', function() {
                console.log('Connected');
                $('#connect-button').prop('disabled', true);
                $('#disconnect-button').prop('disabled', false);
                $('#up-button').prop('disabled', false);
                $('#down-button').prop('disabled', false);
                $('#left-button').prop('disabled', false);
                $('#right-button').prop('disabled', false);
            });
        
            window.socket.on('disconnect', function() {
                console.log('Disconnected');
                $('#connect-button').prop('disabled', false);
                $('#disconnect-button').prop('disabled', true);
                $('#up-button').prop('disabled', true);
                $('#down-button').prop('disabled', true);
                $('#left-button').prop('disabled', true);
                $('#right-button').prop('disabled', true);
            });
        } else {
            window.socket.socket.reconnect();
        }
    }

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
		// Auto-Connect
		connect();

        // Connect Button
        $('#connect-button').click(function(){
            connect();
            logMessage('Connected');
        });

        // Disconnect Button
        $('#disconnect-button').click(function(){
            window.socket.socket.disconnect();
            logMessage('Disconnecting');
        });

        // Directional Buttons
        // Up
        $('#up-button').mousedown(function(){
            window.socket.emit('up', {action: 'pressed'});
            // Log the event
            logMessage('Up Pressed');
        }).mouseup(function(){
            window.socket.emit('up', {action: 'released'});
            // Log the event
            logMessage('Up Released');
        });
        // Down
        $('#down-button').mousedown(function(){
            window.socket.emit('down', {action: 'pressed'});
            // Log the event
            logMessage('Down Pressed');
        }).mouseup(function(){
            window.socket.emit('down', {action: 'released'});
            // Log the event
            logMessage('Down Released');
        });
        // Left
        $('#left-button').mousedown(function(){
            window.socket.emit('left', {action: 'pressed'});
            // Log the event
            logMessage('Left Pressed');
        }).mouseup(function(){
            window.socket.emit('left', {action: 'released'});
            // Log the event
            logMessage('Left Released');
        });
        // Right
        $('#right-button').mousedown(function(){
            window.socket.emit('right', {action: 'pressed'});
            // Log the event
            logMessage('Right Pressed');
        }).mouseup(function(){
            window.socket.emit('right', {action: 'released'});
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
						window.socket.emit('up', {action: 'pressed'});
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
						window.socket.emit('down', {action: 'pressed'});
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
						window.socket.emit('left', {action: 'pressed'});
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
						window.socket.emit('right', {action: 'pressed'});
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
                    window.socket.emit('up', {action: 'released'});
					upPressed = false;
                    // Log the event
                    logMessage('Up Released');
                    break;
                // Down
                case 40:
                case 83:
                    window.socket.emit('down', {action: 'released'});
					downPressed = false;
                    // Log the event
                    logMessage('Down Released');
                    break;
                // Left
                case 37:
                case 65:
                    window.socket.emit('left', {action: 'released'});
					leftPressed = false;
                    // Log the event
                    logMessage('Left Released');
                    break;
                // Right
                case 39:
                case 68:
                    window.socket.emit('right', {action: 'released'});
					rightPressed = false;
                    // Log the event
                    logMessage('Right Released');
                    break;
                default:
                    break;
            }
        }); 
    }); 

    // Start up the controller support
    controller.init();
    gamepadSupport.init();
});
