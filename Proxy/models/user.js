var mongoose = require('mongoose'),
    userSchema = new mongoose.Schema({
        oauthID: Number,
        name: String
    });

module.exports = mongoose.model('User', userSchema);
