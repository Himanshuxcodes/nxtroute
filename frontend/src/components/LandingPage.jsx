import { ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold tracking-widest uppercase mb-8 border border-indigo-100">
        <Zap size={12} /> The Future of Technical Hiring
      </div>
      
      <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
        Validate talent with <br />
        <span className="text-indigo-600">Precision Assessment.</span>
      </h1>
      
      <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-12 font-medium">
        The all-in-one platform for technical interviews. Secure, automated, and designed for modern engineering teams.
      </p>

      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={onStart}
          className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100"
        >
          Join Interview <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-xs text-slate-400 font-mono">NO REGISTRATION REQUIRED FOR CANDIDATES</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
        {[
          { icon: <ShieldCheck />, title: "Secure Access", desc: "Unique 0x hex keys for every assessment session." },
          { icon: <BarChart3 />, title: "Instant Metrics", desc: "Real-time scoring and performance breakdown." },
          { icon: <Zap />, title: "MERN Powered", desc: "High-speed, scalable architecture for reliable testing." }
        ].map((feature, i) => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] text-left shadow-sm">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">{feature.icon}</div>
            <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}