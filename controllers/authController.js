const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, req, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  });
  if (user.role === 'user') {
    res.redirect('/user/dashboard');
  } else {
    res.redirect('/admin/dashboard');
  }
};

exports.signup = async (req, res) => {
  try {
    // const user = await User.findOne({ email: req.body.email });
    // if (user) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     message: 'User already registered',
    //   });
    // }
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      role: req.body.role,
      password: req.body.password,
    });
    newUser.password = await bcrypt.hash(req.body.password, 12);
    await newUser.save();

    const token = signToken(newUser._id);

    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
    });
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    console.log(req.body.password);
    if (
      !user ||
      !(await user.correctPassword(req.body.password, user.password))
    ) {
      res.send('Username or password is incorrect');
    }
    createSendToken(user, req, res);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.isAuthenticated = async (req, res, next) => {
  try {
    //
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.signout = async (req, res) => {
  try {
    res.clearCookie('jwt');
    res.redirect('/');
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
