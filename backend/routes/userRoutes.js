const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserCart, getUserCart } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/profile/cart').get(protect, getUserCart).put(protect, updateUserCart);
router.route('/:id').get(protect, admin, getUserById);

module.exports = router;
