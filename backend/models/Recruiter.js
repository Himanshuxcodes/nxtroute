const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  plan: { type: String, enum: ['monthly', 'yearly'], required: true },
  subscriptionStatus: { type: String, default: 'active' },
  paymentToken: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Correct async pre-save – no next() parameter
recruiterSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

recruiterSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Recruiter', recruiterSchema);