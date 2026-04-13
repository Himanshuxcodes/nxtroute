const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const Submission = require('../models/Submission');
const { generateQuestions } = require('../utils/aiHandler');

// --- ADMIN LOGIN ---
// Validates terminal access using environment variables
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    return res.status(200).json({ 
      success: true, 
      token: 'admin-session-' + Math.random().toString(36).substring(7) 
    });
  }
  res.status(401).json({ error: "SERVER: ACCESS_DENIED" });
});

// --- CREATE INTERVIEW (With AI Generation) ---
// Fixes 400 errors by ensuring questions are generated before saving
router.post('/create', async (req, res) => {
  try {
    const { title, targetRoles, accessCode } = req.body;
    
    // AI Handshake: Generate 15 technical questions based on title
    const aiQuestions = await generateQuestions(title);
    
    if (!aiQuestions || aiQuestions.length === 0) {
      return res.status(400).json({ error: "AI failed to generate questions. Check API keys." });
    }

    const newInterview = new Interview({
      title,
      targetRoles,
      accessCode: accessCode.toUpperCase(),
      questions: aiQuestions,
      status: 'Active'
    });

    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (err) {
    console.error("Creation Error:", err.message);
    res.status(400).json({ error: "Failed to deploy protocol." });
  }
});

// --- ACCESS CONTROL & DUPLICATE CHECK ---
// Fixes 404 errors and prevents double-submissions by same email
router.get('/access/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { email } = req.query; // Passed from EntryGate.jsx

    const interview = await Interview.findOne({ 
      accessCode: code.toUpperCase(), 
      status: 'Active' 
    });
    
    if (!interview) {
      return res.status(404).json({ error: "Protocol Key Invalid or Expired." });
    }

    // Security: Check if this email has already attempted this specific test
    if (email) {
      const existingSubmission = await Submission.findOne({
        candidateEmail: email.toLowerCase().trim(),
        interviewId: interview._id
      });

      if (existingSubmission) {
        return res.status(403).json({ 
          error: "ACCESS_REVOKED: This identity has already completed this assessment." 
        });
      }
    }

    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: "Terminal Sync Error." });
  }
});

// --- SUBMIT ASSESSMENT ---
router.post('/submit-assessment', async (req, res) => {
  try {
    // Basic sanitization
    const data = {
      ...req.body,
      candidateEmail: req.body.candidateEmail.toLowerCase().trim()
    };
    
    const submission = new Submission(data);
    await submission.save();
    res.status(201).json({ success: true });
  } catch (err) {
    // Handles database-level unique index collisions
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate submission detected." });
    }
    res.status(400).json({ error: "Data upload failed." });
  }
});

// --- ADMIN DATA FETCH ---
// Provides combined stats for the Protocol Dashboard
router.get('/data/stats', async (req, res) => {
  try {
    const allInterviews = await Interview.find().sort({ createdAt: -1 });
    const allSubmissions = await Submission.find().sort({ submittedAt: -1 });
    res.json({ allInterviews, allSubmissions });
  } catch (err) {
    res.status(500).json({ error: "Data retrieval failed." });
  }
});

// --- SINGLE RECORD DELETION ---
router.delete('/submission/:id', async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed." });
  }
});

router.delete('/protocol/:id', async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    // Optional: Also delete all submissions associated with this protocol
    await Submission.deleteMany({ interviewId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Protocol termination failed." });
  }
});

// --- PURGE SYSTEM ---
// Clear all data for a fresh start
router.delete('/purge', async (req, res) => {
  try {
    await Interview.deleteMany({});
    await Submission.deleteMany({});
    res.json({ success: true, message: "All logs cleared." });
  } catch (err) {
    res.status(500).json({ error: "Purge failed." });
  }
});

module.exports = router;