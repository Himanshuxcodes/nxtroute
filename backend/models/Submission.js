const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  candidateName: { 
    type: String, 
    required: true 
  },
  candidateEmail: { 
    type: String, 
    lowercase: true, 
    trim: true, 
    required: true 
  },
  interviewId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Interview', 
    required: true 
  },
  interviewTitle: String,
  score: Number,
  wrongAnswers: { 
    type: Number, 
    default: 0 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
});

/**
 * THE ULTIMATE FIX FOR DUPLICATES:
 * This creates a unique compound index. 
 * It ensures that the COMBINATION of email and interviewId is unique.
 * One person (email) can take different tests, 
 * but cannot take the SAME test (interviewId) twice.
 */
SubmissionSchema.index({ candidateEmail: 1, interviewId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);