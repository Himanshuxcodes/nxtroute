const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Enable CORS for your Vercel frontend
app.use(cors({ origin: 'https://nxtroute.vercel.app' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Linked"))
  .catch(err => console.log("❌ DB Link Failed:", err));

const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interviews', interviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Terminal running on port ${PORT}`));