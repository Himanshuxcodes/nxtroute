import axios from 'axios';

// Use environment variable for different environments
const API_URL = import.meta.env.VITE_API_URL || 'https://nxtroute-api.onrender.com/api/interviews';

const API = axios.create({ 
  baseURL: API_URL 
});

export default API;