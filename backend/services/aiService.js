const { GoogleGenAI } = require('@google/genai');
const Product = require('../models/Product');

const generateMissingDescriptions = async (productIds) => {
  // Wait a few seconds to let the main request finish completely
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('AI Service Error: GEMINI_API_KEY is not defined in .env');
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  try {
    for (const id of productIds) {
      const product = await Product.findById(id);
      if (!product) continue;
      
      console.log(`Generating description for: ${product.name}`);
      
      const prompt = `Write a short, highly professional, e-commerce product description (around 3 to 4 sentences) for a homeopathic medicine named "${product.name}" manufactured by "${product.company}". 
      Highlight its common uses, benefits, and the fact that it is a natural homeopathic remedy. Do not use any bolding or markdown, just plain text.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const description = response.text;
      
      if (description) {
        product.description = description;
        await product.save();
        console.log(`Saved description for ${product.name}`);
      }
      
      // Delay to avoid hitting rate limits (especially on free tier)
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    console.log('Finished background AI generation task.');
  } catch (error) {
    console.error('Error in background AI generation:', error.message);
  }
};

module.exports = {
  generateMissingDescriptions
};
