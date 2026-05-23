const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

async function scrapeAndSeed() {
  await connectDB();
  
  try {
    console.log('Deleting old products...');
    await Product.deleteMany();

    const products = [];

    // 1. Scrape Reckeweg Homepage
    console.log('Fetching Reckeweg...');
    const recRes = await axios.get('https://www.reckeweg-india.com/');
    let $ = cheerio.load(recRes.data);
    
    // They usually have elements with class like product-item or similar. 
    // Let's just find images that look like products.
    $('img').each((i, el) => {
      let src = $(el).attr('src');
      let alt = $(el).attr('alt') || '';
      if (src && (src.includes('products') || src.includes('thumb'))) {
        let name = alt.trim() || src.split('/').pop().split('.')[0].replace(/-/g, ' ');
        if (name.length < 5) name = "Dr. Reckeweg Homeopathic Medicine " + i;
        
        // Capitalize Name
        name = name.charAt(0).toUpperCase() + name.slice(1);
        
        products.push({
          name: name.substring(0, 50),
          image: src.startsWith('http') ? src : 'https://www.reckeweg-india.com' + (src.startsWith('/') ? '' : '/') + src,
          description: `Authentic ${name} from Dr. Reckeweg Germany. Highly effective homeopathic remedy.`,
          company: 'Dr. Reckeweg',
          price: Math.floor(Math.random() * 150) + 100,
          stock: Math.floor(Math.random() * 50) + 10,
          potency: i % 2 === 0 ? '30C' : '200C',
          dilution: 'Liquid',
          motherTincture: false,
        });
      }
    });

    // 2. Scrape SBL
    // SBL's images might be scattered. Let's try to get them from a known structure or just use a few reliable ones
    // We will fetch a couple of SBL product pages or category pages
    console.log('Fetching SBL...');
    try {
      const sblUrls = [
        'https://sblglobal.com/',
        'https://sblglobal.in/' // Try .in as well
      ];
      
      for (let url of sblUrls) {
        try {
          const sblRes = await axios.get(url);
          let $sbl = cheerio.load(sblRes.data);
          
          $sbl('img').each((i, el) => {
            let src = $sbl(el).attr('src');
            let alt = $sbl(el).attr('alt') || '';
            if (src && (src.includes('product') || src.includes('upload') || src.includes('medicines'))) {
              let name = alt.trim() || src.split('/').pop().split('.')[0].replace(/-/g, ' ');
              if (name.length < 4 || name.includes('banner') || name.includes('logo')) return; // Skip non-products
              
              // Capitalize Name
              name = name.charAt(0).toUpperCase() + name.slice(1);
              
              products.push({
                name: name.substring(0, 50),
                image: src.startsWith('http') ? src : url + (src.startsWith('/') ? src.substring(1) : src),
                description: `Authentic ${name} manufactured by SBL Global. World class homeopathic remedy.`,
                company: 'SBL',
                price: Math.floor(Math.random() * 80) + 50,
                stock: Math.floor(Math.random() * 100) + 20,
                potency: i % 3 === 0 ? '6X' : '30C',
                dilution: 'Liquid',
                motherTincture: i % 4 === 0,
              });
            }
          });
        } catch(e) {}
      }
    } catch(e) {
      console.log('SBL fetch failed', e.message);
    }

    // Filter duplicates and invalid
    const uniqueProducts = [];
    const seenNames = new Set();
    
    for (let p of products) {
      if (!seenNames.has(p.name) && p.image.length > 10) {
        seenNames.add(p.name);
        uniqueProducts.push(p);
      }
    }

    console.log(`Inserting ${uniqueProducts.length} unique scraped products...`);
    if (uniqueProducts.length > 0) {
      await Product.insertMany(uniqueProducts);
    } else {
      console.log("No products found to insert.");
    }

    console.log('Done!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

scrapeAndSeed();
