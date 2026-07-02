const express = require('express');
const router = express.Router();
const { getNotifications, getUnreadCount, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

// All notification routes should be protected and only accessible by admin
router.get('/', protect, admin, getNotifications);
router.get('/unread-count', protect, admin, getUnreadCount);
router.put('/mark-all-read', protect, admin, markAllAsRead);
router.put('/:id/read', protect, admin, markAsRead);

module.exports = router;
