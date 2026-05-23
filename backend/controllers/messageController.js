const Message = require('../models/Message');

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public (Optional User)
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const messageData = {
      name,
      email,
      subject,
      message,
    };
    
    if (req.user) {
      messageData.user = req.user._id;
    }

    const newMessage = new Message(messageData);
    const createdMessage = await newMessage.save();
    
    res.status(201).json(createdMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all messages (admin)
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user messages
// @route   GET /api/messages/my
// @access  Private
const getUserMessages = async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reply to a message
// @route   PUT /api/messages/:id/reply
// @access  Private/Admin
const replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findById(req.params.id);

    if (message) {
      message.reply = reply;
      message.status = 'Replied';
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  getUserMessages,
  replyMessage,
};
