// server/routes/folderRoutes.js
const express = require('express');
const router = express.Router();
const { createFolder } = require('../controllers/folderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createFolder);

module.exports = router;