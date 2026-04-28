const Product = require('../models/Product');
const Company = require('../models/Company');

const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category 
      ? { category: { $regex: new RegExp('^' + req.query.category + '$', 'i') } } 
      : {};
      
    const company = req.query.company 
      ? { company: { $regex: new RegExp('^' + req.query.company + '$', 'i') } } 
      : {};
      
    const isBestSeller = req.query.isBestSeller === 'true' ? { isBestSeller: true } : {};

    const products = await Product.find({ ...keyword, ...category, ...company, ...isBestSeller });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductsByCompany = async (req, res) => {
  try {
    const products = await Product.find({ company: req.params.companyName });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      company: req.body.company,
      potency: req.body.potency,
      dilution: req.body.dilution,
      motherTincture: req.body.motherTincture || false,
      stock: req.body.stock,
      category: req.body.category,
      isBestSeller: req.body.isBestSeller || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, company, potency, dilution, motherTincture, stock, category, isBestSeller } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.company = company || product.company;
      product.potency = potency || product.potency;
      product.dilution = dilution || product.dilution;
      product.motherTincture = motherTincture !== undefined ? motherTincture : product.motherTincture;
      product.stock = stock !== undefined ? stock : product.stock;
      product.category = category || product.category;
      product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProductsBulk = async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided for bulk insert.' });
    }

    const validProducts = [];
    const failedProducts = [];
    let lastSeenCompany = 'Unknown';
    let lastSeenCategory = 'Unknown';
    let lastSeenName = 'Unnamed Product';
    let lastSeenDescription = 'No description available.';

    // Basic validation loop
    for (let i = 0; i < products.length; i++) {
      const rawProduct = products[i];
      const p = {};
      
      // Normalize keys with fuzzy matching
      for (const key in rawProduct) {
        const normalizedKey = key.trim().toLowerCase();
        const val = rawProduct[key];
        const strValue = val ? String(val).trim() : '';

        // Value-based sniffing for Image URLs
        // If the value itself is clearly a link or image file, force it as the image
        if (strValue.startsWith('http') || strValue.startsWith('www') || strValue.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
          p.image = strValue;
          continue; 
        }

        if (normalizedKey.includes('name') || normalizedKey.includes('title')) p.name = val;
        else if (normalizedKey.includes('desc') || normalizedKey.includes('detail')) p.description = val;
        else if (normalizedKey.includes('price') || normalizedKey.includes('mrp') || normalizedKey.includes('cost') || normalizedKey.includes('rate') || normalizedKey.includes('amount') || normalizedKey.includes('rs')) p.price = val;
        else if (normalizedKey.includes('potency')) p.potency = val;
        else if (normalizedKey.includes('dilution') || normalizedKey.includes('ml') || normalizedKey.includes('size') || normalizedKey.includes('vol')) p.dilution = val;
        else if (normalizedKey.includes('mother') && normalizedKey.includes('tincture')) p.motherTincture = val;
        else if (normalizedKey.includes('company') || normalizedKey.includes('brand') || normalizedKey.includes('manufacturer') || normalizedKey.includes('mfg')) p.company = val;
        else if (normalizedKey.includes('stock') || normalizedKey.includes('qty') || normalizedKey.includes('quantity')) p.stock = val;
        else if (normalizedKey.includes('image') || normalizedKey.includes('pic') || normalizedKey.includes('photo') || normalizedKey.includes('url') || normalizedKey.includes('link')) p.image = val;
        else if (normalizedKey.includes('category') || normalizedKey.includes('type') || normalizedKey.includes('group')) p.category = val;
        else if (normalizedKey.includes('bestseller') || normalizedKey.includes('best seller')) p.isBestSeller = val;
      }

      // Carry-over logic for merged/blank cells in Excel
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

      if (p.name && String(p.name).trim() !== '') {
        lastSeenName = p.name;
      } else {
        p.name = lastSeenName;
      }

      if (p.description && String(p.description).trim() !== '') {
        lastSeenDescription = p.description;
      } else {
        p.description = lastSeenDescription;
      }

      // Clean and parse price (remove ₹, $, etc.)
      if (p.price !== undefined && p.price !== null) {
        const cleanedPrice = String(p.price).replace(/[^0-9.]/g, '');
        p.price = cleanedPrice ? Number(cleanedPrice) : 0;
      } else {
        p.price = 0;
      }
      
      // Clean and parse stock
      if (p.stock !== undefined && p.stock !== null) {
        const cleanedStock = String(p.stock).replace(/[^0-9]/g, '');
        p.stock = cleanedStock ? Number(cleanedStock) : 0;
      } else {
        p.stock = 0;
      }
      
      p.image = p.image || 'https://via.placeholder.com/300?text=No+Image';

      // Check required fields based on Schema (should always pass now due to defaults)
      if (!p.name || !p.description || p.price === undefined || !p.company || p.stock === undefined || !p.image) {
        failedProducts.push({ index: i, product: p, reason: 'Missing required fields' });
      } else {
        validProducts.push(p);
      }
    }

    let insertedCount = 0;
    let modifiedCount = 0;
    let productsNeedingAI = [];
    
    if (validProducts.length > 0) {
      try {
        const bulkOps = validProducts.map(p => {
          const filter = { name: p.name, company: p.company };
          if (p.potency) filter.potency = p.potency;
          if (p.dilution) filter.dilution = p.dilution;
          
          return {
            updateOne: {
              filter,
              update: { $set: p },
              upsert: true
            }
          };
        });

        const result = await Product.bulkWrite(bulkOps, { ordered: false });
        insertedCount = result.upsertedCount || 0;
        modifiedCount = result.modifiedCount || 0;

        const upsertedIdsArray = Object.values(result.upsertedIds || {});
        if (upsertedIdsArray.length > 0) {
           const newProducts = await Product.find({ _id: { $in: upsertedIdsArray } });
           productsNeedingAI = newProducts.filter(p => p.description === 'No description available.').map(p => p._id);
        }
      } catch (insertError) {
        if (insertError.name === 'BulkWriteError') {
          insertedCount = insertError.result?.nUpserted || 0;
          modifiedCount = insertError.result?.nModified || 0;
          
          const upsertedIdsArray = insertError.result?.upserted ? insertError.result.upserted.map(x => x._id) : [];
          if (upsertedIdsArray.length > 0) {
             const newProducts = await Product.find({ _id: { $in: upsertedIdsArray } });
             productsNeedingAI = newProducts.filter(p => p.description === 'No description available.').map(p => p._id);
          }

          if (insertError.writeErrors) {
            insertError.writeErrors.forEach(err => {
              failedProducts.push({ index: 'Unknown', reason: err.errmsg });
            });
          }
        } else {
          throw insertError;
        }
      }

      // Auto-add new companies to the Company collection
      try {
        const uniqueCompanies = [...new Set(validProducts.map(p => p.company).filter(Boolean))];
        for (const companyName of uniqueCompanies) {
          // Case-insensitive upsert to avoid duplicates like "SBL" and "sbl"
          const existing = await Company.findOne({ name: { $regex: new RegExp(`^${companyName}$`, 'i') } });
          if (!existing) {
            await Company.create({ name: companyName });
          }
        }
      } catch (companyError) {
        console.error('Error auto-adding companies:', companyError);
      }
    }

    res.status(201).json({
      message: `Bulk sync complete. Added ${insertedCount} new products. Updated ${modifiedCount} existing products. Failed ${failedProducts.length}. AI will generate descriptions for ${productsNeedingAI.length} items.`,
      successCount: insertedCount + modifiedCount,
      insertedCount,
      modifiedCount,
      failedCount: failedProducts.length,
      failedProducts
    });

    // Trigger AI background job
    if (productsNeedingAI.length > 0) {
       const { generateMissingDescriptions } = require('../services/aiService');
       generateMissingDescriptions(productsNeedingAI);
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProductsBulk = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No product IDs provided' });
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} products removed` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCompany,
  createProduct,
  createProductsBulk,
  updateProduct,
  deleteProduct,
  deleteProductsBulk,
};
