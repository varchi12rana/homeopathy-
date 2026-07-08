const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  verifyPayment, 
  webhookHandler,
  getPayments,
  getPaymentStats
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');
const { verifyWebhook } = require('../middlewares/verifyWebhook');

// Admin routes
router.get('/all', protect, admin, getPayments);
router.get('/stats', protect, admin, getPaymentStats);

// User payment routes
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

// Webhook route requires raw body parsing, handled in server.js but middleware here for signature verify
router.post('/webhook', verifyWebhook, webhookHandler);

module.exports = router;
