const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCompany,
  getUniqueCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductsBulk,
  deleteProductsBulk,
  deleteCategory,
  getAlphabetPage,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/alphabet-page').get(getAlphabetPage);
router.route('/categories/unique').get(getUniqueCategories);
router.route('/categories/:categoryName').delete(protect, admin, deleteCategory);
router.route('/bulk').post(protect, admin, createProductsBulk);
router.route('/bulk-delete').post(protect, admin, deleteProductsBulk);
router.route('/company/:companyName').get(protect, admin, getProductsByCompany);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
