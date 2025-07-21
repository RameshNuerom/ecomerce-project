// controllers/customer/cartController.js
const cartService = require('../../services/customer/cartService');

const getUserCart = async (req, res, next) => {
  try {
    const userId = req.user.id; // User ID from authenticated request
    const cart = await cartService.getUserCartWithDetails(userId);
    res.status(200).json(cart || { message: 'Cart is empty or not found.', items: [] });
  } catch (error) {
    next(error);
  }
};

const addItemToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, productVariantId } = req.body; // productVariantId is optional
    const cartItem = await cartService.addItemToCart(userId, productId, quantity, productVariantId);
    res.status(200).json({ message: 'Item added/updated in cart successfully.', item: cartItem });
  } catch (error) {
    next(error);
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params; // ID of the specific cart_item
    const { quantity } = req.body;
    const updatedItem = await cartService.updateCartItemQuantity(userId, cartItemId, quantity);
    res.status(200).json({ message: 'Cart item quantity updated successfully.', item: updatedItem });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params; // ID of the specific cart_item
    await cartService.removeCartItem(userId, cartItemId);
    res.status(200).json({ message: 'Cart item removed successfully.' });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await cartService.clearUserCart(userId);
    res.status(200).json({ message: 'Cart cleared successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};