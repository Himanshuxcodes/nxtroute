const express = require('express');
const cors = require('cors'); // First declaration (Keep this)
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// --- CORS CONFIGURATION ---
// Change 'your-project-name.vercel.app' to your actual Vercel URL
const allowedOrigins = [
  'http://localhost:5173', 
  'https://your-project-name.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Helpful for session handling later
}));

app.use(express.json()); 

// --- DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Linked"))
  .catch(err => console.error("❌ DB Link Failed:", err));

// --- ROUTES --- 
const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interviews', interviewRoutes);

// Root route (helps check if backend is alive)
app.get('/', (req, res) => {
  res.send('Terminal API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Terminal running on port ${PORT}`));