import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminLogin({ onAuthenticated }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/interviews/admin/login', credentials);
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        onAuthenticated(); // Switches view in App.jsx without reloading [cite: 33, 34]
      }
    } catch (err) {
      setError(err.response?.data?.error || "SERVER: ACCESS_DENIED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-8">Admin Access</h2>
        {error && <div className="mb-6 p-4 bg-rose-50 text-rose-600 font-bold rounded-2xl">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold"
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold"
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Access Terminal"}
          </button>
        </form>
      </div>
    </div>
  );
}