import { useState } from 'react';
import axios from 'axios';
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
      /** * NOTE: Your backend route /api/interviews/create 
       * needs to handle the AI question generation logic 
       * or receive the questions here.
       */
      const payload = { 
        title: title, 
        targetRoles: [title],
        accessCode: generateAccessCode(),
        // We send the request to the backend. 
        // The backend should call Groq/Gemini to populate the questions array.
        status: 'Active'
      };

      const res = await axios.post('http://localhost:5000/api/interviews/create', payload);
      
      if (res.status === 201 || res.status === 200) {
        onClose(); // Close modal and refresh dashboard list
      }
    } catch (err) {
      console.error("AI Sync Error:", err);
      setError(err.response?.data?.error || "AI Handshake Failed. Verify Backend & API Keys.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Progress Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-10">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">AI PROTOCOL ACTIVE</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Generating technical assessment questions for <br/>
              <span className="text-indigo-600 font-bold">"{title}"</span>
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <Sparkles size={24} />
            <span className="font-black uppercase tracking-widest text-xs">New Assessment Protocol</span>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-xs">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
              Interview Domain / Job Title
            </label>
            <input 
              required
              placeholder="e.g. MERN Stack Developer"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading || !title}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-400"
          >
            <Terminal size={18} /> {loading ? "Syncing..." : "Deploy Access Key"}
          </button>
        </form>

        <p className="mt-8 text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">
          Automated Question Generation Enabled
        </p>
      </div>
    </div>
  );
}