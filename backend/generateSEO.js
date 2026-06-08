const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const generateLocalSEO = async () => {
  try {
    console.log('Fetching products without SEO tags...');
    // Find products that don't have metaTitle set
    const products = await Product.find({ metaTitle: { $exists: false } });
    console.log(`Found ${products.length} products needing SEO tags.`);

    let count = 0;
    for (const product of products) {
      // Generate basic Local SEO tags since we don't want to use 1900 API calls 
      // (saves user significant cost while providing instant basic SEO)
      
      const metaTitle = `${product.name} | Natural Homeopathic Remedy by ${product.company}`;
      
      let descriptionSnippet = product.description || '';
      if (descriptionSnippet.length > 150) {
        descriptionSnippet = descriptionSnippet.substring(0, 150) + '...';
      }
      const metaDescription = descriptionSnippet || `Buy ${product.name} online. 100% authentic homeopathic medicine manufactured by ${product.company}. Natural holistic healing.`;
      
      const seoKeywords = [
        product.name.toLowerCase(),
        product.company.toLowerCase(),
        product.category ? product.category.toLowerCase() : 'homeopathy',
        'homeopathic medicine',
        'natural remedy',
        'buy online'
      ];

      product.metaTitle = metaTitle;
      product.metaDescription = metaDescription;
      product.seoKeywords = [...new Set(seoKeywords)]; // unique keywords
      
      await product.save();
      count++;
      
      if (count % 100 === 0) {
        console.log(`Processed ${count} products...`);
      }
    }

    console.log(`Successfully generated SEO tags for ${count} products.`);
    process.exit();
  } catch (error) {
    console.error('Error generating SEO:', error);
    process.exit(1);
  }
};

generateLocalSEO();
