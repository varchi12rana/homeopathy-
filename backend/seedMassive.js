const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const companies = ['SBL', 'Wheezal', 'WSI', 'Dr. Reckeweg'];
const potencies = ['6X', '12X', '30C', '200C', '1M', '10M', 'CM'];
const images = [
  'https://cdn.pixabay.com/photo/2018/02/04/10/06/homeopathy-3129532_1280.jpg',
  'https://cdn.pixabay.com/photo/2018/08/21/23/29/homeopathy-3622439_1280.jpg',
  'https://cdn.pixabay.com/photo/2015/12/06/18/28/capsules-1079838_1280.jpg'
];

const seedMassive = async () => {
  try {
    await connectDB();
    
    // We will clear existing products to avoid duplicates and ensure exactly 10000+ items
    console.log("Clearing existing products...");
    await Product.deleteMany();

    const raw = fs.readFileSync('rawMedicines.txt', 'utf8');
    const lines = raw.split('\n');
    const cleaned = [];

    for (let line of lines) {
      let text = line.trim();
      if (!text || text === 'TOTAL') continue;
      text = text.replace(/^\d+\s*/, '').trim();
      if (text) cleaned.push(text);
    }
    
    const uniqueMedicines = [...new Set(cleaned)].sort(); // ~957 items
    
    console.log(`Generating 10,000 products from ${uniqueMedicines.length} base medicines...`);
    const products = [];
    
    // Generate exactly 10,000 products
    for (let i = 0; i < 10000; i++) {
      // Pick a random base medicine
      const medName = uniqueMedicines[Math.floor(Math.random() * uniqueMedicines.length)];
      // Capitalize properly
      const formattedName = medName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      const comp = companies[Math.floor(Math.random() * companies.length)];
      const potency = potencies[Math.floor(Math.random() * potencies.length)];
      
      products.push({
        name: formattedName,
        company: comp,
        price: Math.floor(Math.random() * 250) + 50, // Between 50 and 300
        image: images[Math.floor(Math.random() * images.length)],
        description: `Authentic ${formattedName} dilution (${potency}) manufactured by ${comp}. Highly effective homeopathic remedy.`,
        stock: Math.floor(Math.random() * 100) + 1,
        potency: potency,
        dilution: 'Liquid',
        motherTincture: Math.random() > 0.85, // 15% chance of being mother tincture
      });
    }

    // Insert in batches of 2000 to avoid memory/buffer issues
    const batchSize = 2000;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${i/batchSize + 1} (${batch.length} products)...`);
    }

    console.log(`Successfully added exactly 10,000 products to the website!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedMassive();
