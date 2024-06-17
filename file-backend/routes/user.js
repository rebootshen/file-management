// routes/user.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { auth } = require('../middle/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getUserProfile);

module.exports = router;