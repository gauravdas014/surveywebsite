const express = require('express');
const authController = require('../controllers/authController');
const questionController = require("../controllers/questionController")
const userController = require('../controllers/userController');
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.signin);
router.route('/signout').get(authController.signout);

router.route("/dashboard/:subject").get(authController.isLoggedIn,questionController.dashboardWithASelectedSub)

router.route('/profile/:userId').post(userController.updateProfile);

router.route('/profile/password/:userId').post(userController.updatePassword);

module.exports = router;
