const axios = require('axios');

const sendNewOrderNotification = async (order) => {
  try {
    const apiUrl = process.env.WHATSAPP_API_URL;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER || '9638930188';

    if (!apiUrl || !token || !phoneId) {
      console.warn('WhatsApp API credentials not fully configured. Skipping notification.');
      return false;
    }

    // Format products
    const productList = order.products
      .map(p => `- ${p.name} (Qty: ${p.qty}) - ₹${p.price * p.qty}`)
      .join('\n');

    // Format Address
    const address = order.shippingAddress;
    const deliveryAddress = `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`;

    // Format Date
    const orderDate = new Date(order.createdAt).toLocaleString();

    // Construct the message text
    const messageText = `🛒 *NEW ORDER RECEIVED*

Order ID: #${order._id}

Customer: ${order.user.name}

Phone: ${address.phoneNumber}

Payment: ${order.paymentStatus || 'Pending'}

Amount: ₹${order.totalPrice.toFixed(2)}

Items:
${productList}

Address:
${deliveryAddress}

Order Time:
${orderDate}

Open Admin Dashboard:
https://homeovia.in/admin/orders`;

    const endpoint = `${apiUrl}/${phoneId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: adminNumber,
      type: "text",
      text: {
        preview_url: false,
        body: messageText
      }
    };

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Try sending with 1 retry
    let attempt = 0;
    while (attempt < 2) {
      try {
        await axios.post(endpoint, payload, { headers });
        console.log(`WhatsApp notification sent for order ${order._id}`);
        return true;
      } catch (err) {
        attempt++;
        if (attempt >= 2) {
          console.error(`Failed to send WhatsApp notification after 2 attempts:`, err?.response?.data || err.message);
          return false;
        }
      }
    }
  } catch (error) {
    console.error('Error in sendNewOrderNotification:', error);
    return false;
  }
};

module.exports = {
  sendNewOrderNotification
};
