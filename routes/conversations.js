const express = require('express');
const router = express.Router();
const { getConversations } = require('../controllers/conversationController');
const { verifyTokenMiddleware } = require('../middleware/auth');

router.get('/:email/', verifyTokenMiddleware, getConversations);

module.exports = router;
