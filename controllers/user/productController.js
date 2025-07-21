// controllers/admin/productController.js
const productService = require('../../services/admin/productService');

// --- Product Controllers ---
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;
    const product = await productService.createProduct(name, description, price, stock_quantity, category_id, image_url);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductDetails(id); // Details include variants
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;
    const updatedProduct = await productService.updateProduct(id, name, description, price, stock_quantity, category_id, image_url);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// --- Product Variant Controllers ---
const createProductVariant = async (req, res, next) => {
  try {
    const { productId } = req.params; // Get product ID from URL params
    const { attribute_name, attribute_value, additional_price, stock_quantity } = req.body;
    const variant = await productService.createProductVariant(productId, attribute_name, attribute_value, additional_price, stock_quantity);
    res.status(201).json(variant);
  } catch (error) {
    next(error);
  }
};

const updateProductVariant = async (req, res, next) => {
  try {
    const { variantId } = req.params; // Get variant ID from URL params
    const { attribute_name, attribute_value, additional_price, stock_quantity } = req.body;
    const updatedVariant = await productService.updateProductVariant(variantId, attribute_name, attribute_value, additional_price, stock_quantity);
    res.status(200).json(updatedVariant);
  } catch (error) {
    next(error);
  }
};

const deleteProductVariant = async (req, res, next) => {
  try {
    const { variantId } = req.params; // Get variant ID from URL params
    const deletedVariant = await productService.deleteProductVariant(variantId);
    if (!deletedVariant) {
      return res.status(404).json({ message: 'Product variant not found.' });
    }
    res.status(200).json({ message: 'Product variant deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
};