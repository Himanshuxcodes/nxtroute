import { useState } from 'react';
import EntryGate from './components/EntryGate';
import CandidateQuiz from './components/CandidateQuiz';
import AdminLogin from './components/AdminLogin';
import ProtocolDashboard from './components/ProtocolDashboard';

export default function App() {
  const [view, setView] = useState('landing'); 
  const [quizData, setQuizData] = useState(null);
  const [candidate, setCandidate] = useState(null);

  const startQuiz = (data, user) => {
    setQuizData(data);
    setCandidate(user);
    setView('quiz');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div onClick={() => window.location.reload()} className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">N</div>
          nxtroute <span className="text-indigo-600 text-[10px] font-bold bg-indigo-50 px-2 py-0.5 rounded-md">V2</span>
        </div>
        
        {view === 'landing' && (
          <button onClick={() => setView('admin-login')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
            Admin Terminal
          </button>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {view === 'landing' && <EntryGate onStartQuiz={startQuiz} />}
        {view === 'quiz' && <CandidateQuiz quizData={quizData} candidateInfo={candidate} />}
        {view === 'admin-login' && <AdminLogin onAuth={() => setView('dashboard')} />}
        {view === 'dashboard' && <ProtocolDashboard />}
      </main>
    </div>
  );
}