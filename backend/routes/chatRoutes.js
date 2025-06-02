const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

// @route   GET /api/chats/:roomId
// @desc    Get all chat messages in a specific room
// @access  Public (you can add auth middleware if needed)
router.get('/chats/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Chat.find({ room: roomId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Failed to fetch chats:", err.message);
    res.status(500).json({ error: "Failed to retrieve chat messages" });
  }
});

module.exports = router;
