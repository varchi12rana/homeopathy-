const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'C:/homeo ecoomerce/backend/.env' });
const User = require('C:/homeo ecoomerce/backend/models/User');
const Product = require('C:/homeo ecoomerce/backend/models/Product');
const connectDB = require('C:/homeo ecoomerce/backend/config/db');

async function testUserBackend() {
  await connectDB();
  try {
    let user = await User.findOne({ email: 'test@test.com' });
    if (!user) {
      user = await User.create({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        role: 'user',
        mobileNumber: '9999999999'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    const product = await Product.findOne({});
    if (!product) throw new Error('No product found');

    const payload = {
      orderItems: [
        { product: product._id.toString(), qty: 1 }
      ],
      shippingAddress: {
        address: '123 Test',
        city: 'Test City',
        postalCode: '123456',
        country: 'India',
        phoneNumber: '9999999999'
      },
      paymentMethod: 'Prepaid - Credit / Debit Card'
    };

    console.log('Sending request to user backend at localhost:5001...');
    const res = await axios.post('http://localhost:5001/api/payment/create-order', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Success:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('API Error Status:', err.response.status);
      console.log('API Error Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('Network Error:', err.message);
    }
  }
  process.exit();
}

testUserBackend();
