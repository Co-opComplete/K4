var rasp2c = require('rasp2c');

rasp2c.detect(function(err, result) {
    if(err) {
        console.log('Error detecting devices: ', err);
    }else{
        console.log('Device detection result: ', result);
    }
});

rasp2c.dump('0x04', '0x11-0x15', function(err, result) {
    if(err) {
        console.log('Error dumping: ', err);
    }else{
        console.log('Dump result: ', result);
    }
});

rasp2c.set('0x04', '0x11', '0x01', function(err, result) {
    if(err) {
        console.log('Error on set: ', err);
    }else{
        console.log('Set result: ', result);
    }
});

/*var i2c = require('i2c'),
    address = 0x18,
    wire = new i2c(address, {device: '/dev/i2c-1', debug: true});

wire.scan(function(err, data) {
    console.log('Scanned addresses: ', data);
});

wire.writeByte(1, function(err) {
    if(err) {
        console.log('Got error: ', err);
    }else{
        console.log('No Error!');
    }
});
*/
