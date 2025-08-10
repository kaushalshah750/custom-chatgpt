// server/controllers/folderController.js
const Folder = require('../models/Folder');

// @desc    Create a new folder
// @route   POST /api/folders
// @access  Private
exports.createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Folder name is required' });
        }
        const newFolder = new Folder({
            name,
            userId: req.user._id
        });
        await newFolder.save();
        res.status(201).json(newFolder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};