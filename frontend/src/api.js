import axios from 'axios';

// Use a clean root URL (no /api/interviews suffix)
const ROOT_URL = import.meta.env.VITE_ROOT_URL || 'http://localhost:5000';

// For existing interview endpoints (admin, candidate quiz, access codes, submissions)
const API = axios.create({ baseURL: `${ROOT_URL}/api/interviews` });

// For recruiter endpoints (signup, login, dashboard, etc.)
const RecruiterAPI = axios.create({ baseURL: `${ROOT_URL}/api/recruiter` });

// Interceptor to attach JWT token to both clients
const attachToken = (config) => {
  const token = localStorage.getItem('recruiter_jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

API.interceptors.request.use(attachToken);
RecruiterAPI.interceptors.request.use(attachToken);

export default API;
export { RecruiterAPI };