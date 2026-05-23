const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    const filePath = path.join(__dirname, 'scraped_products.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const scrapedProducts = JSON.parse(rawData);

    const formattedProducts = scrapedProducts.map((p) => {
      // Clean up price (e.g. "215" -> 215)
      const priceNum = p.price ? parseInt(p.price.replace(/\D/g, ''), 10) : 0;

      return {
        name: p.name || 'Unknown SBL Product',
        description: p.description || `${p.name} is a high quality SBL homeopathic medicine.`,
        price: priceNum || 100,
        potency: 'LM', // Default since the category is LM potency dilutions
        dilution: 'Liquid',
        motherTincture: false,
        company: 'SBL',
        stock: 50, // Default stock
        image: p.image || 'https://via.placeholder.com/150',
      };
    });

    // Delete existing products to avoid conflicts if they want only these
    // Actually, they said they wanted no products before, so we just insert
    await Product.insertMany(formattedProducts);

    console.log(`Successfully imported ${formattedProducts.length} scraped products into the database.`);
    process.exit();
  } catch (error) {
    console.error(`Error with import: ${error.message}`);
    process.exit(1);
  }
};

importData();
