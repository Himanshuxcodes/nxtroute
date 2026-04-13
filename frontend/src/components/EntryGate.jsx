import { useState } from 'react';
import { Fingerprint, ArrowRight, Loader2 } from 'lucide-react';
import API from '../api';

export default function EntryGate({ onStartQuiz }) {
  const [formData, setFormData] = useState({ name: '', email: '', code: '' });
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!formData.name || !formData.code) return alert("Missing fields");
    setLoading(true);
    try {
      // Corrected Path
      const res = await API.get(`/access/${formData.code.toUpperCase()}`);
      onStartQuiz(res.data, { name: formData.name, email: formData.email });
    } catch (err) {
      alert(err.response?.data?.error || "Invalid Protocol Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 py-16">
      <div className="flex-1 text-left">
        <h1 className="text-6xl font-black text-slate-900 leading-tight">Validate talent with <span className="text-indigo-600">Precision.</span></h1>
        <p className="text-slate-500 mt-6 text-lg">Enter your access key to begin your 15-question technical assessment.</p>
      </div>

      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-6"><Fingerprint size={24} /></div>
        <div className="space-y-4">
          <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500 font-bold" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500 font-bold" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input className="w-full p-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl outline-none focus:border-indigo-500 font-black text-indigo-600 uppercase" placeholder="ACCESS CODE" onChange={(e) => setFormData({...formData, code: e.target.value})} />
          <button onClick={handleJoin} disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <>Start Assessment <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}