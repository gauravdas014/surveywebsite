const User = require('../models/userModel');
const bcrypt = require("bcryptjs")

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    });
    req.user = user;
    req.flash("message", "Profile details updated successfully")
    res.redirect('/user/dashboard');
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!(await user.correctPassword(req.body.password, user.password))) {
      res.send('Old password incorrect');
    }
    user.password = await bcrypt.hash(req.body.newPassword, 12);
    await user.save();
    req.user = user;
    req.flash("message", "Password Updated successfully")
    res.redirect('/user/dashboard');
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
