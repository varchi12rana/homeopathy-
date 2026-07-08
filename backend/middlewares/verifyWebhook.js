const crypto = require('crypto');

const verifyWebhook = (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.warn('RAZORPAY_WEBHOOK_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Webhook secret not configured' });
    }

    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({ message: 'Missing Razorpay signature' });
    }

    // req.body should be a Buffer because of express.raw()
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    // Parse the JSON body after verifying so subsequent handlers can use it as an object
    req.body = JSON.parse(req.body.toString('utf8'));
    next();
  } catch (error) {
    console.error('Webhook verification error:', error);
    res.status(500).json({ message: 'Failed to verify webhook' });
  }
};

module.exports = { verifyWebhook };
