import { useState, useEffect } from 'react';
import api from '../api'; // Use your custom axios config
import { Timer, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AssessmentEngine({ interview, candidate, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); 
  const [submitting, setSubmitting] = useState(false);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish(); // Auto-submit when time hits zero
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFinish = async (finalAnswers = answers) => {
    if (submitting) return;
    setSubmitting(true);

    let correctCount = 0;
    interview.questions.forEach((q, i) => {
      if (finalAnswers[i] === q.correctAnswer) correctCount++;
    });

    const score = Math.round((correctCount / interview.questions.length) * 100);
    const wrongAnswers = interview.questions.length - correctCount;

    try {
      // POST the results to your live backend
      await api.post('/api/interviews/submit', {
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        interviewId: interview._id,
        interviewTitle: interview.title,
        score: score,
        wrongAnswers: wrongAnswers
      });

      onFinish({ score, wrongAnswers });
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Terminal lost connection. Your score was: " + score + "%");
      onFinish({ score, wrongAnswers }); 
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = interview.questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
        <div>
          <h4 className="font-bold text-slate-900 text-lg tracking-tight">{interview.title}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Question {currentIdx + 1} of {interview.questions.length}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${timeLeft < 60 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
          <Timer size={16} />
          <span className="font-mono font-bold">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-500" 
          style={{ width: `${((currentIdx + 1) / interview.questions.length) * 100}%` }} 
        />
        
        <h3 className="text-xl font-bold text-slate-900 leading-relaxed mb-10">{currentQ.question}</h3>
        
        <div className="space-y-3">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers({ ...answers, [currentIdx]: i })}
              className={`w-full p-5 rounded-2xl text-left transition-all border-2 font-bold ${
                answers[currentIdx] === i 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                  : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {answers[currentIdx] === i && <CheckCircle2 size={18} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
          {candidate.email}
        </p>
        <button
          onClick={() => currentIdx < interview.questions.length - 1 ? setCurrentIdx(prev => prev + 1) : handleFinish()}
          disabled={submitting}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {submitting ? (
            "Saving Results..."
          ) : currentIdx === interview.questions.length - 1 ? (
            "Complete Assessment"
          ) : (
            <>Next Question <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
}