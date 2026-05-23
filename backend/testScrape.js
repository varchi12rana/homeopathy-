const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
  try {
    // SBL Mother Tinctures
    let sblRes = await axios.get('https://sblglobal.com/category/mother-tinctures');
    let $ = cheerio.load(sblRes.data);
    let sblProducts = [];
    $('.product-item, .product-card, img').each((i, el) => {
      let src = $(el).attr('src') || $(el).find('img').attr('src');
      let alt = $(el).attr('alt') || $(el).find('img').attr('alt') || $(el).text().trim();
      if (src && (src.includes('upload') || src.includes('product'))) {
        sblProducts.push({ name: alt.split('\n')[0].trim().substring(0, 30), image: src });
      }
    });
    console.log('SBL Products found:', sblProducts.filter(p => p.image).slice(0, 5));

    // Reckeweg products
    let recRes = await axios.get('https://www.reckeweg-india.com/products.php'); // or just homepage
    $ = cheerio.load(recRes.data);
    let recProducts = [];
    $('.product-box, img').each((i, el) => {
      let src = $(el).attr('src') || $(el).find('img').attr('src');
      let alt = $(el).attr('alt') || $(el).find('img').attr('alt') || $(el).text().trim();
      if (src && (src.includes('thumb') || src.includes('product'))) {
        recProducts.push({ name: alt.substring(0, 30), image: src.startsWith('http') ? src : 'https://www.reckeweg-india.com' + src });
      }
    });
    console.log('Reckeweg Products found:', recProducts.filter(p => p.image).slice(0, 5));
  } catch (error) {
    console.error('Scraping error:', error.message);
  }
}
testScrape();
