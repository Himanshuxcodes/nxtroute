import { useState } from 'react';
import { Key, Loader2 } from 'lucide-react';
import { RecruiterAPI } from '../api';

export default function RecruiterLogin({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await RecruiterAPI.post('/login', { identifier, password });
      localStorage.setItem('recruiter_jwt', res.data.token);
      if (!res.data.recruiter.username) {
        localStorage.setItem('recruiter_needs_setup', 'true');
      }
      onLogin(res.data.recruiter);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl shadow-2xl">
      <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
        <Key size={28} />
      </div>
      <h2 className="text-3xl font-black mb-2">Recruiter Login</h2>
      <p className="text-slate-400 text-sm mb-8">Enter your email/username and password</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Email or Username" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="text-rose-500 text-sm">{error}</p>}
        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:shadow-lg transition-all flex justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : 'Access Dashboard'}
        </button>
      </form>
    </div>
  );
}