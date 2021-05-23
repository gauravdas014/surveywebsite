const express = require('express');
const authController = require('../controllers/authController');
const questionController = require('../controllers/questionController');
const adminController = require('../controllers/adminController');
const router = express.Router();

router
  .route('/dashboard/:subject')
  .get(
    authController.isLoggedIn,
    questionController.dashboardAdminWithASelectedSub
  );

router.route('/profile/:userId').post(adminController.updateProfile);

router.route('/profile/password/:userId').post(adminController.updatePassword);

module.exports = router;
