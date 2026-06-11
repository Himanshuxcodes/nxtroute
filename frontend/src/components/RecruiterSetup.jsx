import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { RecruiterAPI } from '../api';

export default function RecruiterSetup({ onComplete }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await RecruiterAPI.post('/setup', { username, password });
      localStorage.removeItem('recruiter_needs_setup');
      onComplete();
    } catch (err) {
      setError(err.response?.data?.error || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-black">Welcome! Set your credentials</h2>
        <p className="text-slate-500 mt-1">Choose a username and password for future logins.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="text" placeholder="Username" className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-rose-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}