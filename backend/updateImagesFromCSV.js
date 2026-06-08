const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/homeopathy_store');
    console.log('Connected to DB');
    
    const Product = mongoose.model('Product', new mongoose.Schema({}, {strict: false}));
    
    // 1. Remove all existing images (set to placeholder)
    const updateRes = await Product.updateMany(
      {}, 
      { $set: { image: 'https://via.placeholder.com/300?text=No+Image' } }
    );
    console.log(`Reset images for ${updateRes.modifiedCount} products.`);

    // 2. Read the CSV
    const csvPath = path.join(__dirname, '../perfect_upload_template.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8').split('\n');
    
    const headers = csvData[0].split(',').map(h => h.trim());
    const nameIdx = headers.indexOf('Name');
    const imgIdx = headers.indexOf('Image URL');
    const potencyIdx = headers.indexOf('Potency');
    
    let updatedCount = 0;
    
    for (let i = 1; i < csvData.length; i++) {
      const line = csvData[i].trim();
      if (!line) continue;
      
      const cols = line.split(',');
      const name = cols[nameIdx]?.trim();
      const imageUrl = cols[imgIdx]?.trim();
      const potency = cols[potencyIdx]?.trim();
      
      if (name && imageUrl) {
        // Find matching product(s). If potency matches exactly, update that. 
        // If we don't strictly enforce potency, we can update any product with that name if we only have one potency,
        // but let's be careful. Let's do a find by name, and if we match potency, update that specific one.
        // If potency isn't found in DB, just update the one with the matching name.
        let filter = { name: { $regex: new RegExp(`^${name}$`, 'i') } };
        
        if (potency) {
            // First try with potency
            const match = await Product.findOne({ ...filter, potency: potency });
            if (match) {
                match.image = imageUrl;
                await match.save();
                updatedCount++;
                continue;
            }
        }
        
        // If no strict potency match, update the first one with the name
        const match = await Product.findOne(filter);
        if (match) {
            match.image = imageUrl;
            await match.save();
            updatedCount++;
        } else {
            console.log(`Product not found for: ${name} ${potency || ''}`);
        }
      }
    }
    
    console.log(`Successfully updated images for ${updatedCount} products from CSV.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
