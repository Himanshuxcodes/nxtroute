import { useState } from 'react';
import { Fingerprint, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import API from '../api';

export default function EntryGate({ onStartQuiz }) {
  const [formData, setFormData] = useState({ name: '', email: '', code: '' });
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!formData.name || !formData.code) return alert("Missing fields");
    setLoading(true);
    try {
      const res = await API.get(`/access/${formData.code.toUpperCase()}`);
      onStartQuiz(res.data, { name: formData.name, email: formData.email });
    } catch (err) {
      alert(err.response?.data?.error || "Invalid Protocol Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 py-8 md:py-16">
      <div className="flex-1 text-center lg:text-left animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-semibold mb-6">
          <Sparkles size={16} className="fill-indigo-500" />
          AI-Powered Technical Assessments
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tighter">
          Validate talent with <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Precision.</span>
        </h1>
        <p className="text-slate-500 mt-6 text-lg max-w-2xl mx-auto lg:mx-0">
          Enter your unique access key to begin your AI-generated 15‑question technical assessment.
        </p>
      </div>

      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/50 animate-fade-in-up animation-delay-200">
        <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
          <Fingerprint size={28} />
        </div>
        <div className="space-y-5">
          <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium" placeholder="Email Address" type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input className="w-full p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl outline-none focus:border-indigo-600 font-bold text-indigo-700 uppercase placeholder:text-indigo-300" placeholder="ACCESS CODE" onChange={(e) => setFormData({...formData, code: e.target.value})} />
          <button onClick={handleJoin} disabled={loading} className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" /> : <>Start Assessment <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}