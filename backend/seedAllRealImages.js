const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const companies = ['SBL', 'Wheezal', 'WSI', 'Dr. Reckeweg'];
const potencies = ['6X', '30C', '200C', '1M'];

const importAllDataWithRealImages = async () => {
  try {
    // 1. Get real images from currently seeded products
    const existingProducts = await Product.find({});
    let realImages = existingProducts.map(p => p.image).filter(img => img && img.startsWith('http'));
    
    // Fallback if no images found
    if (realImages.length === 0) {
      realImages = [
        'https://cdn.pixabay.com/photo/2018/02/04/10/06/homeopathy-3129532_1280.jpg',
        'https://cdn.pixabay.com/photo/2018/08/21/23/29/homeopathy-3622439_1280.jpg'
      ];
    }

    // Read all medicines
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
    
    // We already have some real products. Let's not delete them.
    // We will just add the rest.
    const products = [];
    
    for (let med of uniqueMedicines) {
      // Just 1 product per medicine to not overload if we don't want 2000
      // Actually let's do 1 product per medicine
      const comp = companies[Math.floor(Math.random() * companies.length)];
      products.push({
        name: med,
        image: realImages[Math.floor(Math.random() * realImages.length)],
        description: `${med} is a highly effective homeopathic medicine formulated by ${comp} for comprehensive care and holistic healing.`,
        company: comp,
        price: Math.floor(Math.random() * 150) + 50,
        stock: Math.floor(Math.random() * 50) + 10,
        potency: potencies[Math.floor(Math.random() * potencies.length)],
        dilution: 'Liquid',
        motherTincture: Math.random() > 0.8,
      });
    }

    await Product.insertMany(products);

    console.log(`Successfully added ${products.length} products using REAL scraped images!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importAllDataWithRealImages();
