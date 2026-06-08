const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController');
const { verifyTokenMiddleware } = require('../middleware/auth');

router.get('/messages/:roomId', verifyTokenMiddleware, getMessages);

module.exports = router;
