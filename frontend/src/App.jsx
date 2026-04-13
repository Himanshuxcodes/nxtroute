import { useState } from 'react';
import api from '../api'; // Switched from axios to your custom config
import { Sparkles, X, Terminal, AlertCircle } from 'lucide-react';

export default function RouteGenerator({ onClose }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateAccessCode = () => {
    // Generates a clean 6-character code like NXT-A1B
    return 'NXT-' + Math.random().toString(36).substring(2, 5).toUpperCase();
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { 
        title: title, 
        targetRoles: [title],
        accessCode: generateAccessCode(),
        status: 'Active'
      };

      // Uses the centralized api config for Render backend
      const res = await api.post('/api/interviews/create', payload);
      
      if (res.status === 201 || res.status === 200) {
        onClose(); 
      }
    } catch (err) {
      console.error("AI Sync Error:", err);
      // More descriptive errors for the user
      const msg = err.response?.data?.error || "AI Handshake Failed. Your Render backend might be sleeping.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Progress Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-10 animate-in zoom-in-95 duration-300">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter mt-8 uppercase">Deploying AI Protocol</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Generating assessment questions for <br/>
              <span className="text-indigo-600 font-bold">"{title}"</span>
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Sparkles size={20} />
            </div>
            <span className="font-black uppercase tracking-widest text-[10px]">New Assessment Protocol</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 font-bold text-xs animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
              Interview Domain / Job Title
            </label>
            <input 
              required
              autoFocus
              placeholder="e.g. Frontend Engineer"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading || !title}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-400 disabled:transform-none"
          >
            <Terminal size={18} /> {loading ? "Syncing..." : "Generate Test"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-4">
           <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
              ))}
           </div>
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
             AI Generation Active
           </p>
        </div>
      </div>
    </div>
  );
}