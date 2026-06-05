const express = require('express');
const { generateToken } = require('../utils/jwt');
const router = express.Router();

// Generate JWT token
router.post('/jwt', async (req, res) => {
  try {
    const email = req.body;
    const token = generateToken(email);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    }).send({ success: true });
  } catch (error) {
    res.status(500).send({ message: 'Error generating token', error: error.message });
  }
});

// Logout
router.get('/logout', async (req, res) => {
  try {
    res.clearCookie('token', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    }).send({ success: true });
  } catch (error) {
    console.error('Error clearing cookie:', error);
    res.status(500).send({ success: false, message: 'Failed to log out' });
  }
});

module.exports = router;
