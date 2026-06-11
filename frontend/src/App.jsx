import { useState, useEffect } from 'react';
import EntryGate from './components/EntryGate';
import CandidateQuiz from './components/CandidateQuiz';
import AdminLogin from './components/AdminLogin';
import ProtocolDashboard from './components/ProtocolDashboard';
import PricingPlans from './components/PricingPlans';
import RecruiterSignUp from './components/RecruiterSignUp';
import RecruiterLogin from './components/RecruiterLogin';
import RecruiterDashboard from './components/RecruiterDashboard';
import RecruiterSetup from './components/RecruiterSetup';

export default function App() {
  const [view, setView] = useState('landing');
  const [quizData, setQuizData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [recruiterAuth, setRecruiterAuth] = useState(!!localStorage.getItem('recruiter_jwt'));
  const [showSetup, setShowSetup] = useState(false);

  // Check if logged‑in recruiter needs to set username
  useEffect(() => {
    const jwt = localStorage.getItem('recruiter_jwt');
    if (jwt) {
      // Optionally decode JWT to check if username is set; for now we'll assume
      // we need to check a flag stored after first login.
      const needsSetup = localStorage.getItem('recruiter_needs_setup') === 'true';
      setShowSetup(needsSetup);
      setRecruiterAuth(true);
    }
  }, []);

  const startQuiz = (data, user) => {
    setQuizData(data);
    setCandidate(user);
    setView('quiz');
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setView('signup');
  };

  const handleRecruiterLogin = () => {
    // After login, check if username is set (we'll rely on the flag)
    const needsSetup = localStorage.getItem('recruiter_needs_setup') === 'true';
    setRecruiterAuth(true);
    if (needsSetup) {
      setShowSetup(true);
    } else {
      setView('recruiter-dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('recruiter_jwt');
    localStorage.removeItem('recruiter_needs_setup');
    setRecruiterAuth(false);
    setShowSetup(false);
    setView('landing');
  };

  const handleSetupComplete = () => {
    localStorage.removeItem('recruiter_needs_setup');
    setShowSetup(false);
    setView('recruiter-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div onClick={() => window.location.reload()} className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">N</div>
            nxtroute <span className="text-indigo-600 text-[10px] font-bold bg-indigo-50 px-2 py-0.5 rounded-md">V2</span>
          </div>

          <div className="flex gap-4 items-center">
            {view === 'landing' && (
              <>
                <button onClick={() => setView('pricing')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Recruiter Sign Up
                </button>
                <button onClick={() => setView('recruiter-login')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Recruiter Login
                </button>
                <button onClick={() => setView('admin-login')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Admin Terminal
                </button>
              </>
            )}
            {recruiterAuth && view !== 'recruiter-dashboard' && view !== 'recruiter-login' && (
              <button onClick={() => setView('recruiter-dashboard')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Dashboard
              </button>
            )}
            {recruiterAuth && view === 'recruiter-dashboard' && (
              <button onClick={handleLogout} className="text-sm font-medium text-rose-500 hover:text-rose-700">
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {view === 'landing' && <EntryGate onStartQuiz={startQuiz} />}
        {view === 'quiz' && <CandidateQuiz quizData={quizData} candidateInfo={candidate} />}
        {view === 'admin-login' && <AdminLogin onAuth={() => setView('dashboard')} />}
        {view === 'dashboard' && <ProtocolDashboard />}
        {view === 'pricing' && <PricingPlans onSelectPlan={handleSelectPlan} />}
        {view === 'signup' && (
          <RecruiterSignUp selectedPlan={selectedPlan} onBack={() => setView('pricing')} onSignupComplete={() => {
            // After signup, if no username, show setup modal
            const needsSetup = localStorage.getItem('recruiter_needs_setup') === 'true';
            setRecruiterAuth(true);
            if (needsSetup) {
              setShowSetup(true);
            } else {
              setView('recruiter-dashboard');
            }
          }} />
        )}
        {view === 'recruiter-login' && <RecruiterLogin onLogin={handleRecruiterLogin} />}
        {recruiterAuth && view === 'recruiter-dashboard' && <RecruiterDashboard />}
      </main>

      {showSetup && <RecruiterSetup onComplete={handleSetupComplete} />}
    </div>
  );
}