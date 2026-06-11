const express = require('express');
const router = express.Router();

const Recruiter = require('../models/Recruiter');
const Interview = require('../models/Interview');
const Submission = require('../models/Submission');
const { generateQuestions } = require('../utils/aiHandler');
const jwt = require('jsonwebtoken');

const authRecruiter = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.recruiterId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, plan, paymentToken } = req.body;

    const recruiter = new Recruiter({
      name,
      email,
      password,
      plan,
      paymentToken
    });

    await recruiter.save();

    const token = jwt.sign(
      { id: recruiter._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      recruiter: {
        id: recruiter._id,
        name,
        email,
        username: recruiter.username
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      error: 'Signup failed',
      details: err.message
    });
  }
});

router.post('/setup', authRecruiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    const recruiter = await Recruiter.findById(req.recruiterId);
    if (!recruiter) return res.status(404).json({ error: 'Not found' });

    recruiter.username = username;
    if (password) recruiter.password = password;

    await recruiter.save();

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const recruiter = await Recruiter.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    });

    if (!recruiter) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await recruiter.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: recruiter._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      recruiter: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        username: recruiter.username
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/dashboard', authRecruiter, async (req, res) => {
  try {
    const interviews = await Interview.find({
      recruiterId: req.recruiterId
    }).sort({ createdAt: -1 });

    const interviewIds = interviews.map((i) => i._id);

    const submissions = await Submission.find({
      $or: [
        { recruiterId: req.recruiterId },
        { interviewId: { $in: interviewIds } }
      ]
    }).sort({ submittedAt: -1 });

    res.json({ interviews, submissions });
  } catch (err) {
    console.error('Recruiter dashboard error:', err);
    res.status(500).json({ error: 'Dashboard failed' });
  }
});

router.post('/create-protocol', authRecruiter, async (req, res) => {
  try {
    const { title, requestId } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (requestId) {
      const existing = await Interview.findOne({
        requestId,
        recruiterId: req.recruiterId
      });

      if (existing) return res.status(200).json(existing);
    }

    const questions = await generateQuestions(title);

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        message: 'AI failed to generate questions'
      });
    }

    const interview = new Interview({
      title,
      requestId,
      questions,
      accessCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      recruiterId: req.recruiterId
    });

    await interview.save();

    res.status(201).json(interview);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.requestId) {
      const existing = await Interview.findOne({
        requestId: req.body.requestId,
        recruiterId: req.recruiterId
      });

      if (existing) return res.status(200).json(existing);
    }

    console.error('Create protocol error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/protocol/:id', authRecruiter, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      recruiterId: req.recruiterId
    });

    if (!interview) return res.status(404).json({ error: 'Not found' });

    await Submission.deleteMany({ interviewId: interview._id });
    await interview.deleteOne();

    res.json({ success: true });
  } catch (err) {
    console.error('Delete protocol error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

router.delete('/submission/:id', authRecruiter, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) return res.status(404).json({ error: 'Not found' });

    const interview = await Interview.findOne({
      _id: submission.interviewId,
      recruiterId: req.recruiterId
    });

    if (!interview) return res.status(403).json({ error: 'Unauthorized' });

    await submission.deleteOne();

    res.json({ success: true });
  } catch (err) {
    console.error('Delete submission error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;