const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const PaymentLog = require('../models/PaymentLog');
const razorpayService = require('../services/razorpayService');
const { generateInvoice } = require('../utils/invoiceGenerator');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const { sendNewOrderNotification } = require('../utils/whatsappService');

const dispatchAdminNotification = async (req, order) => {
  try {
    sendNewOrderNotification(order).catch(err => console.error('WhatsApp Error:', err));

    const title = `New Order: #${order._id.toString().substring(18)}`;
    const message = `${order.user.name} placed an order for ₹${order.totalPrice.toFixed(2)}`;
    
    const notification = new Notification({
      title,
      message,
      orderId: order._id
    });
    const savedNotification = await notification.save();

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

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

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
    const totalPrice = itemsPrice + shippingPrice;

    const options = {
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    };

    const razorpayOrder = await razorpayService.createOrder(options);

    // Instead of Order, create a Payment document to hold state temporarily
    const payment = new Payment({
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalPrice,
      currency: 'INR',
      status: 'Pending',
      paymentMethod,
      checkoutData: {
        orderItems: validatedItems,
        shippingAddress,
        totalPrice
      }
    });

    const savedPayment = await payment.save();

    await PaymentLog.create({
      paymentId: savedPayment._id,
      razorpayOrderId: razorpayOrder.id,
      event: 'Payment Started',
      payload: options
    });

    res.status(200).json({
      paymentId: savedPayment._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : ''
    });

  } catch (error) {
    console.error('Error creating razorpay order:', error);
    res.status(500).json({ message: error.message || 'Failed to create payment order' });
  }
};

const processSuccessfulPayment = async (req, payment, razorpayPaymentId, signature) => {
  // Prevent duplicate processing
  if (payment.status === 'Paid') {
    return await Order.findById(payment.order).populate('user', 'name email');
  }

  // Update Payment Status
  payment.status = 'Paid';
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.signature = signature;
  
  // Generate Invoice Number
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  payment.invoiceNumber = `INV-${dateStr}-${payment._id.toString().slice(-6).toUpperCase()}`;

  // Create actual Order now that payment is verified
  const order = new Order({
    user: payment.user,
    products: payment.checkoutData.orderItems,
    shippingAddress: payment.checkoutData.shippingAddress,
    paymentMethod: payment.paymentMethod,
    totalPrice: payment.checkoutData.totalPrice,
    paymentStatus: 'Paid',
    orderStatus: 'Pending',
    razorpayOrderId: payment.razorpayOrderId,
    razorpayPaymentId: razorpayPaymentId,
    paymentSignature: signature,
    transactionDate: new Date(),
    invoiceNumber: payment.invoiceNumber
  });

  const savedOrder = await order.save();
  const populatedOrder = await Order.findById(savedOrder._id).populate('user', 'name email');
  
  payment.order = savedOrder._id;
  await payment.save();

  // Reduce Stock
  for (const item of payment.checkoutData.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock = Math.max(0, product.stock - item.qty);
      await product.save();
    }
  }

  // Async tasks: Invoice, Email, Notifications
  try {
    const pdfBuffer = await generateInvoice(populatedOrder, populatedOrder.user);
    await sendOrderConfirmationEmail(populatedOrder, populatedOrder.user, pdfBuffer);
  } catch (err) {
    console.error('Failed async tasks (Invoice/Email):', err);
  }
  
  if (req) {
    await dispatchAdminNotification(req, populatedOrder);
  }

  return populatedOrder;
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id }).populate('user');
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    const isValid = await razorpayService.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      payment.status = 'Failed';
      await payment.save();
      await PaymentLog.create({
        paymentId: payment._id,
        razorpayOrderId: razorpay_order_id,
        event: 'Payment Failed',
        payload: { error: 'Invalid Signature' }
      });
      return res.status(400).json({ message: 'Invalid signature. Payment failed.' });
    }

    const order = await processSuccessfulPayment(req, payment, razorpay_payment_id, razorpay_signature);

    await PaymentLog.create({
      paymentId: payment._id,
      razorpayOrderId: razorpay_order_id,
      event: 'Payment Success',
      payload: req.body
    });

    res.status(200).json({ message: 'Payment verified successfully', order });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
};

const webhookHandler = async (req, res) => {
  try {
    // Note: The signature is already verified by verifyWebhook middleware
    // req.body is already parsed to JSON
    const { event, payload } = req.body;
    const paymentEntity = payload.payment.entity;

    const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id }).populate('user');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found for webhook' });
    }

    await PaymentLog.create({
      paymentId: payment._id,
      razorpayOrderId: paymentEntity.order_id,
      event: 'Webhook Received',
      payload: req.body
    });

    if (event === 'payment.captured' || event === 'payment.authorized') {
      if (payment.status !== 'Paid') {
         // Create a signature that passes verification to emulate what happens in frontend if we want,
         // but since webhook is verified, we can bypass signature verification or use webhook body signature
         // We'll just pass 'webhook-verified' as signature since we already authenticated the webhook payload.
         await processSuccessfulPayment(req, payment, paymentEntity.id, 'webhook-verified');
      }
    } else if (event === 'payment.failed') {
      payment.status = 'Failed';
      await payment.save();
    } else if (event === 'refund.processed' || event === 'refund.created') {
      payment.status = 'Refunded';
      if (payment.order) {
        const order = await Order.findById(payment.order);
        if (order) {
          order.paymentStatus = 'Refunded';
          await order.save();
        }
      }
      await payment.save();
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
};

// Admin endpoints for Payment Management
const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {};
    if (search) {
      query.$or = [
        { razorpayOrderId: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      payments,
      pages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments({ status: 'Paid' });
    const aggregate = await Payment.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = aggregate.length > 0 ? aggregate[0].totalRevenue : 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayAggregate = await Payment.aggregate([
      { $match: { status: 'Paid', createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, todaysRevenue: { $sum: '$amount' } } }
    ]);
    const todaysRevenue = todayAggregate.length > 0 ? todayAggregate[0].todaysRevenue : 0;

    const successfulPayments = await Payment.countDocuments({ status: 'Paid' });
    const failedPayments = await Payment.countDocuments({ status: 'Failed' });
    const pendingPayments = await Payment.countDocuments({ status: 'Pending' });
    const refunds = await Payment.countDocuments({ status: 'Refunded' });

    res.status(200).json({
      totalRevenue,
      todaysRevenue,
      successfulPayments,
      failedPayments,
      pendingPayments,
      refunds,
      totalPayments
    });
  } catch (error) {
    console.error('Failed to fetch payment stats:', error);
    res.status(500).json({ message: 'Failed to fetch payment statistics' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  webhookHandler,
  getPayments,
  getPaymentStats
};
