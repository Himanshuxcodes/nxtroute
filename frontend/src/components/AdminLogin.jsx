import React, { useState } from 'react';
import api from '../api'; // Switched from axios to your custom config
import { Lock, User, ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminLogin({ onAuthenticated }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      return setError("All fields required.");
    }

    setLoading(true);
    setError('');

    try {
      // Endpoint is now relative because of our api.js config
      const res = await api.post('/api/interviews/admin/login', credentials);
      
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        onAuthenticated(); 
      }
    } catch (err) {
      // Handles both server errors and "Wrong password" errors
      setError(err.response?.data?.error || "Connection to Terminal Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 animate-in fade-in duration-500">
        
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg shadow-indigo-200">
          <Lock size={30} />
        </div>

        <h2 className="text-3xl font-black text-center text-slate-900 mb-2 tracking-tighter">Admin Access</h2>
        <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Secure Terminal V2</p>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl flex items-center gap-3">
            <ShieldAlert size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300"
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Access Terminal"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}