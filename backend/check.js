const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('sbl.html', 'utf-8');
const $ = cheerio.load(html);
const links = [];
$('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('product')) links.push(href);
});
console.log([...new Set(links)]);
