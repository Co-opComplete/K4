var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    validator = require('validator'),
    userSchema = new mongoose.Schema({
        oauthID: Number,
        oauthToken: String,
        name: String,
        username: {type: String, unique: true},
        email: {type: String, unique: true, lowercase: true, validator: validator.isEmail},
        password: String,
        active: {type: Boolean, default: false},
        enabled: {type: Boolean, default: true}
    });

// Instance Method: hashes the given password and updates the models password
userSchema.pre('save', function (next) {
    var user = this;

    // Only run this if the password has changed
    if (!user.isModified('password')) return next();

    // Generate a salt first
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            console.log('Error generating salt: '.error, JSON.stringify(err, null, 4).error);
            return next(err);
        }

        // Hash the password using the salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                console.log('Error hashing password: '.error, JSON.stringify(err, null, 4).error);
                return next(err);
            }

            // Update the password
            user.password = hash;
            next(null);
        });
    });
});

// Instance Method: checks a password against the hashed one in the database
userSchema.methods.checkPassword = function (password, next) {
    bcrypt.compare(password, this.password, function (err, matches) {
        if (err) {
            console.log('Error comparing password: '.error, JSON.stringify(err, null, 2).error);
            return next(err);
        }

        return next(null, matches);
    });
};

module.exports = mongoose.model('User', userSchema);
