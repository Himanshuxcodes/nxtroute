import { useState, useEffect, useRef } from 'react';
import { Timer, CheckCircle } from 'lucide-react';
import API from '../api';

export default function CandidateQuiz({ quizData, candidateInfo }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const quizContainerRef = useRef(null);

  // 🛡️ Guard: invalid data
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-16 bg-white rounded-3xl shadow-2xl text-center">
        <h2 className="text-2xl font-black text-red-600">Invalid Assessment Data</h2>
        <p className="mt-4">Please contact the administrator.</p>
      </div>
    );
  }

  const totalQuestions = quizData.questions.length;   // ✅ declared only once

  // 🛡️ Copy protection: disable context menu, copy, cut, paste, and keyboard shortcuts
  useEffect(() => {
    const container = quizContainerRef.current;
    if (!container) return;

    const preventDefault = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        return false;
      }
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    container.addEventListener('contextmenu', preventDefault);
    container.addEventListener('copy', preventDefault);
    container.addEventListener('cut', preventDefault);
    container.addEventListener('paste', preventDefault);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('contextmenu', preventDefault);
      container.removeEventListener('copy', preventDefault);
      container.removeEventListener('cut', preventDefault);
      container.removeEventListener('paste', preventDefault);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

    if (current < totalQuestions - 1) {
      setCurrent(current + 1);
      setTimeLeft(20);
      return;
    }

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
      <div className="max-w-xl mx-auto mt-20 p-16 bg-white rounded-3xl shadow-2xl text-center">
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

  if (current >= totalQuestions) {
    return <div className="text-center mt-20">Loading next question...</div>;
  }

  const q = quizData.questions[current];

  return (
    <div
      ref={quizContainerRef}
      className="max-w-3xl mx-auto mt-6 sm:mt-12 p-4 sm:p-12 bg-white rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <div
        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
        style={{ width: `${((current + 1) / totalQuestions) * 100}%` }}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
        <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
          Question {current + 1} of {totalQuestions}
        </span>
        <div
          className={`flex items-center gap-2 font-mono text-xl font-black ${
            timeLeft < 6 ? 'text-rose-500 animate-pulse' : 'text-slate-700'
          }`}
        >
          <Timer size={20} /> {timeLeft}s
        </div>
      </div>

      <h3 className="text-xl sm:text-3xl font-bold text-slate-900 leading-tight mb-8">
        {q.question}
      </h3>

      <div className="grid gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleNext(i)}
            disabled={submitting}
            className="w-full text-left p-4 sm:p-5 rounded-xl border-2 border-slate-100 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50 transition-all active:scale-[0.99] disabled:opacity-50 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700 group-hover:text-indigo-700">
                {opt}
              </span>
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}