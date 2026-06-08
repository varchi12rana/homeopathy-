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
      try {
        const product = await Product.findById(id);
        if (!product) continue;
        
        console.log(`Generating description for: ${product.name}`);
        
        const prompt = `You are an expert homeopathic pharmacist and SEO specialist. 
        Generate details for a homeopathic medicine named "${product.name}" manufactured by "${product.company}".
        Return ONLY a raw JSON object (no markdown, no backticks) with the following exact keys:
        {
          "shortDescription": "A concise 4-5 word summary of what this product is specifically used for (e.g. 'For headache and fever', 'Liver tonic', 'Joint pain relief').",
          "description": "A short, professional e-commerce product description (3-4 sentences). Highlight uses, benefits, and natural remedy aspects.",
          "metaTitle": "SEO title for the product page (max 60 characters).",
          "metaDescription": "SEO meta description (max 160 characters).",
          "seoKeywords": ["keyword 1", "disease 1", "symptom 1", "homeopathy", "remedy"] // Array of 5-8 highly relevant search keywords
        }`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        let responseText = response.text;
        
        // Clean markdown if present
        if (responseText.startsWith('```json')) {
          responseText = responseText.replace(/```json\n/g, '').replace(/```/g, '').trim();
        } else if (responseText.startsWith('```')) {
          responseText = responseText.replace(/```\n/g, '').replace(/```/g, '').trim();
        }
        
        try {
          const seoData = JSON.parse(responseText);
          
          if (seoData.shortDescription) product.shortDescription = seoData.shortDescription;
          if (seoData.description) product.description = seoData.description;
          if (seoData.metaTitle) product.metaTitle = seoData.metaTitle;
          if (seoData.metaDescription) product.metaDescription = seoData.metaDescription;
          if (seoData.seoKeywords && Array.isArray(seoData.seoKeywords)) product.seoKeywords = seoData.seoKeywords;
          
          await product.save();
          console.log(`Saved SEO & description for ${product.name}`);
        } catch (parseError) {
          console.error(`Failed to parse JSON for ${product.name}:`, responseText);
        }
        
        // Delay to avoid hitting rate limits (especially on free tier)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (innerError) {
        console.error(`Failed to generate description for product ID ${id}:`, innerError.message);
        // Wait a bit longer if we hit a rate limit or 503 before continuing
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    console.log('Finished background AI generation task.');
  } catch (error) {
    console.error('Fatal error in background AI generation loop:', error.message);
  }
};

module.exports = {
  generateMissingDescriptions
};
