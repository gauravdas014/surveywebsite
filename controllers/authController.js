const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
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
    req.flash('message', 'Logged in sucessfully');
    res.redirect('/user/dashboard');
  } else {
    req.flash('message', 'Logged in sucessfully');
    res.redirect('/admin/dashboard');
  }
};

exports.signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      req.flash(
        'message',
        'There exists a user with the entered email ID, Please use another email'
      );
      return res.redirect('/signup');
    }

    if (req.body.password !== req.body.passwordConfirm) {
      req.flash('message', 'Passwords must match');
      return res.redirect('/signup');
    }

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
    req.flash('message', 'Successfully signed up');
    res.redirect('/login');
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (
      !user ||
      !(await user.correctPassword(req.body.password, user.password))
    ) {
      req.flash('message', 'Wrong username or password');
      return res.render('index', {
        flashMessages: { message: req.flash('message') },
      });
    }
    createSendToken(user, req, res);
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.redirect('/');
      }
      req.user = currentUser;
      return next();
    } catch (err) {
      return res.redirect('/login');
    }
  }
  res.redirect('/');
};

exports.signout = async (req, res) => {
  try {
    res.clearCookie('jwt');
    req.flash('message', '');
    res.redirect('/');
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
