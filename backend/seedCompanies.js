const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Company = require('./models/Company');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    const defaultCompanies = [
      'SBL', 'Wheezal', 'WSI', 'Dr. Reckeweg', 
      'Boiron', 'Adel', 'Schwabe', 'Bjain', 
      'Bakson', 'Allen', 'Medisynth', 'R.S. Bhargava'
    ];
    for (const name of defaultCompanies) {
      await Company.updateOne({ name }, { name }, { upsert: true });
    }
    console.log('Default companies imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
