const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');
const Product = require('./models/Product');

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homeopathy_store');
    console.log('MongoDB Connected');

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not defined in .env');
      process.exit(1);
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const products = await Product.find({
      $or: [
        { shortDescription: { $exists: false } },
        { shortDescription: '' },
        { shortDescription: 'null' },
        { shortDescription: 'false' },
        { shortDescription: null }
      ]
    });

    console.log(`Found ${products.length} products needing short descriptions.`);

    for (const product of products) {
      try {
        console.log(`Generating short description for: ${product.name}`);
        
        const prompt = `You are an expert homeopathic pharmacist. 
        Generate details for a homeopathic medicine named "${product.name}" manufactured by "${product.company}".
        Return ONLY a raw JSON object (no markdown, no backticks) with the following exact key:
        {
          "shortDescription": "A concise 4-5 word summary of what this product is specifically used for (e.g. 'For headache and fever', 'Liver tonic', 'Joint pain relief')."
        }`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        let responseText = response.text;
        
        if (responseText.startsWith('```json')) {
          responseText = responseText.replace(/```json\n/g, '').replace(/```/g, '').trim();
        } else if (responseText.startsWith('```')) {
          responseText = responseText.replace(/```\n/g, '').replace(/```/g, '').trim();
        }
        
        try {
          const seoData = JSON.parse(responseText);
          
          if (seoData.shortDescription) {
            product.shortDescription = seoData.shortDescription;
            await product.save();
            console.log(`Saved short description for ${product.name}: ${product.shortDescription}`);
          }
        } catch (parseError) {
          console.error(`Failed to parse JSON for ${product.name}:`, responseText);
        }
        
        // Respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (innerError) {
        console.error(`Failed on ${product.name}:`, innerError.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log('Finished updating all short descriptions.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

run();
