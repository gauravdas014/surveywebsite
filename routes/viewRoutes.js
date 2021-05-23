const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { flashMessages: { message: req.flash('message') } });
});

router.get('/login', (req, res) => {
  res.render('index', { flashMessages: { message: req.flash('message') } });
});

router.get('/signup', (req, res) => {
  res.render('signup', { flashMessages: { message: req.flash('message') } });
});

router.get('/user/dashboard', authController.isLoggedIn, (req, res) => {
  const user = req.user;
  res.render('userDashboard', {
    user,
    subject: '',
    flashMessages: { message: req.flash('message') },
  });
});

router.get('/admin/dashboard', authController.isLoggedIn, (req, res) => {
  const user = req.user;
  res.render('adminDashboard', {
    user,
    subject: '',
    flashMessages: { message: req.flash('message') },
  });
});

router.get('/user/profile', authController.isLoggedIn, (req, res) => {
  const user = req.user;
  res.render('userUpdateProfile', { user });
});

router.get('/admin/profile', authController.isLoggedIn, (req, res) => {
  const user = req.user;
  res.render('adminUpdateProfile', { user });
});

router.get('/user/questions/subject', authController.isLoggedIn, (req, res) => {
  const user = req.user;
  res.render('userSelectSubject', {
    subject: '',
    flashMessages: { message: req.flash('message') },
    user,
  });
});

router.get(
  '/user/question/subject/:subject',
  authController.isLoggedIn,
  (req, res) => {
    const user = req.user;
    const subject = req.params.subject;
    res.render('userSelectSubject', {
      subject: subject,
      flashMessages: { message: req.flash('message') },
      user,
    });
  }
);

module.exports = router;
