const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'Paid', 'Failed', 'Refunded']
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paymentSignature: { type: String },
    transactionDate: { type: Date },
    invoiceNumber: { type: String }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
