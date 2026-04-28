const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/homeopathy_store');
  const Product = mongoose.model('Product', new mongoose.Schema({ name: String, description: String, company: String }, {strict: false}));
  
  const products = await Product.find({}).limit(5).lean();
  
  console.log('---SAMPLE_PRODUCTS---');
  console.log(JSON.stringify(products, null, 2));
  console.log('---END_SAMPLE---');
  process.exit(0);
}

run().catch(console.error);
