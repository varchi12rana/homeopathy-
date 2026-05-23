const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getOrderById,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/user').get(protect, getMyOrders);
router.route('/admin').get(protect, admin, getOrders);
router.route('/:id').get(protect, getOrderById).put(protect, admin, updateOrderStatus);

module.exports = router;
