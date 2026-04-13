// frontend/src/components/RouteGenerator.jsx
import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import API from '../api';

export default function RouteGenerator({ onCreated, onClose }) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      await API.post('/create', { title: topic });
      onCreated();
      onClose();
    } catch (err) {
      alert("API Error: " + (err.response?.data?.message || "Failed to generate assessment."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8">
          <Zap size={28} fill="currentColor" />
        </div>
        
        <h3 className="text-3xl font-black mb-2">Create Protocol</h3>
        <p className="text-slate-400 text-sm mb-8 font-bold uppercase tracking-widest">AI Assessment Engine</p>

        <input 
          className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-6 outline-none focus:border-indigo-500 font-black"
          placeholder="Topic (e.g. React, Python)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
        />

        <div className="flex gap-4">
          {/* CANCEL BUTTON */}
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px]"
          >
            Cancel
          </button>

          <button 
            onClick={handleCreate}
            disabled={loading || !topic}
            className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Initialize AI"}
          </button>
        </div>
      </div>
    </div>
  );
}