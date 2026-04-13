const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  targetRoles: [String],
  accessCode: { type: String, unique: true, required: true },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number, // Index of the correct option (0-3)
    explanation: String
  }],
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);