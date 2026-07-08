const mongoose = require('mongoose');

const paymentLogSchema = mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    razorpayOrderId: {
      type: String,
    },
    event: {
      type: String,
      required: true,
      enum: [
        'Payment Started', 
        'Payment Success', 
        'Payment Failed', 
        'Verification', 
        'Webhook Received', 
        'Refund Created', 
        'Refund Processed', 
        'Retry', 
        'Invoice Generated'
      ]
    },
    payload: {
      type: mongoose.Schema.Types.Mixed, // Can store objects, JSON payload, error messages
    }
  },
  {
    timestamps: true,
  }
);

const PaymentLog = mongoose.model('PaymentLog', paymentLogSchema);

module.exports = PaymentLog;
