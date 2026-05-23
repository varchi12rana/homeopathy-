const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('sbl.html', 'utf-8');
const $ = cheerio.load(html);
const link = $('a[href^=\"/product/\"]').first();
console.log(link.parent().html());
