const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { generateInvoice } = require('../utils/invoiceGenerator');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const { sendNewOrderNotification } = require('../utils/whatsappService');

const dispatchAdminNotification = async (req, order) => {
  try {
    // 1. Send WhatsApp Notification asynchronously (no await to prevent blocking)
    sendNewOrderNotification(order).catch(err => console.error('WhatsApp Error:', err));

    // 2. Save Notification to DB
    const title = `New Order: #${order._id.toString().substring(18)}`;
    const message = `${order.user.name} placed an order for ₹${order.totalPrice.toFixed(2)}`;
    
    const notification = new Notification({
      title,
      message,
      orderId: order._id
    });
    const savedNotification = await notification.save();

    // 3. Emit Socket.IO Event
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order_notification', {
        _id: savedNotification._id,
        title,
        message,
        orderId: order._id,
        createdAt: savedNotification.createdAt,
        amount: order.totalPrice,
        customerName: order.user.name
      });
    }
  } catch (error) {
    console.error('Failed to dispatch admin notification:', error);
  }
};

// Create a Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Calculate total from database
    let itemsPrice = 0;
    const validatedItems = [];
    
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      itemsPrice += product.price * item.qty;
      validatedItems.push({
        product: product._id,
        name: product.name,
        qty: item.qty,
        price: product.price,
        image: product.image,
      });
    }

    const shippingPrice = itemsPrice < 500 ? 100 : 0;
    // We assume this is prepaid so no COD charge
    const totalPrice = itemsPrice + shippingPrice;

    const razorpay = getRazorpayInstance();
    const options = {
      amount: Math.round(totalPrice * 100), // amount in the smallest currency unit
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save initial order in DB with pending status
    const order = new Order({
      user: req.user._id,
      products: validatedItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: 'Pending',
      razorpayOrderId: razorpayOrder.id,
    });

    const createdOrder = await order.save();

    res.status(200).json({
      orderId: createdOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating razorpay order:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      // Signature mismatch
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'Failed';
        await order.save();
      }
      return res.status(400).json({ message: 'Invalid signature. Payment failed.' });
    }

    // Payment is verified
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'Paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentSignature = razorpay_signature;
    order.transactionDate = new Date();
    
    // Generate invoice number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    order.invoiceNumber = `INV-${dateStr}-${order._id.toString().slice(-6).toUpperCase()}`;

    const updatedOrder = await order.save();

    // Generate Invoice PDF and Send Email asynchronously
    try {
      const pdfBuffer = await generateInvoice(updatedOrder, order.user);
      await sendOrderConfirmationEmail(updatedOrder, order.user, pdfBuffer);
    } catch (emailErr) {
      console.error('Failed to send email/generate invoice:', emailErr);
      // We don't want to fail the checkout if email fails
    }

    // Dispatch WhatsApp & Socket notifications
    await dispatchAdminNotification(req, updatedOrder);

    res.status(200).json({ message: 'Payment verified successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
};

const webhookHandler = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const { event, payload } = req.body;
    const paymentEntity = payload.payment.entity;

    const order = await Order.findOne({ razorpayOrderId: paymentEntity.order_id }).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (event === 'payment.captured') {
      if (order.paymentStatus !== 'Paid') {
        order.paymentStatus = 'Paid';
        order.razorpayPaymentId = paymentEntity.id;
        order.transactionDate = new Date();
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        order.invoiceNumber = `INV-${dateStr}-${order._id.toString().slice(-6).toUpperCase()}`;
        await order.save();

        try {
          const pdfBuffer = await generateInvoice(order, order.user);
          await sendOrderConfirmationEmail(order, order.user, pdfBuffer);
        } catch (emailErr) {
          console.error('Failed to send email/generate invoice from webhook:', emailErr);
        }

        // Dispatch WhatsApp & Socket notifications
        await dispatchAdminNotification(req, order);
      }
    } else if (event === 'payment.failed') {
      order.paymentStatus = 'Failed';
      await order.save();
    } else if (event === 'refund.processed' || event === 'refund.created') {
      order.paymentStatus = 'Refunded';
      await order.save();
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  webhookHandler
};
