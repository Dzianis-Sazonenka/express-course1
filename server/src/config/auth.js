require('dotenv').config();

module.exports = {
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    session: {
        cookieKey: process.env.SESSION_COOKIE_KEY || 'your-session-secret'
    }
};
