import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import EntryGate from './components/EntryGate';
import CandidateQuiz from './components/CandidateQuiz';
import AdminLogin from './components/AdminLogin';
import ProtocolDashboard from './components/ProtocolDashboard';

export default function App() {
  const [view, setView] = useState('landing');
  const [quizData, setQuizData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const startQuiz = (data, user) => {
    setQuizData(data);
    setCandidate(user);
    setView('quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-sans">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div onClick={() => window.location.reload()} className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center text-white text-sm shadow-md group-hover:scale-105 transition-transform">
                N
              </div>
              <span className="text-xl font-black tracking-tight text-slate-800">
                nxtroute
                <span className="text-indigo-600 text-[10px] font-bold bg-indigo-100 px-2 py-0.5 rounded-md ml-2">V2</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {view === 'landing' && (
                <button onClick={() => setView('admin-login')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Admin Terminal
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu panel */}
          {mobileMenuOpen && view === 'landing' && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <button onClick={() => { setView('admin-login'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-600 hover:text-indigo-600">
                Admin Terminal
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {view === 'landing' && <EntryGate onStartQuiz={startQuiz} />}
        {view === 'quiz' && <CandidateQuiz quizData={quizData} candidateInfo={candidate} />}
        {view === 'admin-login' && <AdminLogin onAuth={() => setView('dashboard')} />}
        {view === 'dashboard' && <ProtocolDashboard />}
      </main>
    </div>
  );
}