// server/controllers/adminController.js
const User = require('../models/User');
const Log = require('../models/Log');

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        // In a real app, you'd add middleware to check if req.user.isAdmin
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all API request logs (admin)
// @route   GET /api/admin/logs
// @access  Private/Admin
exports.getLogs = async (req, res) => {
    try {
        // Populate user info for better logging display
        const logs = await Log.find({}).populate('userId', 'email').sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};