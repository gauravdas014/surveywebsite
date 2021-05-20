const Algo = require('../models/algoModel');
const Cd = require('../models/cdModel');
const Cn = require('../models/cnModel');
const Dbms = require('../models/dbmsModel');
const Ds = require('../models/dsModel');
const Os = require('../models/osModel');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { subjectList } = require('../utils/subjects');

exports.getAllQuestions = async (req, res) => {
  try {
    const algoQs = await Algo.find();
    const CdQs = await Cd.find();
    const CnQs = await Cn.find();
    const DbmsQs = await Dbms.find();
    const DsQs = await Ds.find();
    const OsQs = await Os.find();

    const allQuestions = {
      algoQs,
      CdQs,
      CnQs,
      DbmsQs,
      DsQs,
      OsQs,
    };
    res.status(200).json({
      status: 'success',
      questions: allQuestions,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    // 2) Check if user exists
    const currentUser = await User.findById(decoded.id);

    const subj = req.body.subject;
    const Model = subjectList[subj];
    const newQuestion = await mongoose.model(Model).create({
      question: req.body.question,
      answer: req.body.answer,
      user: currentUser._id,
    });
    // return res.status(201).json({
    //   status: 'success',
    //   question: newQuestion,
    // });
    res.render('userQuestionSubmitted');
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.verifyQuestion = async (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
  } catch (err) {
    res.stauts(400).json({
      status: 'fail',
      message: err,
    });
  }
};
