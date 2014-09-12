var mongoose = require('mongoose'),
    userSchema = new mongoose.Schema({
        oauthID: Number,
        oauthToken: String,
        name: String
    });

module.exports = mongoose.model('User', userSchema);
