const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  candidateName: String,
  candidateEmail: { type: String, lowercase: true, trim: true },
  interviewId: { type: mongoose.Schema.Types.ObjectId, required: true },
  interviewTitle: String,
  interviewCode: String, // Add this field
  score: Number,
  wrongAnswers: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

// Ensures one email can only submit ONCE per specific interview ID
SubmissionSchema.index({ candidateEmail: 1, interviewId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);