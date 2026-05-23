const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const START_URL = 'https://sblglobal.com/products/homoeopathic/dilutions-lm-potencies/lm-potency-dilutions';
const CATEGORY = 'LM Potency Dilutions';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeSBL() {
    console.log('Starting scraper...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 800 });
    
    let productLinks = new Set();
    let hasNextPage = true;
    let currentPage = 1;

    console.log('Collecting product links...');
    
    try {
        await page.goto(START_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        await delay(3000);
        
        let previousHeight = 0;
        let attempts = 0;

        // The site likely uses infinite scroll or just lists all items if it's SPA
        // Let's scroll down to load all products
        while (attempts < 10) {
            const currentHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await delay(2000);
            const newHeight = await page.evaluate('document.body.scrollHeight');
            if (newHeight === currentHeight) {
                attempts++;
            } else {
                attempts = 0;
            }
        }

        // Extract all product links
        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a[href^="/product/"]'));
            return anchors.map(a => a.href).filter(h => h);
        });

        links.forEach(link => productLinks.add(link));
        console.log(`Found ${productLinks.size} unique product links on the listing page.`);
    } catch (error) {
        console.error(`Error loading start page: ${error.message}`);
    }

    const uniqueLinks = Array.from(productLinks);
    console.log(`Finished collecting links. Total unique products to scrape: ${uniqueLinks.length}`);

    const products = [];

    for (let i = 0; i < uniqueLinks.length; i++) {
        const url = uniqueLinks[i];
        console.log(`[${i + 1}/${uniqueLinks.length}] Scraping: ${url}`);
        
        let retries = 3;
        let success = false;
        
        while (retries > 0 && !success) {
            try {
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                await delay(1500);
                
                const productData = await page.evaluate(() => {
                    const nameEl = document.querySelector('h3, h1, .product-title, .title');
                    const name = nameEl ? nameEl.innerText.trim() : document.title.split('-')[0].trim();

                    const priceEl = document.querySelector('.price, h4, .product-price');
                    const priceText = priceEl ? priceEl.innerText.trim() : '';
                    const priceMatch = priceText.match(/[\d,.]+/);
                    const price = priceMatch ? priceMatch[0] : priceText;

                    let image = '';
                    const imgEl = document.querySelector('img.main-image, img.product-img, img.card-img, .product-gallery img');
                    if (imgEl) {
                        image = imgEl.src;
                    } else {
                        // Fallback: any image containing product name or just the first large image
                        const imgs = Array.from(document.querySelectorAll('img'));
                        for (const img of imgs) {
                            if (img.src.includes('product') || img.src.includes('upload')) {
                                image = img.src;
                                break;
                            }
                        }
                    }

                    const descEl = document.querySelector('.description, .product-desc, p');
                    const description = descEl ? descEl.innerText.trim() : '';

                    const sku = ''; // Default as many sites don't show SKU
                    const availability = 'In Stock'; // Default

                    return { name, price, image, description, sku, availability };
                });

                productData.url = url;
                productData.category = CATEGORY;

                if (productData.name && productData.image) {
                    products.push(productData);
                    success = true;
                } else {
                    console.log(`Validation failed for ${url} (Missing name or image). Retrying...`);
                    retries--;
                    await delay(2000);
                }

            } catch (error) {
                console.error(`Error scraping ${url}: ${error.message}. Retries left: ${retries - 1}`);
                retries--;
                await delay(3000);
            }
        }
    }

    await browser.close();

    console.log(`Scraping complete. Successfully scraped ${products.length} products.`);

    const uniqueProducts = [];
    const seenNames = new Set();
    const seenUrls = new Set();

    for (const p of products) {
        if (!seenNames.has(p.name) && !seenUrls.has(p.url)) {
            uniqueProducts.push(p);
            seenNames.add(p.name);
            seenUrls.add(p.url);
        }
    }

    const jsonPath = path.join(__dirname, 'scraped_products.json');
    fs.writeFileSync(jsonPath, JSON.stringify(uniqueProducts, null, 2));
    console.log(`Saved JSON to ${jsonPath}`);

    const csvPath = path.join(__dirname, 'scraped_products.csv');
    const csvHeader = ['Name', 'Price', 'Image_URL', 'Product_URL', 'SKU', 'Description', 'Category', 'Availability'].join(',');
    const csvRows = uniqueProducts.map(p => {
        return [
            `"${(p.name || '').replace(/"/g, '""')}"`,
            `"${(p.price || '').replace(/"/g, '""')}"`,
            `"${(p.image || '').replace(/"/g, '""')}"`,
            `"${(p.url || '').replace(/"/g, '""')}"`,
            `"${(p.sku || '').replace(/"/g, '""')}"`,
            `"${(p.description || '').replace(/"/g, '""')}"`,
            `"${(p.category || '').replace(/"/g, '""')}"`,
            `"${(p.availability || '').replace(/"/g, '""')}"`
        ].join(',');
    });
    fs.writeFileSync(csvPath, [csvHeader, ...csvRows].join('\n'));
    console.log(`Saved CSV to ${csvPath}`);

}

scrapeSBL().catch(console.error);
