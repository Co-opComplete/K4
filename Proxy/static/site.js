var socket;
var upPressed;
var downPressed;
var leftPressed;
var rightPressed;

(function($, undef){
    $(function(){
		// Auto-Connect
		Connect();

        // Connect Button
        $('#connect-button').click(function(){
            Connect();
        });

        // Disconnect Button
        $('#disconnect-button').click(function(){
            socket.socket.disconnect();
        });

        // Directional Buttons
        // Up
        $('#up-button').mousedown(function(){
            socket.emit('up', {action: 'pressed'});
        }).mouseup(function(){
            socket.emit('up', {action: 'released'});
        });
        // Down
        $('#down-button').mousedown(function(){
            socket.emit('down', {action: 'pressed'});
        }).mouseup(function(){
            socket.emit('down', {action: 'released'});
        });
        // Left
        $('#left-button').mousedown(function(){
            socket.emit('left', {action: 'pressed'});
        }).mouseup(function(){
            socket.emit('left', {action: 'released'});
        });
        // Right
        $('#right-button').mousedown(function(){
            socket.emit('right', {action: 'pressed'});
        }).mouseup(function(){
            socket.emit('right', {action: 'released'});
        });

        // Keyboard Directional Buttons
        $(document).keydown(function(e){
            switch(e.which) {
                // Up
                case 38:
                case 87:
					if(!upPressed)
					{
						socket.emit('up', {action: 'pressed'});
						upPressed = true;
					}
                    break;
                // Down
                case 40:
                case 83:
					if(!downPressed)
					{
						socket.emit('down', {action: 'pressed'});
						downPressed = true;
					}
                    break;
                // Left
                case 37:
                case 65:
					if(!leftPressed)
					{
						socket.emit('left', {action: 'pressed'});
						leftPressed = true;
					}
                    break;
                // Right
                case 39:
                case 68:
					if(!rightPressed)
					{
						socket.emit('right', {action: 'pressed'});
						rightPressed = true;
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
                    break;
                // Down
                case 40:
                case 83:
                    socket.emit('down', {action: 'released'});
					downPressed = false;
                    break;
                // Left
                case 37:
                case 65:
                    socket.emit('left', {action: 'released'});
					leftPressed = false;
                    break;
                // Right
                case 39:
                case 68:
                    socket.emit('right', {action: 'released'});
					rightPressed = false;
                    break;
                default:
                    break;
            }
        });
    });
})(jQuery);

function Connect() {
	if (!socket)
	{
		socket = io.connect('http://k4-dev.cmgeneral.local:'+port+'/remote');

		socket.on('event', function(data){
			console.log(data);
			socket.emit('response', {response: 'response'});
		});
		
		socket.on('connect', function() {
			console.log('Connected');
			$('#connect-button').prop('disabled', true);
			$('#disconnect-button').prop('disabled', false);
			$('#up-button').prop('disabled', false);
			$('#down-button').prop('disabled', false);
			$('#left-button').prop('disabled', false);
			$('#right-button').prop('disabled', false);
		});
	
		socket.on('disconnect', function() {
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
	{ socket.socket.reconnect(); }
		
}
