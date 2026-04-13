import { useState, useEffect } from 'react';
import { Timer, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AssessmentEngine({ interview, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); 

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFinish = () => {
    let score = 0;
    interview.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    const percentage = Math.round((score / interview.questions.length) * 100);
    onFinish({ score: percentage });
  };

  const currentQ = interview.questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
        <div>
          <h4 className="font-bold text-slate-900 text-lg">{interview.title}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Question {currentIdx + 1} of {interview.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
          <Timer size={16} className="text-slate-500" />
          <span className="font-mono font-bold text-slate-700">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-500" style={{ width: `${((currentIdx + 1) / interview.questions.length) * 100}%` }} />
        <h3 className="text-xl font-semibold text-slate-900 leading-relaxed mb-10">{currentQ.question}</h3>
        <div className="space-y-3">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers({ ...answers, [currentIdx]: i })}
              className={`w-full p-5 rounded-xl text-left transition-all border font-medium ${answers[currentIdx] === i ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-4 ring-indigo-500/5' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {answers[currentIdx] === i && <CheckCircle2 size={18} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => currentIdx < interview.questions.length - 1 ? setCurrentIdx(prev => prev + 1) : handleFinish()}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg"
        >
          {currentIdx === interview.questions.length - 1 ? "Submit Assessment" : <>Next Question <ChevronRight size={18} /></>}
        </button>
      </div>
    </div>
  );
}