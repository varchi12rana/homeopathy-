const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const product = await Product.findOne({ name: /skincare/i });
    console.log('Product image in DB:', JSON.stringify(product?.image));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
