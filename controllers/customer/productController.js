// controllers/customer/productController.js
const productService = require('../../services/admin/productService'); // Reusing the service layer
// As with categories, reusing 'get' methods for products is efficient for public viewing.

const getProducts = async (req, res, next) => {
  try {
    // Implement filtering/searching/pagination logic here if needed
    // For now, it will fetch all products as implemented in productService.getProducts
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductDetails(id); // Gets product and its variants
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// You might add search/filter product methods here in the future:
// const searchProducts = async (req, res, next) => { /* ... */ };
// const getProductsByCategory = async (req, res, next) => { /* ... */ };


module.exports = {
  getProducts,
  getProductById,
};