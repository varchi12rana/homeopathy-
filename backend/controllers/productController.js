const Product = require('../models/Product');

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

    const category = req.query.category ? { category: req.query.category } : {};
    const company = req.query.company ? { company: req.query.company } : {};
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

module.exports = {
  getProducts,
  getProductById,
  getProductsByCompany,
  createProduct,
  updateProduct,
  deleteProduct,
};
