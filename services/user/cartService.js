// services/customer/cartService.js
const cartModel = require('../../models/cartModel');
const productModel = require('../../models/productModel'); // To check product/variant stock

const getOrCreateUserCart = async (userId) => {
  const cart = await cartModel.findOrCreateCart(userId);
  return cart;
};

const getUserCartWithDetails = async (userId) => {
  const cart = await cartModel.getCartByUserId(userId);
  return cart;
};

const addItemToCart = async (userId, productId, quantity, productVariantId = null) => {
  if (quantity <= 0) {
    const error = new Error('Quantity must be positive.');
    error.statusCode = 400;
    throw error;
  }

  // 1. Get product/variant details and check stock
  let product;
  let availableStock;

  if (productVariantId) {
    const variant = await productModel.getProductVariantById(productVariantId);
    if (!variant || variant.product_id !== parseInt(productId)) { // Ensure variant belongs to product
      const error = new Error('Product variant not found or does not belong to the product.');
      error.statusCode = 404;
      throw error;
    }
    product = await productModel.getProductById(productId); // Get base product details
    availableStock = variant.stock_quantity;
  } else {
    product = await productModel.getProductById(productId);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }
    // If no variant, ensure product has no variants
    const existingVariants = await productModel.getProductVariants(productId);
    if (existingVariants && existingVariants.length > 0) {
        const error = new Error('This product requires a variant to be selected.');
        error.statusCode = 400;
        throw error;
    }
    availableStock = product.stock_quantity;
  }

  if (quantity > availableStock) {
    const error = new Error(`Insufficient stock for ${product.name}${productVariantId ? ' (variant)' : ''}. Available: ${availableStock}`);
    error.statusCode = 400; // Bad Request
    throw error;
  }

  // 2. Get user's cart (or create if not exists)
  const userCart = await cartModel.findOrCreateCart(userId);

  // 3. Add or update item in cart
  const cartItem = await cartModel.addOrUpdateCartItem(userCart.id, productId, productVariantId, quantity);
  return cartItem;
};

const updateCartItemQuantity = async (userId, cartItemId, newQuantity) => {
  if (newQuantity <= 0) {
    const error = new Error('Quantity must be positive. To remove, use delete endpoint.');
    error.statusCode = 400;
    throw error;
  }

  // 1. Get cart item details
  const userCart = await cartModel.getCartByUserId(userId);
  if (!userCart) {
    const error = new Error('Cart not found for user.'); // Should not happen if findOrCreateCart is called first
    error.statusCode = 404;
    throw error;
  }

  const cartItem = userCart.items.find(item => item.cart_item_id === parseInt(cartItemId));

  if (!cartItem) {
    const error = new Error('Cart item not found in your cart.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Check stock for updated quantity
  let availableStock;
  if (cartItem.product_variant_id) {
    const variant = await productModel.getProductVariantById(cartItem.product_variant_id);
    availableStock = variant ? variant.stock_quantity : 0; // Use 0 if variant was deleted
  } else {
    const product = await productModel.getProductById(cartItem.product_id);
    availableStock = product ? product.stock_quantity : 0; // Use 0 if product was deleted
  }

  if (newQuantity > availableStock) {
    const error = new Error(`Insufficient stock for ${cartItem.product_name}${cartItem.attribute_name ? ` (${cartItem.attribute_value})` : ''}. Available: ${availableStock}`);
    error.statusCode = 400;
    throw error;
  }

  // 3. Update quantity in cart
  const updatedItem = await cartModel.updateCartItemQuantity(cartItemId, newQuantity);
  return updatedItem;
};

const removeCartItem = async (userId, cartItemId) => {
  const userCart = await cartModel.getCartByUserId(userId);
  if (!userCart) {
    const error = new Error('Cart not found for user.');
    error.statusCode = 404;
    throw error;
  }

  const cartItem = userCart.items.find(item => item.cart_item_id === parseInt(cartItemId));
  if (!cartItem) {
    const error = new Error('Cart item not found in your cart.');
    error.statusCode = 404;
    throw error;
  }

  const deletedItem = await cartModel.removeCartItem(cartItemId);
  return deletedItem;
};

const clearUserCart = async (userId) => {
  const userCart = await cartModel.getCartByUserId(userId);
  if (!userCart) {
    const error = new Error('Cart not found for user.');
    error.statusCode = 404;
    throw error;
  }
  await cartModel.clearCartItems(userCart.id);
  return { message: 'Cart cleared successfully.' };
};

module.exports = {
  getOrCreateUserCart, // useful for checking if a cart exists or getting its ID
  getUserCartWithDetails,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearUserCart,
};