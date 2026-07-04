const mongoose = require('mongoose');
const Product = require('./backend/models/Product');
mongoose.connect('mongodb://127.0.0.1:27017/homeo-ecommerce').then(async () => {
  const result = await Product.bulkWrite([
    { updateOne: { filter: { name: 'Test' }, update: { $set: { name: 'Test', company: 'C' } }, upsert: true } },
    { updateOne: { filter: { name: 'Test' }, update: { $set: { name: 'Test', company: 'C' } }, upsert: true } }
  ], { ordered: false });
  console.log(JSON.stringify(result));
  process.exit(0);
});
