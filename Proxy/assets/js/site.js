var upPressed,
    downPressed,
    leftPressed,
    rightPressed,
    websocketHost = '192.168.114.170';
    //websocketHost = '10.128.243.206';

(function($, undef){
    $(function(){
        // Commonly used selectors
        var $log = $('#log');

		// Auto-Connect
		Connect();

        // Connect Button
        $('#connect-button').click(function(){
            Connect();
            LogMessage('Connected');
        });

        // Disconnect Button
        $('#disconnect-button').click(function(){
            window.socket.socket.disconnect();
            LogMessage('Disconnecting');
        });

        // Directional Buttons
        // Up
        $('#up-button').mousedown(function(){
            window.socket.emit('up', {action: 'pressed'});
            // Log the event
            LogMessage('Up Pressed');
        }).mouseup(function(){
            window.socket.emit('up', {action: 'released'});
            // Log the event
            LogMessage('Up Released');
        });
        // Down
        $('#down-button').mousedown(function(){
            window.socket.emit('down', {action: 'pressed'});
            // Log the event
            LogMessage('Down Pressed');
        }).mouseup(function(){
            window.socket.emit('down', {action: 'released'});
            // Log the event
            LogMessage('Down Released');
        });
        // Left
        $('#left-button').mousedown(function(){
            window.socket.emit('left', {action: 'pressed'});
            // Log the event
            LogMessage('Left Pressed');
        }).mouseup(function(){
            window.socket.emit('left', {action: 'released'});
            // Log the event
            LogMessage('Left Released');
        });
        // Right
        $('#right-button').mousedown(function(){
            window.socket.emit('right', {action: 'pressed'});
            // Log the event
            LogMessage('Right Pressed');
        }).mouseup(function(){
            window.socket.emit('right', {action: 'released'});
            // Log the event
            LogMessage('Right Released');
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
                        LogMessage('Up Pressed');
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
                        LogMessage('Down Pressed');
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
                        LogMessage('Left Pressed');
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
                        LogMessage('Right Pressed');
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
                    LogMessage('Up Released');
                    break;
                // Down
                case 40:
                case 83:
                    window.socket.emit('down', {action: 'released'});
					downPressed = false;
                    // Log the event
                    LogMessage('Down Released');
                    break;
                // Left
                case 37:
                case 65:
                    window.socket.emit('left', {action: 'released'});
					leftPressed = false;
                    // Log the event
                    LogMessage('Left Released');
                    break;
                // Right
                case 39:
                case 68:
                    window.socket.emit('right', {action: 'released'});
					rightPressed = false;
                    // Log the event
                    LogMessage('Right Released');
                    break;
                default:
                    break;
            }
        });

        // Logging for the client
        function LogMessage(message) {
            var logMessage = $('<span class="info">'+message+'</span>');
            $log.prepend(logMessage);
            setTimeout(function(){
                logMessage.animate({opacity: 0}, 300, function(){
                    $(this).remove();
                });
            }, 3000);
        }
    });
})(jQuery);

function Connect() {
	if (!window.socket)
	{
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
	}
	else
	{ window.socket.socket.reconnect(); }
		
}
