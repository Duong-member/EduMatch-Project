const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const io = req.io;

  if (!io) {
    console.error('io is not attached to req');
    return res.status(500).json({ error: 'Socket server not ready' });
  }

  const { userId, message, type, data } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const payload = {
    userId: userId || null,
    message,
    type: type || 'general',
    data: data || null,
    createdAt: new Date().toISOString()
  };

  if (userId) {
    // gửi riêng cho 1 user
    const room = `user:${userId}`;
    io.to(room).emit('notification', payload);
    console.log('Emit notification to room:', room, payload);
  } else {
    // broadcast cho tất cả
    io.emit('notification', payload);
    console.log('Emit notification to ALL clients:', payload);
  }

  return res.json({ status: 'ok', payload });
});

module.exports = router;
