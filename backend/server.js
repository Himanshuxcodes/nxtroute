const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json()); 

// DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Linked"))
  .catch(err => console.log("❌ DB Link Failed:", err));

// ROUTES 
// Matches frontend calls: http://localhost:5000/api/interviews/...
const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interviews', interviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Terminal running on port ${PORT}`));