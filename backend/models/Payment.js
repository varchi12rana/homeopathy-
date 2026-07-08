const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
    },
    // To create the order after successful payment verification
    checkoutData: {
      orderItems: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
          name: { type: String, required: true },
          qty: { type: Number, required: true },
          price: { type: Number, required: true },
          image: { type: String, required: true },
        }
      ],
      shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phoneNumber: { type: String, required: true },
      },
      totalPrice: {
        type: Number,
        required: true
      }
    }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
