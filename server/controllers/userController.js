// server/controllers/userController.js
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  // req.user is already populated by the `protect` middleware
  res.json(req.user);
};

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.displayName = req.body.displayName ?? user.displayName;
    user.customInstructions = req.body.customInstructions ?? user.customInstructions;
    user.enableCustomInstructions = req.body.enableCustomInstructions ?? user.enableCustomInstructions;
    
    // Also allow updating optional API key from here
    if (req.body.apiKey) {
      user.apiKey = req.body.apiKey;
    }

    const updatedUser = await user.save();
    
    // Send back the updated user object, excluding the password
    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      apiKey: updatedUser.apiKey,
      displayName: updatedUser.displayName,
      customInstructions: updatedUser.customInstructions,
      enableCustomInstructions: updatedUser.enableCustomInstructions,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};