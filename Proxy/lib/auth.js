var passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
    User = require('../models/user');

passport.use(new GitHubStrategy({
    // clientID: '124f0309abe008b9a88e',
    // clientSecret: 'e680ffa1851db07a4dbdc947e61b535ee70ed665',
    // callbackURL: 'http://k4-dev.cmgeneral.local:8000/auth/github/callback'
    clientID: '6f2ca4abad854944f17a',
    clientSecret: '4ca876c5191d972b564f49ffab2af86270423c43',
    callbackURL: 'http://192.168.114.99:8000/auth/github/callback'
}, function(accessToken, refreshToken, profile, done) {
    // process.nextTick(function() {
    //     return done(null, profile);
    // });
    User.findOne({ oauthID: profile.id }, function(err, user) {
        if(err) { console.log('error finding user: ', err); }
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
    done(null, user._id);
});
passport.deserializeUser( function(id, done) {
    User.findById(id, function(err, user) {
        //console.log(user);
        if (!err) { done(null, user); }
        else { done(err, null); }
    });
});
