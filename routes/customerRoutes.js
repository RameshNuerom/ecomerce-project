// routes/customerRoutes.js
const express = require('express');
const { protect } = require('../middlewares/authMiddleware'); // isCustomer is not strictly needed for own profile
const cartController = require('../controllers/customer/cartController');
const orderController = require('../controllers/customer/orderController');
const profileController = require('../controllers/customer/profileController'); // Import profile controller
const addressController = require('../controllers/customer/addressController');
const reviewController = require('../controllers/customer/reviewController'); // Import review controller
const wishlistController = require('../controllers/customer/wishlistController'); // Import wishlist controller
const router = express.Router();

// All routes in this file require authentication (protect)
router.use(protect);

// --- Cart Routes ---
router.get('/cart', cartController.getUserCart);
router.post('/cart/items', cartController.addItemToCart);
router.put('/cart/items/:cartItemId', cartController.updateCartItemQuantity);
router.delete('/cart/items/:cartItemId', cartController.removeCartItem);
router.delete('/cart', cartController.clearCart);

// --- Order Routes ---
router.post('/orders', orderController.placeOrder);
router.get('/orders', orderController.getMyOrders);
router.get('/orders/:orderId', orderController.getMyOrderDetails);

// --- Profile Routes ---
router.get('/profile', profileController.getMyProfile);
router.put('/profile', profileController.updateMyProfile); // Update user's own profile

// --- Address Routes ---
router.post('/addresses', addressController.addAddress);
router.get('/addresses', addressController.getMyAddresses);
router.get('/addresses/:addressId', addressController.getMyAddressById);
router.put('/addresses/:addressId', addressController.updateMyAddress);
router.delete('/addresses/:addressId', addressController.deleteMyAddress);

// --- Product Review Routes (Customer) ---
router.post('/reviews', reviewController.submitProductReview); // Create or update a review
router.get('/reviews', reviewController.getMyReviews); // Get all reviews by the user
router.get('/reviews/product/:productId', reviewController.getMyReviewForProduct); // Get user's review for a specific product
router.put('/reviews/:reviewId', reviewController.updateMyReview); // Update a specific review
router.delete('/reviews/:reviewId', reviewController.deleteMyReview); // Delete a specific review

// --- Wishlist Routes (Customer) ---
router.post('/wishlist', wishlistController.addProductToWishlist); // Add a product to wishlist
router.get('/wishlist', wishlistController.getMyWishlist); // Get all products in wishlist
router.delete('/wishlist/:wishlistId', wishlistController.removeProductFromWishlist); // Remove a product from wishlist by wishlist item ID


module.exports = router;

module.exports = router;