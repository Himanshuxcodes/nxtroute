import { useState } from 'react';
import axios from 'axios';
import { Fingerprint, ArrowRight, Loader2, ShieldCheck, Zap, BarChart3, Globe } from 'lucide-react';

export default function EntryGate({ onStartQuiz }) {
  const [formData, setFormData] = useState({ name: '', email: '', code: '' });
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!formData.name || !formData.email || !formData.code) return alert("Please fill all boxes.");
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/interviews/access/${formData.code.toUpperCase()}?email=${formData.email.toLowerCase().trim()}`
      );
      onStartQuiz(res.data, { name: formData.name, email: formData.email });
    } catch (err) {
      if (err.response?.status === 403) alert("You already took this test.");
      else alert("Wrong code or server is down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center py-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Left Side: Info */}
      <div className="space-y-10">
        <div className="space-y-6">
          <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
            Smart Testing Tool
          </span>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            Check skills <span className="text-indigo-600">faster</span> and better.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
            Nxtroute V2 uses AI to create smart tests for any job. It's fast, easy to use, and helps you find the best people.
          </p>
        </div>

        {/* Small Feature List */}
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 shrink-0 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">AI Questions</h4>
              <p className="text-sm text-slate-400 font-medium">Smart questions made for any topic.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 shrink-0 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Cheat Proof</h4>
              <p className="text-sm text-slate-400 font-medium">Users can only take the test once.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 shrink-0 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <BarChart3 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Quick Scores</h4>
              <p className="text-sm text-slate-400 font-medium">Get results the second they finish.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 shrink-0 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <Globe size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Always Ready</h4>
              <p className="text-sm text-slate-400 font-medium">Works anywhere, anytime on any device.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Box */}
      <div className="relative">
        <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-[4rem] -z-10 animate-pulse"></div>
        <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
          
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8">
            <Fingerprint size={28} />
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Start Test</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Enter details to begin</p>
          </div>

          <div className="space-y-4">
            <input 
              className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300"
              placeholder="Your Name"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300"
              placeholder="Your Email"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              className="w-full p-5 bg-indigo-50 border-2 border-indigo-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-mono font-black text-indigo-600 placeholder:text-indigo-300 uppercase"
              placeholder="Test Code (e.g. NXT-XXX)"
              onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
            
            <button 
              onClick={handleJoin}
              disabled={loading}
              className="w-full py-5 mt-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>Enter Test <ArrowRight size={20} /></>
              )}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            System Online
          </div>
        </div>
      </div>
    </div>
  );
}