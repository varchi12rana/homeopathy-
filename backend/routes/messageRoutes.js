const express = require('express');
const router = express.Router();
const { createMessage, getMessages, getUserMessages, replyMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.error('Optional auth failed:', error);
    }
  }
  next();
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

router.post('/', optionalAuth, createMessage);
router.get('/', protect, admin, getMessages);
router.get('/my', protect, getUserMessages);
router.put('/:id/reply', protect, admin, replyMessage);

module.exports = router;
