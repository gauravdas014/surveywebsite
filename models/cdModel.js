const mongoose = require('mongoose');

const cdSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cd', cdSchema);
