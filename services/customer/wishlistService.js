// services/customer/wishlistService.js
const wishlistModel = require('../../models/wishlistModel');
const productModel = require('../../models/productModel'); // To check if product exists

const addProductToWishlist = async (userId, productId) => {
  // 1. Check if product exists
  const product = await productModel.getProductById(productId);
  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Try to add to wishlist. The model handles duplicates with ON CONFLICT DO NOTHING.
  const wishlistItem = await wishlistModel.addProductToWishlist(userId, productId);

  if (!wishlistItem) {
    const error = new Error('Product is already in your wishlist.');
    error.statusCode = 409; // Conflict
    throw error;
  }

  return wishlistItem;
};

const getMyWishlist = async (userId) => {
  const wishlist = await wishlistModel.getUserWishlist(userId);
  return wishlist;
};

const removeProductFromWishlist = async (userId, wishlistId) => {
  const removedItem = await wishlistModel.removeProductFromWishlist(wishlistId, userId);
  if (!removedItem) {
    const error = new Error('Wishlist item not found or does not belong to you.');
    error.statusCode = 404;
    throw error;
  }
  return removedItem;
};

module.exports = {
  addProductToWishlist,
  getMyWishlist,
  removeProductFromWishlist,
};