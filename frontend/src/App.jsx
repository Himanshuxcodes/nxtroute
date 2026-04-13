import { useState } from 'react';
import EntryGate from './components/EntryGate';
import CandidateQuiz from './components/CandidateQuiz';
import AdminLogin from './components/AdminLogin';
import ProtocolDashboard from './components/ProtocolDashboard';

export default function App() {
  const [view, setView] = useState('entry'); 
  const [quizData, setQuizData] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);

  const startQuiz = (data, info) => {
    setQuizData(data);
    setCandidateInfo(info);
    setView('quiz');
  };

  const showAdminLogin = () => setView('admin-login');
  const enterDashboard = () => setView('admin-dash');
  
  const exitToHome = () => {
    setView('entry');
    setQuizData(null);
    setCandidateInfo(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div onClick={exitToHome} className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">N</div>
          nxtroute <span className="text-indigo-600 text-xs font-bold bg-indigo-50 px-2 py-1 rounded-md">V2</span>
        </div>
        
        {view === 'entry' && (
          <button onClick={showAdminLogin} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
            Admin Terminal
          </button>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {view === 'entry' && <EntryGate onStartQuiz={startQuiz} />}
        {view === 'quiz' && <CandidateQuiz quizData={quizData} candidateInfo={candidateInfo} />}
        {/* Pass the function to switch views here */}
        {view === 'admin-login' && <AdminLogin onAuthenticated={enterDashboard} />}
        {view === 'admin-dash' && <ProtocolDashboard />}
      </main>
    </div>
  );
}