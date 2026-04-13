import { useState } from 'react';
import { Sparkles, X, Terminal, Loader2 } from 'lucide-react';
import API from '../api';

export default function RouteGenerator({ onClose }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Corrected Path
      await API.post('/create', { title });
      onClose();
    } catch (err) {
      alert("AI Handshake Error. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 text-indigo-600"><Sparkles size={24} /><span className="font-black uppercase tracking-widest text-xs">AI Protocol</span></div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900"><X size={24} /></button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Interview Domain</label>
          <input required placeholder="e.g. Senior React Developer" className="w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm outline-none" onChange={(e) => setTitle(e.target.value)} />
          <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <><Terminal size={18} /> Deploy Access Key</>}
          </button>
        </form>
      </div>
    </div>
  );
}