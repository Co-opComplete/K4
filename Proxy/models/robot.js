var mongoose = require('mongoose'),
    robotSchema = new mongoose.Schema({
        name: String,
        mac: String,
        ip: String
    });

module.exports = mongoose.model('Robot', robotSchema);
