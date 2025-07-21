// services/public/productService.js
const productModel = require('../../models/productModel');
const categoryModel = require('../../models/categoryModel');
const reviewModel = require('../../models/reviewModel'); // Import reviewModel

const getProductById = async (productId) => {
  const product = await productModel.getProductById(productId);
  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  // Get product variants
  const variants = await productModel.getProductVariantsByProductId(productId);
  product.variants = variants;

  // Get reviews for this product
  product.reviews = await reviewModel.getReviewsByProductId(productId); // Fetch all detailed reviews
  const { average_rating, review_count } = await reviewModel.getAverageRatingAndCount(productId);
  product.average_rating = parseFloat(average_rating);
  product.review_count = parseInt(review_count);


  return product;
};

const getProducts = async (categoryId = null, searchTerm = null) => {
  let products;
  if (categoryId) {
    products = await productModel.getProductsByCategoryId(categoryId);
  } else if (searchTerm) {
      // Basic search by product name for now
      products = await productModel.searchProductsByName(searchTerm);
  }
  else {
    products = await productModel.getAllProducts();
  }

  // For each product, fetch its variants and review summary
  for (const product of products) {
    product.variants = await productModel.getProductVariantsByProductId(product.id);
    const { average_rating, review_count } = await reviewModel.getAverageRatingAndCount(product.id);
    product.average_rating = parseFloat(average_rating);
    product.review_count = parseInt(review_count);
  }

  return products;
};

// ... (existing exports)

module.exports = {
  getProductById,
  getProducts,
  // ... existing exports
};