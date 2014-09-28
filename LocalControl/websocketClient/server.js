var serialport = require('serialport'), 
    getmac = require('getmac'),
    _ = require('lodash'),
    os = require('os'),
    ifaces = os.networkInterfaces();
    /*
    serialPort = new serialport.SerialPort('/dev/ttyAMA0', {
        baudrate: 9600,
        parser: serialport.parsers.readline('\n')
    }); 
    */

//serialPort.on('open', function () {
    var socket = require('socket.io-client')('ws://localhost:8000/robot');

    console.log('Serial port opened');

    /*
    serialPort.on('data', function (data) {
        console.log('data received: ', data);
    });
    */

    socket.on('connect', function() {
        console.log('connected to socket'); 
        // Get the mac address and send it to the server
        getmac.getMac(function (err, macAddress) {
            if (err) {
                console.log('Get MAC address error: ', err);
                throw err;
            }
            var ip;

            // Get this machine's ip address
            _.each(_.keys(ifaces), function (iface) {
                if (iface !== 'lo') {
                    var info = _.filter(ifaces[iface], function (details) {
                            return details.family === 'IPv4' && !details.internal;
                        });
                    if (info.length > 0) {
                        ip = info[0].address;
                        return false;
                    }
                }
            });

            socket.emit('announceIP', {mac: macAddress, ip: ip});
        });

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
            //console.log('got controller data: ', new Date().getTime());
            /*
            console.log('got controller data: ', {
                'magnitude': data.magnitude,
                'radians': data.radians,
                'rotation': data.rotation,
                'tilt': data.tilt
            });
            */

            /*******************************************************************************
            * Send movement commands in comma separated value with a ; ending
            ********************************************************************************/
            /*
            serialPort.write('#' + data.magnitude + ',' + data.radians + ',' + data.rotation + ',' + data.tilt + ';', function (err, results) {
                if (err) {
                    socket.send('error writing serial data');
                }else{
                    socket.send('successfully wrote serial data');
                }
            });
            */

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
//});
