const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
  try {
    const res = await axios.get('https://sblglobal.com/products/homoeopathic/dilutions-lm-potencies/dilutions');
    console.log(`Status: ${res.status}`);
    const $ = cheerio.load(res.data);
    
    const products = [];
    
    // We don't know the exact class yet, so we look for common product container classes
    // or just inspect images
    $('img').each((i, el) => {
      let src = $(el).attr('src');
      let alt = $(el).attr('alt');
      if (src && (src.includes('product') || src.includes('upload'))) {
        products.push({ src, alt });
      }
    });
    
    console.log(`Found ${products.length} potential product images.`);
    if (products.length > 0) {
      console.log(products.slice(0, 5));
    } else {
      console.log('No images found matching criteria. Dumping first 1000 chars of body:');
      console.log($('body').text().substring(0, 1000));
    }
  } catch (err) {
    console.error('Error fetching:', err.message);
  }
}

testScrape();
