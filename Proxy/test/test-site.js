var socket;

(function($, undef){
    $(function(){
        // Connect Button
        $('#connect-button').click(function(){
            socket = io.connect('http://localhost:3000/remote');

            socket.on('event', function(data){
                console.log(data);
                socket.emit('response', {response: 'response'});
            });
        });

        // Disconnect Button
        $('#disconnect-button').click(function(){
            socket.disconnect();
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
                    socket.emit('up', {action: 'pressed'});
                    break;
                // Down
                case 40:
                    socket.emit('down', {action: 'pressed'});
                    break;
                // Left
                case 37:
                    socket.emit('left', {action: 'pressed'});
                    break;
                // Right
                case 39:
                    socket.emit('right', {action: 'pressed'});
                    break;
                default:
                    break;
            }
        }).keyup(function(e){
            switch(e.which) {
                // Up
                case 38:
                    socket.emit('up', {action: 'released'});
                    break;
                // Down
                case 40:
                    socket.emit('down', {action: 'released'});
                    break;
                // Left
                case 37:
                    socket.emit('left', {action: 'released'});
                    break;
                // Right
                case 39:
                    socket.emit('right', {action: 'released'});
                    break;
                default:
                    break;
            }
        });
    });
})(jQuery);
