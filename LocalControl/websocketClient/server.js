var serialport = require('serialport'), 
    serialPort = new serialport.SerialPort('/dev/ttyAMA0', {
        baudrate: 9600,
        parser: serialport.parsers.readline('\n')
    }); 

serialPort.on('open', function () {
    var socket = require('socket.io-client')('ws://192.168.114.170:8000/robot');

    console.log('Serial port opened');

    serialPort.on('data', function (data) {
        console.log('data received: ', data);
    });

    socket.on('connect', function() {
        console.log('connected to socket'); 

        socket.on('message', function (data) {
            console.log('got message: ', data);

            /*
            if (data === 'up') {
                // Turn off LED
                serialPort.write('a', function (err, results) {
                    if (err) {
                        console.log('got error: ', err);
                    }else{
                        console.log('write results: ', results);
                    }
                });
            } else if (data === 'down') {
                // Turn on LED
                serialPort.write('b', function (err, results) {
                    if (err) {
                        console.log('got error: ', err);
                    }else{
                        console.log('write results: ', results);
                    }
                });
            }
            */
        });

        socket.on('controller', function (data) {
            console.log('got controller data: ', {
                'l-sign': (data['stick-1-y'] >= 0 ? '+' : '-'),
                'l-val': Math.floor(Math.abs(data['stick-1-y']) * 100),
                'r-sign': (data['stick-2-y'] >= 0 ? '+' : '-'),
                'r-val': Math.floor(Math.abs(data['stick-2-y']) * 100)
            });

            /*******************************************************************************
            * Send data for left wheels
            ********************************************************************************/
            var l_sign = data['stick-1-y'] >= 0 ? '+' : '-',
                l_percent = Math.floor(Math.abs(data['stick-1-y']) * 100),
                l_val = String.fromCharCode(l_percent > 10 ? l_percent : 0),
                r_sign = data['stick-2-y'] >= 0 ? '+' : '-',
                r_percent = Math.floor(Math.abs(data['stick-2-y']) * 100),
                r_val = String.fromCharCode(r_percent > 10 ? r_percent : 0);

            serialPort.write('l' + l_sign + l_val + 'r' + r_sign + r_val, function (err, results) {
                if (err) {
                    console.log('got error writing "l": ', err);
                }else{
                    console.log('write "l" results: ', results);
                }
            });

            /*
            // Write sign for value
            serialPort.write((data['stick-1-y'] >= 0 ? '+' : '-'), function (err, results) {
                if (err) {
                    console.log('got error writing "+" after "l": ', err);
                }else{
                    console.log('write "+" after "l" results: ', results);
                }
            });

            // Convert value to absolute value percentage and send
            serialPort.write(String.fromCharCode(Math.floor(Math.abs(data['stick-1-y']) * 100)), function (err, results) {
                if (err) {
                    console.log('got error writing value after "l": ', err);
                }else{
                    console.log('write value after "l" results: ', results);
                }
            });
            */

            /*******************************************************************************
            * Send data for right wheels
            ********************************************************************************/
            /*
            serialPort.write('r' + r_sign + r_val, function (err, results) {
                if (err) {
                    console.log('got error writing "r": ', err);
                }else{
                    console.log('write "r" results: ', results);
                }
            });

            // Write sign for value
            serialPort.write((data['stick-2-y'] >= 0 ? '+' : '-'), function (err, results) {
                if (err) {
                    console.log('got error writing "+" after "r": ', err);
                }else{
                    console.log('write "+" after "r" results: ', results);
                }
            });

            // Convert value to absolute value percentage and send
            serialPort.write(String.fromCharCode(Math.floor(Math.abs(data['stick-2-y']) * 100)), function (err, results) {
                if (err) {
                    console.log('got error writing value after "r": ', err);
                }else{
                    console.log('write value after "r" results: ', results);
                }
            });
            */
        });

        socket.on('disconnect', function () {
            console.log('Closed connection');
        }); 

        socket.send('This is a message!');
    });
});
