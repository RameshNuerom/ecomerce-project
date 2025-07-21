// services/customer/reviewService.js
const reviewModel = require('../../models/reviewModel');
const productModel = require('../../models/productModel'); // To check if product exists
const orderModel = require('../../models/orderModel'); // To check if user has purchased the product

const submitReview = async (userId, productId, rating, reviewText) => {
  // 1. Basic Validation for Rating
  if (rating < 1 || rating > 5) {
    const error = new Error('Rating must be between 1 and 5.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Check if product exists
  const product = await productModel.getProductById(productId);
  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  // 3. Optional: Check if user has purchased this product (common e-commerce rule)
  // This is a business rule you might want to enforce.
  // Implementation: Check if there's any order from this user that contains this product.
  const userOrders = await orderModel.getOrdersByUserId(userId);
  const hasPurchased = userOrders.some(order =>
    order.items.some(item => item.product_id === parseInt(productId))
  );

  if (!hasPurchased) {
    const error = new Error('You can only review products you have purchased.');
    error.statusCode = 403; // Forbidden
    throw error;
  }

  // 4. Check if user has already reviewed this product
  const existingReview = await reviewModel.getReviewByProductAndUser(productId, userId);

  if (existingReview) {
    // If a review exists, update it instead of creating a new one
    const updatedReview = await reviewModel.updateReview(existingReview.id, rating, reviewText);
    return { ...updatedReview, isNewReview: false }; // Indicate it was an update
  } else {
    // Otherwise, create a new review
    const newReview = await reviewModel.createReview(productId, userId, rating, reviewText);
    return { ...newReview, isNewReview: true }; // Indicate it was a new review
  }
};

const getMyReviews = async (userId) => {
  const reviews = await reviewModel.getReviewsByUserId(userId);
  return reviews;
};

const getMyReviewForProduct = async (userId, productId) => {
    const review = await reviewModel.getReviewByProductAndUser(productId, userId);
    if (!review || review.user_id !== parseInt(userId)) { // Double check ownership
        const error = new Error('Review not found or does not belong to you.');
        error.statusCode = 404;
        throw error;
    }
    return review;
}

const updateMyReview = async (userId, reviewId, rating, reviewText) => {
  const review = await reviewModel.getReviewById(reviewId);
  if (!review || review.user_id !== parseInt(userId)) {
    const error = new Error('Review not found or does not belong to you.');
    error.statusCode = 404;
    throw error;
  }

  // Basic Validation for Rating
  if (rating < 1 || rating > 5) {
    const error = new Error('Rating must be between 1 and 5.');
    error.statusCode = 400;
    throw error;
  }

  const updatedReview = await reviewModel.updateReview(reviewId, rating, reviewText);
  return updatedReview;
};

const deleteMyReview = async (userId, reviewId) => {
  const review = await reviewModel.getReviewById(reviewId);
  if (!review || review.user_id !== parseInt(userId)) {
    const error = new Error('Review not found or does not belong to you.');
    error.statusCode = 404;
    throw error;
  }

  const deletedReview = await reviewModel.deleteReview(reviewId);
  return deletedReview;
};

module.exports = {
  submitReview,
  getMyReviews,
  getMyReviewForProduct,
  updateMyReview,
  deleteMyReview,
};