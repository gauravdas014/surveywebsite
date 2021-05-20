const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/user/dashboard', (req, res) => {
  res.render('userDashboard');
});

router.get('/admin/dashboard', (req, res) => {
  res.render('adminDashboard');
});

module.exports = router;
