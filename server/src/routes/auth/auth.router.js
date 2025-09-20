const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth login route
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

// Google OAuth callback route
router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: true
    }),
    (req, res) => {
        // Successful authentication, redirect home
        res.redirect('http://localhost:3000');
    }
);

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000');
});

// Get current user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;
