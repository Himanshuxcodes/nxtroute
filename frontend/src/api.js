import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://nxtroute-api.onrender.com/api/interviews' 
});

export default API;