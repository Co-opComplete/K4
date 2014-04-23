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
            $('#connection-status').html('Connected');
        });

        // Disconnect Button
        $('#disconnect-button').click(function(){
            socket.socket.disconnect();
            $('#connection-status').html('Disconnected');
        });

        // Directional Buttons
        // Up
        $('#up-button').mousedown(function(){
            socket.emit('up', {action: 'pressed'});
            $('#button-pressed').html('Up');
        }).mouseup(function(){
            socket.emit('up', {action: 'released'});
            $('#button-pressed').html('');
        });
        // Down
        $('#down-button').mousedown(function(){
            socket.emit('down', {action: 'pressed'});
            $('#button-pressed').html('Down');
        }).mouseup(function(){
            socket.emit('down', {action: 'released'});
            $('#button-pressed').html('');
        });
        // Left
        $('#left-button').mousedown(function(){
            socket.emit('left', {action: 'pressed'});
            $('#button-pressed').html('Left');
        }).mouseup(function(){
            socket.emit('left', {action: 'released'});
            $('#button-pressed').html('');
        });
        // Right
        $('#right-button').mousedown(function(){
            socket.emit('right', {action: 'pressed'});
            $('#button-pressed').html('Right');
        }).mouseup(function(){
            socket.emit('right', {action: 'released'});
            $('#button-pressed').html('');
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
						$('#button-pressed').html('Up');
					}
                    break;
                // Down
                case 40:
                case 83:
					if(!downPressed)
					{
						socket.emit('down', {action: 'pressed'});
						downPressed = true;
						$('#button-pressed').html('Down');
					}
                    break;
                // Left
                case 37:
                case 65:
					if(!leftPressed)
					{
						socket.emit('left', {action: 'pressed'});
						leftPressed = true;
						$('#button-pressed').html('Left');
					}
                    break;
                // Right
                case 39:
                case 68:
					if(!rightPressed)
					{
						socket.emit('right', {action: 'pressed'});
						rightPressed = true;
						$('#button-pressed').html('Right');
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
					$('#button-pressed').html('');
                    break;
                // Down
                case 40:
                case 83:
                    socket.emit('down', {action: 'released'});
					downPressed = false;
					$('#button-pressed').html('');
                    break;
                // Left
                case 37:
                case 65:
                    socket.emit('left', {action: 'released'});
					leftPressed = false;
					$('#button-pressed').html('');
                    break;
                // Right
                case 39:
                case 68:
                    socket.emit('right', {action: 'released'});
					rightPressed = false;
					$('#button-pressed').html('');
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
		socket = io.connect('http://k4-dev.cmgeneral.local:3001/remote');

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
