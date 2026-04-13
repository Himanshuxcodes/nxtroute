const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const Submission = require('../models/Submission');
const { generateQuestions } = require('../utils/aiHandler');

// ADMIN LOGIN
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    return res.status(200).json({ success: true });
  }
  res.status(401).json({ error: "Unauthorized" });
});

// CREATE PROTOCOL
router.post('/create', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const questions = await generateQuestions(title);
    if (!questions || questions.length === 0) {
      return res.status(500).json({ message: "AI failed to generate questions. Try again." });
    }

    const newInterview = new Interview({
      title,
      questions,
      accessCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ACCESS CODE VALIDATION
router.get('/access/:code', async (req, res) => {
  const interview = await Interview.findOne({
    accessCode: req.params.code.toUpperCase(),
    expiresAt: { $gt: new Date() }
  });
  if (!interview) return res.status(404).json({ error: "Code Expired or Invalid" });
  res.json(interview);
});

// FETCH ALL DATA
router.get('/data/stats', async (req, res) => {
  const allInterviews = await Interview.find().sort({ createdAt: -1 });
  const allSubmissions = await Submission.find().sort({ submittedAt: -1 });
  res.json({ allInterviews, allSubmissions });
});

// DELETE PROTOCOL
router.delete('/protocol/:id', async (req, res) => {
  await Interview.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// DELETE SUBMISSION
router.delete('/submission/:id', async (req, res) => {
  await Submission.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// SUBMIT QUIZ RESULTS
router.post('/submit-assessment', async (req, res) => {
  try {
    const newSub = new Submission(req.body);
    await newSub.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(400).json({ error: "Submission Failed" });
  }
});

module.exports = router;