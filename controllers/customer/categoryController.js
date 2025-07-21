// controllers/customer/categoryController.js
const categoryService = require('../../services/admin/categoryService'); // Reusing the service layer
// Note: You could create a separate 'customerService' if logic differs significantly,
// but for simple GET operations, reusing admin's 'get' methods is efficient.

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories(); // Calls service to get all categories
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryDetails(id); // Calls service to get single category
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
};