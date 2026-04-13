import { useState, useEffect } from 'react';
import { Timer, CheckCircle } from 'lucide-react';
import API from '../api';

export default function CandidateQuiz({ quizData, candidateInfo }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🛡️ Guard: if data is invalid, show error
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-16 bg-white rounded-[3rem] shadow-2xl text-center">
        <h2 className="text-2xl font-black text-red-600">Invalid Assessment Data</h2>
        <p className="mt-4">Please contact the administrator.</p>
      </div>
    );
  }

  const totalQuestions = quizData.questions.length;

  // Auto‑submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !finished && !submitting) {
      handleNext(null);
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finished, submitting]);

  const handleNext = async (choice) => {
    if (submitting) return;

    const updated = [...answers, choice];
    setAnswers(updated);

    // Not last question → move to next
    if (current < totalQuestions - 1) {
      setCurrent(current + 1);
      setTimeLeft(20);
      return;
    }

    // Last question – calculate and submit
    setSubmitting(true);

    const correct = updated.reduce((acc, val, i) => {
      return val === quizData.questions[i].correctAnswer ? acc + 1 : acc;
    }, 0);

    const score = Math.round((correct / totalQuestions) * 100);
    const wrongAnswers = totalQuestions - correct;

    try {
      await API.post('/submit-assessment', {
        candidateName: candidateInfo.name,
        candidateEmail: candidateInfo.email,
        interviewId: quizData._id,
        interviewTitle: quizData.title,
        interviewCode: quizData.accessCode,
        score: score,
        wrongAnswers: wrongAnswers
      });
      setFinished(true);
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to save your results. Please contact support.');
      setFinished(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (finished) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-16 bg-white rounded-[3rem] shadow-2xl text-center">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-4xl font-black tracking-tight">Data Synchronized</h2>
        <p className="text-slate-500 mt-4 font-medium">
          Your assessment for <span className="text-slate-900 font-bold">{quizData.title}</span> has been securely logged.
        </p>
        <button
          onClick={() => (window.location.href = '/')}
          className="mt-12 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors"
        >
          Close Terminal
        </button>
      </div>
    );
  }

  // 🛡️ Extra guard: if current index is out of bounds
  if (current >= totalQuestions) {
    return <div className="text-center mt-20">Loading next question...</div>;
  }

  const q = quizData.questions[current];

  return (
    <div className="max-w-3xl mx-auto mt-12 p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden select-none">
      <div
        className="absolute top-0 left-0 h-1.5 bg-indigo-600 transition-all duration-1000 ease-linear"
        style={{ width: `${(timeLeft / 20) * 100}%` }}
      />

      <div className="flex justify-between items-center mb-12">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
          Protocol Sequence {current + 1} / {totalQuestions}
        </span>
        <div
          className={`flex items-center gap-2 font-mono text-2xl font-black ${
            timeLeft < 6 ? 'text-rose-500 animate-pulse' : 'text-slate-900'
          }`}
        >
          <Timer size={24} /> {timeLeft}s
        </div>
      </div>

      <h3 className="text-3xl font-bold text-slate-900 leading-tight mb-12">{q.question}</h3>

      <div className="grid gap-4">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleNext(i)}
            disabled={submitting}
            className="w-full text-left p-6 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50 transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 group-hover:text-indigo-700">{opt}</span>
              <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-indigo-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}