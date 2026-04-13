import { useState, useEffect } from 'react';
import { Timer, CheckCircle, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import axios from 'axios';

export default function CandidateQuiz({ quizData, candidateInfo }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isFinished, setIsFinished] = useState(false);

  // --- SECURITY: ANTI-COPY LOGIC ---
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // Block Ctrl+C, Ctrl+U, Ctrl+S, and F12
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's')) || 
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNext(null);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNext = (selectedIdx) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedIdx;
    setAnswers(newAnswers);

    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(20);
    } else {
      finalize(newAnswers);
    }
  };

  const finalize = async (finalAnswers) => {
    const correctCount = finalAnswers.reduce((acc, ans, idx) => 
      ans === quizData.questions[idx].correctAnswer ? acc + 1 : acc, 0);
    
    const wrongCount = quizData.questions.length - correctCount;
    const score = Math.round((correctCount / quizData.questions.length) * 100);

    try {
      await axios.post('http://localhost:5000/api/interviews/submit-assessment', {
        candidateName: candidateInfo.name,
        candidateEmail: candidateInfo.email,
        interviewId: quizData._id,
        interviewTitle: quizData.title,
        score,
        wrongAnswers: wrongCount
      });
      setIsFinished(true);
    } catch (e) { alert("Network Error: Submission failed."); }
  };

  if (isFinished) return (
    <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[3rem] shadow-2xl text-center border border-emerald-100">
      <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
        <ShieldCheck size={40} />
      </div>
      <h2 className="text-3xl font-black text-slate-900">Protocol Complete</h2>
      <p className="text-slate-500 mt-4 leading-relaxed">Your data has been successfully securely uploaded.</p>
      <button onClick={() => window.location.href = '/'} className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">
        Terminate Session
      </button>
    </div>
  );

  const q = quizData.questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden select-none">
      {/* CSS: select-none added to the wrapper above to disable text highlighting */}
      
      <div className="absolute top-0 left-0 h-1.5 bg-indigo-500 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 20) * 100}%` }}></div>
      
      <div className="flex justify-between items-center mb-10">
        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase flex items-center gap-1">
          <Lock size={12} /> Step {currentIndex + 1} / 15
        </span>
        <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 6 ? 'text-rose-500 animate-pulse' : 'text-slate-900'}`}>
          <Timer size={22} /> {timeLeft}s
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-10 leading-snug">
        {q.question}
      </h3>

      <div className="grid gap-4">
        {q.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleNext(i)} 
            className="w-full text-left p-6 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:border-indigo-500 hover:bg-white transition-all group active:scale-[0.98]"
          >
            <span className="font-semibold text-slate-700 group-hover:text-indigo-600">
              {opt}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
        Security Active: Content Copying Disabled
      </p>
    </div>
  );
}