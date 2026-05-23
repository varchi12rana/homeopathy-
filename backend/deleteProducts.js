const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const deleteProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    console.log('All products have been removed successfully.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

deleteProducts();
