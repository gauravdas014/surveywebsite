const mongoose = require('mongoose');

const dbmsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
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

module.exports = mongoose.model('Dbms', dbmsSchema);
