import { ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold tracking-widest uppercase mb-8 border border-indigo-100">
        <Zap size={12} /> The Future of Hiring
      </div>
      
      {/* Main Heading */}
      <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
        Test skills with <br />
        <span className="text-indigo-600">Smart Assessments.</span>
      </h1>
      
      {/* Description */}
      <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-12 font-medium">
        The easy way to run technical interviews. Fast, secure, and built for modern teams.
      </p>

      {/* CTA Button */}
      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={onStart}
          className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 active:scale-95"
        >
          Start Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">No account needed for users</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
        {[
          { 
            icon: <ShieldCheck />, 
            title: "Secure", 
            desc: "Every test gets a unique code to keep things private." 
          },
          { 
            icon: <BarChart3 />, 
            title: "Fast Results", 
            desc: "See scores and performance the moment a test ends." 
          },
          { 
            icon: <Zap />, 
            title: "MERN Stack", 
            desc: "Built with fast, modern tech for a smooth experience." 
          }
        ].map((feature, i) => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-left shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
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