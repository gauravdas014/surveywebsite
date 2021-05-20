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
const { subjectList, subjectFullForm } = require('../utils/subjects');
const e = require('express');

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

exports.getQuestionBySubject = async (req, res) => {
  try {
    const subj = req.query.subject;
    const Model = subjectList[subj];
    const questions = await mongoose.model(Model).find();
    res.render('adminAllQuestions', {
      questions,
      subject: subj,
      subjectFullForm,
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

exports.getUpdateQuestion = async (req, res) => {
  try {
    const subj = req.params.subject;
    const Model = subjectList[subj];
    const question = await mongoose
      .model(Model)
      .findById(req.params.questionId);
    console.log(question);
    res.render('adminEditQuestion', { question, subject: subj });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const subj = req.params.subject;
    const Model = subjectList[subj];
    await mongoose
      .model(Model)
      .findByIdAndUpdate(req.params.questionId, req.body);
    const questions = await mongoose.model(Model).find();
    res.render('adminAllQuestions', {
      questions,
      subject: subj,
      subjectFullForm,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.changeVerificationStatus = async (req, res) => {
  try {
    const subj = req.params.subject;
    const Model = subjectList[subj];
    const questions = await mongoose.model(Model).find();
    const question = await mongoose
      .model(Model)
      .findById(req.params.questionId);
    if (question.isVerified) {
      question.isVerified = false;
      await question.save();
    } else {
      question.isVerified = true;
      await question.save();
    }
    res.render('adminAllQuestions', {
      questions,
      subject: subj,
      subjectFullForm,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
