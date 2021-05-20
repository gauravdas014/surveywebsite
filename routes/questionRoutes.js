const express = require('express');
const authController = require('../controllers/authController');
const questionController = require('../controllers/questionController');
const router = express.Router();

router
  .route('/')
  .get(authController.isLoggedIn, questionController.getAllQuestions);
router
  .route('/')
  .post(authController.isLoggedIn, questionController.addQuestion);

module.exports = router;
