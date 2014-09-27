var passport = require('passport'),
    colors = require('colors'),
    config = require('getconfig'),
    LocalStrategy = require('passport-local').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    User = require('../models/user');

// Local authentication strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne().or([{username: username}, {email: username}]).exec(function (err, user) {
            if (err) {
                console.log('Error finding user: '.error, JSON.stringify(err, null, 2).error);
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Invalid username or password'});
            }
            user.checkPassword(password, function (err, matches) {
                if (err) {
                    console.log('Error checking password: '.error, JSON.stringify(err, null, 2).error);
                    return done(err);
                }
                if (!matches) {
                    return done(null, false, {message: 'Invalid username or password'});
                }
                return done(null, user);
            });
        });
    }
));

// Github authentication strategy
passport.use(new GitHubStrategy(config.githubStrategy, function(accessToken, refreshToken, profile, done) {
    console.log('profile: '.info, JSON.stringify(profile, null, 2).verbose);
    User.findOne({ oauthID: profile.id }, function(err, user) {
        if (err) {
            console.log('Error finding user: '.error, JSON.stringify(err, null, 2).error);
        }
        if (!err && user !== null) {
            done(null, user);
        } else {
            user = new User({
                oauthID: profile.id,
                oauthToken: accessToken,
                name: profile.displayName,
                created: Date.now()
            });
            user.save(function(err) {
                if (err) {
                    console.log('Error saving user: '.error, JSON.stringify(err, null, 2).error);
                    return done(err);
                }
                done(null, user);
            });
        }
    });
}
));

passport.serializeUser( function(user, done) {
    done(null, user._id);
});

passport.deserializeUser( function(id, done) {
    User.findById(id, function(err, user) {
        if (!err) {
            done(null, user);
        } else {
            done(err, null);
        }
    });
});
