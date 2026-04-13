const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  accessCode: { type: String, unique: true, required: true },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);  