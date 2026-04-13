import { useState } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import API from '../api';

export default function AdminLogin({ onAuth }) {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/login', creds);
      if (res.data.success) onAuth();
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors ${error ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white'}`}>
        {error ? <ShieldAlert size={28} /> : <Lock size={28} />}
      </div>
      <h2 className="text-3xl font-black mb-2">Terminal Access</h2>
      <p className="text-slate-400 text-sm mb-8 font-medium">Authorized personnel only.</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="text" 
          placeholder="Admin User" 
          className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500 font-bold"
          onChange={(e) => setCreds({...creds, username: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Security Password" 
          className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500 font-bold"
          onChange={(e) => setCreds({...creds, password: e.target.value})}
        />
        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:shadow-lg hover:shadow-indigo-200 transition-all uppercase tracking-widest text-xs">
          Initialize Session
        </button>
      </form>
    </div>
  );
}