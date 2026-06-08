const User = require('../models/User');
const Order = require('../models/Order');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    
    res.json({
      user,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.cart = req.body.cartItems;
    await user.save();
    
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, updateUserCart, getUserCart };
