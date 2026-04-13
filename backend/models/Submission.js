const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
  interviewTitle: String,
  interviewCode: String,
  score: Number, // Percentage
  wrongAnswers: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);