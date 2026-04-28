const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/homeopathy_store');
  const Product = mongoose.model('Product', new mongoose.Schema({ name: String, description: String, company: String }, {strict: false}));
  
  // Find products where description is missing or is the placeholder
  const products = await Product.find({
    $or: [
      { description: 'No description available.' },
      { description: { $exists: false } },
      { description: '' }
    ]
  });
  
  const uniqueProducts = [];
  const names = new Set();
  
  for (const p of products) {
    if (!names.has(p.name)) {
      names.add(p.name);
      uniqueProducts.push({ name: p.name, company: p.company });
    }
  }
  
  console.log('---BEGIN_PRODUCTS---');
  console.log(JSON.stringify(uniqueProducts, null, 2));
  console.log('---END_PRODUCTS---');
  process.exit(0);
}

run().catch(console.error);
