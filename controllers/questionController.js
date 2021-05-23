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
const pdf = require('html-pdf');
const ejs = require('ejs');
const path = require('path');

exports.printQuestions = async (req, res) => {
  const subj = req.params.subject;
  const Model = subjectList[subj];
  const questions = await mongoose
    .model(Model)
    .find()
    .sort({ isVerified: false });
  ejs
    .renderFile(path.resolve(__dirname + '/../views/adminAllQPrint.ejs'), {
      subject: subj,
      questions,
    })
    .then((data) => {
      const options = {
        format: 'Landscape',
        height: '20in',
        width: '20in',
      };
      const file = path.resolve(__dirname + `../questions.pdf`);
      pdf.create(data, options).toFile(file, (err, success) => {
        if (err) throw err;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=questions.pdf'
        );
        return res.download(file);
      });
    })
    .catch((message) => {
      console.log(message);
      return res.json({ success: false, msg: message });
    });
};

// exports.getAllQuestions = async (req, res) => {
//   try {
//     const algoQs = await Algo.find();
//     const CdQs = await Cd.find();
//     const CnQs = await Cn.find();
//     const DbmsQs = await Dbms.find();
//     const DsQs = await Ds.find();
//     const OsQs = await Os.find();

//     const allQuestions = {
//       algoQs,
//       CdQs,
//       CnQs,
//       DbmsQs,
//       DsQs,
//       OsQs,
//     };
//     res.status(200).json({
//       status: 'success',
//       questions: allQuestions,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.dashboardWithASelectedSub = async (req, res) => {
  try {
    const subj = req.params.subject;
    const user = req.user;
    req.flash('message', '');
    res.render('userDashboard', {
      user,
      subject: subj,
      flashMessages: { message: req.flash('message') },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.dashboardAdminWithASelectedSub = async (req, res) => {
  try {
    const subj = req.params.subject;
    const user = req.user;
    req.flash('message', '');
    res.render('adminDashboard', {
      user,
      subject: subj,
      flashMessages: { message: req.flash('message') },
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
    const verifiedQuestions = questions.filter(
      (question) => question.isVerified === true
    );
    const nonVerifiedQuestions = questions.filter(
      (question) => question.isVerified === false
    );
    res.render('adminAllQuestions', {
      questions,
      verifiedQuestions,
      nonVerifiedQuestions,
      subject: subj,
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
    const currentUser = await User.findById(decoded.id);
    const subj = req.body.subject;
    const Model = subjectList[subj];
    await mongoose.model(Model).create({
      question: req.body.question,
      answer: req.body.answer,
      user: currentUser._id,
    });
    res.render('userQuestionSubmitted', { subject: subj });
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
    const verifiedQuestions = questions.filter(
      (question) => question.isVerified === true
    );
    const nonVerifiedQuestions = questions.filter(
      (question) => question.isVerified === false
    );
    res.render('adminAllQuestions', {
      questions,
      verifiedQuestions,
      nonVerifiedQuestions,
      subject: subj,
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
    const question = await mongoose
      .model(Model)
      .findById(req.params.questionId);
    if (question.isVerified) {
      question.isVerified = false;
      await question.save();
      const questions = await mongoose.model(Model).find();
      const verifiedQuestions = questions.filter(
        (question) => question.isVerified === true
      );
      const nonVerifiedQuestions = questions.filter(
        (question) => question.isVerified === false
      );
      return res.render('adminAllQuestions', {
        questions,
        verifiedQuestions,
        nonVerifiedQuestions,
        subject: subj,
      });
    } else {
      question.isVerified = true;
      await question.save();
      const questions = await mongoose.model(Model).find();
      const verifiedQuestions = questions.filter(
        (question) => question.isVerified === true
      );
      const nonVerifiedQuestions = questions.filter(
        (question) => question.isVerified === false
      );
      return res.render('adminAllQuestions', {
        questions,
        verifiedQuestions,
        nonVerifiedQuestions,
        subject: subj,
      });
    }
    // const questions = await mongoose.model(Model).find();
    // const verifiedQuestions = questions.filter(
    //   (question) => question.isVerified === true
    // );
    // const nonVerifiedQuestions = questions.filter(
    //   (question) => question.isVerified === false
    // );
    // res.render('adminAllQuestions', {
    //   questions,
    //   verifiedQuestions,
    //   nonVerifiedQuestions,
    //   subject: subj,
    // });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSubjectWiseQuestionByUser = async (req, res) => {
  try {
    // const algoQs = await Algo.find({ user: req.params.userId });
    // const CdQs = await Cd.find({ user: req.params.userId });
    // const CnQs = await Cn.find({ user: req.params.userId });
    // const DbmsQs = await Dbms.find({ user: req.params.userId });
    // const DsQs = await Ds.find({ user: req.params.userId });
    // const OsQs = await Os.find({ user: req.params.userId });

    // const allQuestions = {
    //   algoQs,
    //   CdQs,
    //   CnQs,
    //   DbmsQs,
    //   DsQs,
    //   OsQs,
    // };
    // res.render('allQuestionsByUser', { allQuestions });

    const subj = req.query.subject;
    const Model = subjectList[subj];
    const questions = await mongoose
      .model(Model)
      .find({ user: req.params.userId });
    // const verifiedQuestions = questions.filter(
    //   (question) => question.isVerified === true
    // );
    // const nonVerifiedQuestions = questions.filter(
    //   (question) => question.isVerified === false
    // );
    res.render('allQuestionsByUser', {
      questions,
      subject: subj,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
