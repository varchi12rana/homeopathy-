const mongoose = require('mongoose');

// A mini-dictionary for some common homeopathic remedies to give them unique AI-like descriptions
const specificDescriptions = {
  'Abies Canadensis': 'Abies Canadensis is a homeopathic remedy primarily used for digestive issues, especially gastric discomfort accompanied by a constant feeling of hunger.',
  'Abies Nigra': 'Abies Nigra is highly effective for stomach complaints, particularly when there is a sensation of a lump in the stomach, especially after eating.',
  'Abroma Augusta': 'Abroma Augusta is an excellent homeopathic medicine known for its benefits in managing blood sugar levels and supporting the female reproductive system.',
  'Abel Moschus': 'Abel Moschus is traditionally used for nervous system support and addressing symptoms of anxiety and restlessness.',
  'Arnica Montana': 'Arnica Montana is the premier homeopathic remedy for muscle pain, bruises, trauma, and reducing inflammation after injury.',
  'Nux Vomica': 'Nux Vomica is widely used to treat digestive issues, stress, and symptoms associated with overindulgence in food or stimulants.'
};

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/homeopathy_store');
  const Product = mongoose.model('Product', new mongoose.Schema({ name: String, description: String, company: String, category: String }, {strict: false}));
  
  // Find products where description is 'N/A', empty, or placeholder
  const products = await Product.find({
    $or: [
      { description: 'N/A' },
      { description: 'No description available.' },
      { description: { $exists: false } },
      { description: '' }
    ]
  });
  
  let updatedCount = 0;
  
  for (const product of products) {
    let newDesc = specificDescriptions[product.name];
    
    if (!newDesc) {
      // Generate a highly professional "AI-like" dynamic description based on the product details
      const categoryText = product.category ? product.category.toLowerCase() : 'remedy';
      newDesc = `${product.name} is a high-quality homeopathic ${categoryText} formulated to support natural healing. Prepared strictly according to traditional homeopathic principles by ${product.company}, it is commonly used for its specific therapeutic indications to stimulate the body's self-healing mechanisms. Please consult a qualified homeopathic physician for precise dosage and symptom matching.`;
    }
    
    product.description = newDesc;
    await product.save();
    updatedCount++;
  }
  
  console.log(`Successfully generated and updated descriptions for ${updatedCount} products!`);
  process.exit(0);
}

run().catch(console.error);
