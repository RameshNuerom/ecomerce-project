// controllers/customer/profileController.js
const profileService = require('../../services/customer/profileService');

const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // User ID from authenticated request
    const profile = await profileService.getMyProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Only allow updating username, email, phoneNumber. Role and ID are not changeable via this route.
    const { username, email, phoneNumber } = req.body;
    const updatedProfile = await profileService.updateMyProfile(userId, { username, email, phoneNumber });
    res.status(200).json({ message: 'Profile updated successfully.', profile: updatedProfile });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};