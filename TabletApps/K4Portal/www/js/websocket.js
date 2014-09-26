define([
    'jquery',
    'socketio'
], function ($, io) {
    var socket = io.connect('http://192.168.114.99:8000/remote');

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

    return socket;
});
