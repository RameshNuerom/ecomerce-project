// services/admin/productService.js
const productModel = require('../../models/productModel');
const categoryModel = require('../../models/categoryModel'); // To validate category ID

// --- Product Services ---
const createProduct = async (name, description, price, stockQuantity, categoryId, imageUrl) => {
  if (!name || !price || !stockQuantity || !categoryId) {
    const error = new Error('Product name, price, stock quantity, and category ID are required.');
    error.statusCode = 400;
    throw error;
  }
  if (price <= 0 || stockQuantity < 0) {
    const error = new Error('Price must be positive and stock quantity cannot be negative.');
    error.statusCode = 400;
    throw error;
  }

  // Ensure category exists
  const category = await categoryModel.getCategoryById(categoryId);
  if (!category) {
    const error = new Error('Category not found.');
    error.statusCode = 404;
    throw error;
  }

  const product = await productModel.createProduct(name, description, price, stockQuantity, categoryId, imageUrl);
  return product;
};

const getProducts = async () => {
  const products = await productModel.getAllProducts();
  return products;
};

const getProductDetails = async (id) => {
  const product = await productModel.getProductById(id);
  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }
  // Get variants for the product
  product.variants = await productModel.getProductVariants(id);
  return product;
};

const updateProduct = async (id, name, description, price, stockQuantity, categoryId, imageUrl) => {
  const existingProduct = await productModel.getProductById(id);
  if (!existingProduct) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  if (!name || !price || !stockQuantity || !categoryId) {
    const error = new Error('Product name, price, stock quantity, and category ID are required.');
    error.statusCode = 400;
    throw error;
  }
  if (price <= 0 || stockQuantity < 0) {
    const error = new Error('Price must be positive and stock quantity cannot be negative.');
    error.statusCode = 400;
    throw error;
  }

  // Ensure category exists
  const category = await categoryModel.getCategoryById(categoryId);
  if (!category) {
    const error = new Error('Category not found.');
    error.statusCode = 404;
    throw error;
  }

  const updatedProduct = await productModel.updateProduct(id, name, description, price, stockQuantity, categoryId, imageUrl);
  return updatedProduct;
};

const deleteProduct = async (id) => {
  const existingProduct = await productModel.getProductById(id);
  if (!existingProduct) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }
  const deletedProduct = await productModel.deleteProduct(id);
  return deletedProduct;
};

// --- Product Variant Services ---
const createProductVariant = async (productId, attributeName, attributeValue, additionalPrice, stockQuantity) => {
    // Validate if product exists
    const product = await productModel.getProductById(productId);
    if (!product) {
      const error = new Error('Product not found for this variant.');
      error.statusCode = 404;
      throw error;
    }

    if (!attributeName || !attributeValue || stockQuantity < 0) {
        const error = new Error('Variant attribute name, value, and stock quantity are required.');
        error.statusCode = 400;
        throw error;
    }
    if (additionalPrice < 0) {
      const error = new Error('Additional price cannot be negative.');
      error.statusCode = 400;
      throw error;
    }

    const variant = await productModel.createProductVariant(productId, attributeName, attributeValue, additionalPrice, stockQuantity);
    return variant;
};

const updateProductVariant = async (id, attributeName, attributeValue, additionalPrice, stockQuantity) => {
    const existingVariant = await productModel.getProductVariantById(id);
    if (!existingVariant) {
        const error = new Error('Product variant not found.');
        error.statusCode = 404;
        throw error;
    }

    if (!attributeName || !attributeValue || stockQuantity < 0) {
      const error = new Error('Variant attribute name, value, and stock quantity are required.');
      error.statusCode = 400;
      throw error;
    }
    if (additionalPrice < 0) {
      const error = new Error('Additional price cannot be negative.');
      error.statusCode = 400;
      throw error;
    }

    const updatedVariant = await productModel.updateProductVariant(id, attributeName, attributeValue, additionalPrice, stockQuantity);
    return updatedVariant;
};

const deleteProductVariant = async (id) => {
    const existingVariant = await productModel.getProductVariantById(id);
    if (!existingVariant) {
        const error = new Error('Product variant not found.');
        error.statusCode = 404;
        throw error;
    }
    const deletedVariant = await productModel.deleteProductVariant(id);
    return deletedVariant;
};


module.exports = {
  createProduct,
  getProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
}; 
