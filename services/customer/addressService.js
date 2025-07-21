// services/customer/addressService.js
const userAddressModel = require('../../models/userAddressModel');

const addAddress = async (userId, addressData) => {
  const { is_default } = addressData;

  // If this new address is set as default, unset other defaults
  if (is_default) {
    await userAddressModel.unsetOtherDefaultAddresses(userId, 0); // 0 as excludeId because it's a new address
  } else {
    // If no addresses exist, make this the default regardless of `is_default` flag
    const hasAddresses = await userAddressModel.hasUserAddresses(userId);
    if (!hasAddresses) {
      addressData.is_default = true;
    }
  }

  const newAddress = await userAddressModel.createUserAddress(userId, addressData);
  return newAddress;
};

const getAddresses = async (userId) => {
  const addresses = await userAddressModel.getUserAddresses(userId);
  return addresses;
};

const getAddressById = async (userId, addressId) => {
  const address = await userAddressModel.getUserAddressById(addressId);
  if (!address || address.user_id !== parseInt(userId)) {
    const error = new Error('Address not found or does not belong to the user.');
    error.statusCode = 404;
    throw error;
  }
  return address;
};

const updateAddress = async (userId, addressId, addressData) => {
  const existingAddress = await userAddressModel.getUserAddressById(addressId);
  if (!existingAddress || existingAddress.user_id !== parseInt(userId)) {
    const error = new Error('Address not found or does not belong to the user.');
    error.statusCode = 404;
    throw error;
  }

  // If setting this address as default, unset others
  if (addressData.is_default) {
    await userAddressModel.unsetOtherDefaultAddresses(userId, addressId);
  } else {
    // If this was the only default address and it's being unset, consider how to handle (e.g., prevent or assign new default)
    // For simplicity, we'll allow it to be unset. If the user clears all defaults, no address will be default.
    // A more complex system might automatically set the oldest/newest address as default.
  }

  const updatedAddress = await userAddressModel.updateUserAddress(addressId, addressData);
  return updatedAddress;
};

const deleteAddress = async (userId, addressId) => {
  const existingAddress = await userAddressModel.getUserAddressById(addressId);
  if (!existingAddress || existingAddress.user_id !== parseInt(userId)) {
    const error = new Error('Address not found or does not belong to the user.');
    error.statusCode = 404;
    throw error;
  }

  // If the address being deleted is the default, consider reassigning default to another address
  // For simplicity, we'll just delete it. If no default exists, user chooses one during checkout.
  const deletedAddress = await userAddressModel.deleteUserAddress(addressId);
  return deletedAddress;
};

module.exports = {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};