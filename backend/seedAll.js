const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Images for homeopathy
const images = [
  'https://cdn.pixabay.com/photo/2018/02/04/10/06/homeopathy-3129532_1280.jpg',
  'https://cdn.pixabay.com/photo/2018/08/21/23/29/homeopathy-3622439_1280.jpg',
  'https://cdn.pixabay.com/photo/2015/12/06/18/28/capsules-1079838_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/07/24/21/01/thermometer-1539191_1280.jpg',
  'https://cdn.pixabay.com/photo/2014/12/10/20/48/laboratory-563423_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/10/22/03/49/medicine-1759714_1280.jpg'
];

const companies = ['SBL', 'Wheezal', 'WSI', 'Dr. Reckeweg'];
const potencies = ['6X', '30C', '200C', '1M'];

const importAllData = async () => {
  try {
    const raw = fs.readFileSync('rawMedicines.txt', 'utf8');
    const lines = raw.split('\n');
    const cleaned = [];

    for (let line of lines) {
      let text = line.trim();
      if (!text || text === 'TOTAL') continue;
      text = text.replace(/^\d+\s*/, '').trim();
      if (text) cleaned.push(text);
    }
    
    const uniqueMedicines = [...new Set(cleaned)].sort();
    
    // Generate products
    const products = [];
    
    // We will generate 2 products for each medicine, assigned to different companies randomly
    for (let med of uniqueMedicines) {
      // First product
      const comp1 = companies[Math.floor(Math.random() * companies.length)];
      products.push({
        name: med,
        image: images[Math.floor(Math.random() * images.length)],
        description: `${med} is a highly effective homeopathic medicine formulated by ${comp1} for comprehensive care and holistic healing.`,
        company: comp1,
        price: Math.floor(Math.random() * 150) + 50, // 50 to 200
        stock: Math.floor(Math.random() * 50) + 10,
        potency: potencies[Math.floor(Math.random() * potencies.length)],
        dilution: 'Liquid',
        motherTincture: false,
      });
      
      // Second product for another company
      const comp2 = companies[Math.floor(Math.random() * companies.length)];
      products.push({
        name: med,
        image: images[Math.floor(Math.random() * images.length)],
        description: `${med} is a highly effective homeopathic medicine formulated by ${comp2} for comprehensive care and holistic healing.`,
        company: comp2,
        price: Math.floor(Math.random() * 150) + 50, // 50 to 200
        stock: Math.floor(Math.random() * 50) + 10,
        potency: potencies[Math.floor(Math.random() * potencies.length)],
        dilution: 'Liquid',
        motherTincture: true,
      });
    }

    // Delete existing to avoid clutter, or just insert them.
    // We'll delete all to start fresh with a massive catalog
    await Product.deleteMany();
    await Product.insertMany(products);

    console.log(`Successfully added ${products.length} products across all companies!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importAllData();
