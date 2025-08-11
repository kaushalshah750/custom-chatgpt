// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateUserProfile, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .patch(updateUserProfile);

module.exports = router;