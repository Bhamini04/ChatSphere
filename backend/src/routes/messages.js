import express from 'express';
import Message from '../models/Message.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/messages/thread/:peerId
router.get('/thread/:peerId', authMiddleware, async (req, res) => {
  try {
    const me = req.user.id;
    const { peerId } = req.params;
    const items = await Message.find({
      $or: [
        { sender: me, receiver: peerId },
        { sender: peerId, receiver: me }
      ]
    }).sort({ createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messages/send  (optional - restful backup)
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { receiverId, text, media } = req.body;
    const msg = await Message.create({ sender: req.user.id, receiver: receiverId, text: text || '', media: media || '' });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/messages/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    if (msg.sender.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    await msg.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
