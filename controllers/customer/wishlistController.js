// controllers/customer/wishlistController.js
const wishlistService = require('../../services/customer/wishlistService');

const addProductToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      const error = new Error('Product ID is required.');
      error.statusCode = 400;
      throw error;
    }

    const wishlistItem = await wishlistService.addProductToWishlist(userId, productId);
    res.status(201).json({ message: 'Product added to wishlist successfully.', item: wishlistItem });
  } catch (error) {
    next(error);
  }
};

const getMyWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const wishlist = await wishlistService.getMyWishlist(userId);
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

const removeProductFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { wishlistId } = req.params; // ID of the wishlist item

    if (!wishlistId) {
        const error = new Error('Wishlist item ID is required.');
        error.statusCode = 400;
        throw error;
    }

    await wishlistService.removeProductFromWishlist(userId, wishlistId);
    res.status(200).json({ message: 'Product removed from wishlist successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProductToWishlist,
  getMyWishlist,
  removeProductFromWishlist,
};