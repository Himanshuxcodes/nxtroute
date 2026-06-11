const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  candidateName: String,
  candidateEmail: { type: String, lowercase: true, trim: true },
  interviewId: { type: mongoose.Schema.Types.ObjectId, required: true },
  recruiterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Recruiter', 
    required: false 
  },
  interviewTitle: String,
  interviewCode: String,
  score: Number,
  wrongAnswers: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

SubmissionSchema.index({ candidateEmail: 1, interviewId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);