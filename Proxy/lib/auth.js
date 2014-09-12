var passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
    User = require('../models/user');

passport.use(new GitHubStrategy({
    // clientID: '124f0309abe008b9a88e',
    // clientSecret: 'e680ffa1851db07a4dbdc947e61b535ee70ed665',
    // callbackURL: 'http://k4-dev.cmgeneral.local:8000/auth/github/callback'
    clientID: 'a82cde9a46d14ea1209f',
    clientSecret: '39940c2a559af15dff833b523f554f9778090d1c',
    callbackURL: 'http://localhost:8000/auth/github/callback'
}, function(accessToken, refreshToken, profile, done) {
    // process.nextTick(function() {
    //     return done(null, profile);
    // });
    User.findOne({ oauthID: profile.id }, function(err, user) {
        if(err) { console.log(err); }
        if (!err && user !== null) {
            done(null, user);
        } else {
            user = new User({
                oauthID: profile.id,
                name: profile.displayName,
                created: Date.now()
            });
            user.save(function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Saving user...");
                    done(null, user);
                }
            });
        }
    });
}
));

passport.serializeUser( function(user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});
passport.deserializeUser( function(id, done) {
    User.findById(id, function(err, user) {
        console.log(user);
        if (!err) { done(null, user); }
        else { done(err, null); }
    });
});
