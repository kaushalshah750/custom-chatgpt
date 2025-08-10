// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, getLogs } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Note: All admin routes should be protected.
// For a production app, you would add an additional `isAdmin` middleware
// to ensure only authorized admins can access these endpoints.
router.use(protect);

router.get('/users', getUsers);
router.get('/logs', getLogs);

module.exports = router;