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

router
  .route('/all')
  .get(authController.isLoggedIn, questionController.getQuestionBySubject);

router
  .route('/edit/:subject/:questionId')
  .get(authController.isLoggedIn, questionController.getUpdateQuestion);

router
  .route('/edit/:subject/:questionId')
  .post(authController.isLoggedIn, questionController.updateQuestion);

router
  .route('/verify/:subject/:questionId')
  .post(authController.isLoggedIn, questionController.changeVerificationStatus);

module.exports = router;
