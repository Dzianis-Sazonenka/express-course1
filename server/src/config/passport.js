const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const authConfig = require('./auth');

// Serialize user into the sessions
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the sessions
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy(
    {
        clientID: authConfig.google.clientID,
        clientSecret: authConfig.google.clientSecret,
        callbackURL: authConfig.google.callbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id });
            
            if (!user) {
                // Create new user if doesn't exist
                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0]?.value
                });
                await user.save();
            }
            
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

module.exports = passport;
