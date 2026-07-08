const Razorpay = require('razorpay');

class RazorpayService {
  get razorpay() {
    if (!this._razorpay) {
      const key_id = process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : undefined;
      const key_secret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : undefined;
      this._razorpay = new Razorpay({
        key_id,
        key_secret,
      });
    }
    return this._razorpay;
  }

  async createOrder(options) {
    try {
      return await this.razorpay.orders.create(options);
    } catch (error) {
      console.error('Razorpay SDK Order Create Error:', error);
      const specificError = error.error ? error.error.description : error.message;
      throw new Error(`Razorpay Error: ${specificError}`);
    }
  }

  async verifyPaymentSignature(orderId, paymentId, signature) {
    const crypto = require('crypto');
    const sign = orderId + '|' + paymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    return expectedSign === signature;
  }
}

module.exports = new RazorpayService();
