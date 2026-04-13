import { ArrowRight, ShieldCheck, Zap, BarChart3, Fingerprint } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold tracking-widest uppercase mb-8 border border-indigo-100">
        <Zap size={12} className="fill-indigo-500" /> NxtRoute Protocol V2
      </div>
      
      {/* Main Heading */}
      <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
        Evaluate talent with <br />
        <span className="text-indigo-600">Precision AI.</span>
      </h1>
      
      {/* Description */}
      <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 font-medium leading-relaxed">
        The ultimate terminal for technical assessments. Fast, secure, and engineered for modern engineering teams.
      </p>

      {/* CTA Button */}
      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={onStart}
          className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 active:scale-95"
        >
          Access Terminal <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">Authorized for external candidates</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
        {[
          { 
            icon: <Fingerprint />, 
            title: "Encrypted Entry", 
            desc: "Unique access codes ensure only authorized candidates enter the terminal." 
          },
          { 
            icon: <BarChart3 />, 
            title: "Instant Analytics", 
            desc: "High-fidelity scoring and performance metrics delivered in real-time." 
          },
          { 
            icon: <ShieldCheck />, 
            title: "Secure Integrity", 
            desc: "Anti-copy mechanisms and one-time session limits protect test validity." 
          }
        ].map((feature, i) => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-left shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors mb-6">
              {feature.icon}
            </div>
            <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}