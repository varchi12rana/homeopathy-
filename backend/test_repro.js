const mongoose = require('mongoose');
const Product = require('./models/Product');
const XLSX = require('xlsx');
const path = require('path');

mongoose.connect('mongodb://127.0.0.1:27017/homeo-ecommerce').then(async () => {
  await Product.deleteMany({}); // CLEAR ALL PRODUCTS

  const filePath = path.join(__dirname, '../frontend/public', 'RANAS PRODUCTS.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const products = XLSX.utils.sheet_to_json(sheet);

  const validProducts = [];
  const failedProducts = [];
  let lastSeenCompany = 'Unknown';
  let lastSeenCategory = 'Unknown';

  // Basic validation loop from productController.js
  for (let i = 0; i < products.length; i++) {
    const rawProduct = products[i];
    const p = {};
    
    // Normalize keys with fuzzy matching
    for (const key in rawProduct) {
      const normalizedKey = key.trim().toLowerCase();
      const val = rawProduct[key];
      const strValue = val ? String(val).trim() : '';

      if (strValue.startsWith('http') || strValue.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
        p.image = strValue;
        continue; 
      }

      if (normalizedKey.includes('name') || normalizedKey.includes('title') || normalizedKey === 'product') p.name = val;
      else if (normalizedKey.includes('short desc') || normalizedKey.includes('main point') || normalizedKey.includes('uses')) p.shortDescription = val;
      else if (normalizedKey.includes('desc') || normalizedKey.includes('detail')) p.description = val;
      else if (normalizedKey.includes('price') || normalizedKey.includes('mrp') || normalizedKey.includes('cost') || normalizedKey.includes('rate')) p.price = val;
      else if (normalizedKey.includes('potency')) p.potency = val;
      else if (normalizedKey.includes('dilution') || normalizedKey.includes('ml') || normalizedKey.includes('size')) p.dilution = val;
      else if (normalizedKey.includes('mother') && normalizedKey.includes('tincture')) p.motherTincture = val;
      else if (normalizedKey.includes('company') || normalizedKey.includes('brand') || normalizedKey.includes('mfg')) p.company = val;
      else if (normalizedKey.includes('stock') || normalizedKey.includes('qty')) p.stock = val;
      else if (normalizedKey.includes('image') || normalizedKey.includes('pic') || normalizedKey.includes('url')) p.image = val;
      else if (normalizedKey.includes('category') || normalizedKey.includes('type')) p.category = val;
      else if (normalizedKey.includes('bestseller') || normalizedKey.includes('best seller')) p.isBestSeller = val;
    }

    if (p.company && String(p.company).trim() !== '') {
      lastSeenCompany = p.company;
    } else {
      p.company = lastSeenCompany;
    }

    if (p.category && String(p.category).trim() !== '') {
      lastSeenCategory = p.category;
    } else {
      p.category = lastSeenCategory;
    }

    if (!p.description || String(p.description).trim() === '') {
      p.description = 'No description available.';
    }

    if (p.price !== undefined && p.price !== null) {
      const cleanedPrice = String(p.price).replace(/[^0-9.]/g, '');
      p.price = cleanedPrice ? Number(cleanedPrice) : 0;
    } else {
      p.price = 0;
    }
    
    if (p.stock !== undefined && p.stock !== null) {
      const cleanedStock = String(p.stock).replace(/[^0-9]/g, '');
      p.stock = cleanedStock ? Number(cleanedStock) : 0;
    } else {
      p.stock = 0;
    }
    
    p.image = p.image || 'https://via.placeholder.com/300?text=No+Image';

    if (!p.name || !p.description || p.price === undefined || !p.company || p.stock === undefined || !p.image) {
      failedProducts.push({ index: i, product: p, reason: 'Missing required fields' });
    } else {
      validProducts.push(p);
    }
  }

  console.log(`Valid: ${validProducts.length}, Failed: ${failedProducts.length}`);

  let insertedCount = 0;
  let modifiedCount = 0;
  let unchangedCount = 0;

  if (validProducts.length > 0) {
    try {
      const bulkOps = validProducts.map(p => {
        const filter = { name: p.name, company: p.company };
        if (p.potency) filter.potency = p.potency;
        if (p.dilution) filter.dilution = p.dilution;
        
        const updateFields = { ...p };
        const setOnInsertFields = {};
        
        if (updateFields.description === 'No description available.') {
          setOnInsertFields.description = updateFields.description;
          delete updateFields.description;
        }
        
        if (updateFields.image === 'https://via.placeholder.com/300?text=No+Image') {
          setOnInsertFields.image = updateFields.image;
          delete updateFields.image;
        }

        return {
          updateOne: {
            filter,
            update: {
              $set: updateFields,
              ...(Object.keys(setOnInsertFields).length > 0 && { $setOnInsert: setOnInsertFields })
            },
            upsert: true
          }
        };
      });

      const result = await Product.bulkWrite(bulkOps, { ordered: false });
      
      console.log('BulkWrite Success Result:');
      console.log(JSON.stringify(result, null, 2));
      
    } catch (insertError) {
      console.log('BulkWrite Error caught:', insertError.message);
      if (insertError.name === 'BulkWriteError') {
         console.log('BulkWriteError Result:', JSON.stringify(insertError.result, null, 2));
         if (insertError.writeErrors) {
           console.log('Write errors count:', insertError.writeErrors.length);
         }
      }
    }
  }
  process.exit(0);
});
