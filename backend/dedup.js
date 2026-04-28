const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/homeopathy_store');
  const Product = mongoose.model('Product', new mongoose.Schema({}, {strict: false}));
  
  const products = await Product.find({}).sort({createdAt: 1}); // Sort oldest to newest
  
  const seen = new Set();
  let deletedCount = 0;
  
  for (const p of products) {
    const key = `${p.name}_${p.company}_${p.potency || ''}_${p.dilution || ''}`;
    if (seen.has(key)) {
      await Product.findByIdAndDelete(p._id);
      deletedCount++;
    } else {
      seen.add(key);
    }
  }
  
  console.log(`Successfully deleted ${deletedCount} duplicate products.`);
  process.exit(0);
}

run().catch(console.error);
