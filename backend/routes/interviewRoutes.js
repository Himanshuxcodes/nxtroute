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
    const aiQuestions = await generateQuestions(title);
    
    // GUARD: If AI fails, don't try to save (prevents 400/500 errors)
    if (!aiQuestions) {
      return res.status(422).json({ error: "AI failed to generate questions. Try a different topic." });
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newInterview = new Interview({
      title,
      accessCode: code,
      questions: aiQuestions,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
    });

    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data Structure" });
  }
});

// ACCESS KEY CHECK
router.get('/access/:code', async (req, res) => {
  const interview = await Interview.findOne({ 
    accessCode: req.params.code.toUpperCase(),
    expiresAt: { $gt: new Date() } 
  });
  if (!interview) return res.status(404).json({ error: "Code Expired or Invalid" });
  res.json(interview);
});

// DATA FETCH & DELETE
router.get('/data/stats', async (req, res) => {
  const allInterviews = await Interview.find().sort({ createdAt: -1 });
  const allSubmissions = await Submission.find().sort({ submittedAt: -1 });
  res.json({ allInterviews, allSubmissions });
});

router.delete('/protocol/:id', async (req, res) => {
  await Interview.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.delete('/submission/:id', async (req, res) => {
  await Submission.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// SUBMIT QUIZ
router.post('/submit-assessment', async (req, res) => {
  try {
    const newSub = new Submission(req.body);
    await newSub.save();
    res.status(201).json({ success: true });
  } catch (err) { res.status(400).json({ error: "Submission Failed" }); }
});

module.exports = router;