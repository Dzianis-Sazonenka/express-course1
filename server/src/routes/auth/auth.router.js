const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../../models/user.model');

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
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
});

// Mock login for testing
if (process.env.NODE_ENV === 'test') {
    router.post('/mock-login', async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Login failed', error: err });
                }
                res.status(200).json({ message: 'Logged in successfully' });
            });
        } catch (error) {
            res.status(500).json({ message: 'Error during login', error: error.message });
        }
    });
}

// Get current user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;
