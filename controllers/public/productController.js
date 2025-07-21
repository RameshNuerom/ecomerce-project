// controllers/public/productController.js
const publicProductService = require('../../services/public/productService');
const categoryModel = require('../../models/categoryModel'); // May need this for category validation if not done in service

// ... (other imports)

const getProducts = async (req, res, next) => {
  try {
    const { categoryId, searchTerm, minPrice, maxPrice, sortBy } = req.query; // Extract new query parameters

    // Optional: Basic validation for price and categoryId types
    const parsedCategoryId = categoryId ? parseInt(categoryId) : null;
    if (categoryId && isNaN(parsedCategoryId)) {
        const error = new Error('Invalid category ID.');
        error.statusCode = 400;
        throw error;
    }

    const parsedMinPrice = minPrice ? parseFloat(minPrice) : null;
    if (minPrice && isNaN(parsedMinPrice)) {
        const error = new Error('Invalid minimum price.');
        error.statusCode = 400;
        throw error;
    }

    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : null;
    if (maxPrice && isNaN(parsedMaxPrice)) {
        const error = new Error('Invalid maximum price.');
        error.statusCode = 400;
        throw error;
    }

    // Call the service with all parameters
    const products = await publicProductService.getProducts(
      parsedCategoryId,
      searchTerm,
      parsedMinPrice,
      parsedMaxPrice,
      sortBy
    );
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// ... (existing exports)

module.exports = {
  // ... (existing exports)
  getProducts,
};