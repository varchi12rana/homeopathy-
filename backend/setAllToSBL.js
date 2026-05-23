const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const updateProducts = async () => {
  try {
    const result = await Product.updateMany({}, { $set: { company: 'SBL' } });
    console.log(`Updated ${result.modifiedCount} products to be exclusively in the SBL category.`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

updateProducts();
