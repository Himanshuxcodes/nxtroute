const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  interviewId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Interview', 
    required: true 
  },
  interviewTitle: { type: String }, // Denormalized for faster dashboard loading
  candidateName: { 
    type: String, 
    required: true,
    trim: true 
  },
  candidateEmail: { 
    type: String, 
    required: true,
    lowercase: true 
  },
  answers: {
    type: Map,
    of: Number,
    default: {}
  }, // Stores { "0": 1, "1": 0 } - Map is more performant than Object for this
  score: { 
    type: Number, 
    default: 0 
  },
  totalQuestions: { 
    type: Number, 
    default: 0 
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create a compound index to quickly find results for a specific interview
sessionSchema.index({ interviewId: 1, completedAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);