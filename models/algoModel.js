const mongoose = require('mongoose');

const algoSchema = new mongoose.Schema(
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

module.exports = mongoose.model('Algo', algoSchema);
