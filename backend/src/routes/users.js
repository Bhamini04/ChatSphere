import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).select('-password');
    if (!me) return res.status(404).json({ error: 'User not found' });
    res.json(me);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/me
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const updates = (({ username, bio, profilePic, status }) => ({ username, bio, profilePic, status }))(req.body);
    const me = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(me);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/all
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('username email profilePic status');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/archive/:peerId
router.post('/archive/:peerId', authMiddleware, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    if (!me.archived.includes(req.params.peerId)) {
      me.archived.push(req.params.peerId);
      await me.save();
    }
    res.json({ archived: me.archived });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/unarchive/:peerId
router.post('/unarchive/:peerId', authMiddleware, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    me.archived = me.archived.filter(id => String(id) !== String(req.params.peerId));
    await me.save();
    res.json({ archived: me.archived });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
