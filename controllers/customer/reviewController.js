// controllers/customer/reviewController.js
const reviewService = require('../../services/customer/reviewService');

const submitProductReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, rating, reviewText } = req.body;

    if (!productId || !rating) {
      const error = new Error('Product ID and rating are required.');
      error.statusCode = 400;
      throw error;
    }

    const result = await reviewService.submitReview(userId, productId, rating, reviewText);
    if (result.isNewReview) {
      res.status(201).json({ message: 'Review submitted successfully.', review: result });
    } else {
      res.status(200).json({ message: 'Review updated successfully.', review: result });
    }
  } catch (error) {
    next(error);
  }
};

const getMyReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviews = await reviewService.getMyReviews(userId);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

const getMyReviewForProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const review = await reviewService.getMyReviewForProduct(userId, productId);
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
};

const updateMyReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    if (!rating) { // rating is always required for update
      const error = new Error('Rating is required for review update.');
      error.statusCode = 400;
      throw error;
    }

    const updatedReview = await reviewService.updateMyReview(userId, reviewId, rating, reviewText);
    res.status(200).json({ message: 'Review updated successfully.', review: updatedReview });
  } catch (error) {
    next(error);
  }
};

const deleteMyReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;
    await reviewService.deleteMyReview(userId, reviewId);
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitProductReview,
  getMyReviews,
  getMyReviewForProduct,
  updateMyReview,
  deleteMyReview,
};