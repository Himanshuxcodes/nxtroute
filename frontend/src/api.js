import axios from 'axios';

// This automatically picks the live URL from Vercel 
// or falls back to localhost for your computer.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

export default api;