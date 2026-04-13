import { useState } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react'; // Added icons
import API from '../api';

export default function RouteGenerator({ onClose }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await API.post('/create', { title: topic });
      setGeneratedCode(res.data.accessCode);
    } catch (err) {
      alert("Error: AI Handshake failed or Duplicate found.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
        <h2 className="text-3xl font-black mb-6">Create Protocol</h2>
        
        {!generatedCode ? (
          <>
            <input 
              className="w-full p-4 border-2 rounded-2xl mb-4 font-bold outline-none focus:border-indigo-600"
              placeholder="e.g. React Hooks, Python Basics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Generate Logic'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-slate-400 font-bold mb-2 uppercase text-xs">Protocol Active</p>
            <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed flex items-center justify-between mb-6">
              <span className="text-4xl font-black font-mono text-indigo-600">{generatedCode}</span>
              <button 
                onClick={copyToClipboard}
                className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border'}`}
              >
                {copied ? <Check size={20}/> : <Copy size={20}/>}
              </button>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}