var serialport = require('serialport'),
    serialPort = new serialport.SerialPort('/dev/ttyAMA0', {
        baudrate: 9600,
        parser: serialport.parsers.readline('\n')
    });

serialPort.on('open', function () {
    console.log('Serial port opened');

    serialPort.on('data', function (data) {
        console.log('data received: ', data);
    });

    serialPort.write('a', function (err, results) {
        if (err) {
            console.log('got error: ', err);
        }else{
            console.log('write results: ', results);
        }
    });
});
