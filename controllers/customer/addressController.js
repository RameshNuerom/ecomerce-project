// controllers/customer/addressController.js
const addressService = require('../../services/customer/addressService');

const addAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressData = req.body; // Expects address_line1, city, state, postal_code, country, etc.

    // Basic validation
    if (!addressData.address_line1 || !addressData.city || !addressData.state || !addressData.postal_code) {
      const error = new Error('Address Line 1, City, State, and Postal Code are required.');
      error.statusCode = 400;
      throw error;
    }

    const newAddress = await addressService.addAddress(userId, addressData);
    res.status(201).json({ message: 'Address added successfully.', address: newAddress });
  } catch (error) {
    next(error);
  }
};

const getMyAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addresses = await addressService.getAddresses(userId);
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

const getMyAddressById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const address = await addressService.getAddressById(userId, addressId);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

const updateMyAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const addressData = req.body; // Can contain partial updates

    const updatedAddress = await addressService.updateAddress(userId, addressId, addressData);
    res.status(200).json({ message: 'Address updated successfully.', address: updatedAddress });
  } catch (error) {
    next(error);
  }
};

const deleteMyAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    await addressService.deleteAddress(userId, addressId);
    res.status(200).json({ message: 'Address deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAddress,
  getMyAddresses,
  getMyAddressById,
  updateMyAddress,
  deleteMyAddress,
};