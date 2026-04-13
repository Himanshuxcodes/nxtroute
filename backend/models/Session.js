const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
  candidateName: { type: String, default: "Anonymous" },
  answers: Object, // Stores { "0": 1, "1": 0 ... }
  score: Number,
  totalQuestions: Number,
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);