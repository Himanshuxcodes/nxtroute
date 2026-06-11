import { useState } from 'react';
import { Loader2, CheckCircle, Copy } from 'lucide-react';
import { RecruiterAPI } from '../api';

export default function RecruiterSignUp({ selectedPlan, onBack, onSignupComplete }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [step, setStep] = useState('form');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('payment');
  };

  const simulatePayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      const paymentToken = `nxtroute_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
      try {
        const res = await RecruiterAPI.post('/signup', {
          name: form.name,
          email: form.email,
          password: form.password,
          plan: selectedPlan.name.toLowerCase(),
          paymentToken
        });
        localStorage.setItem('recruiter_jwt', res.data.token);
        if (!res.data.recruiter.username) {
          localStorage.setItem('recruiter_needs_setup', 'true');
        }
        setToken(paymentToken);
        setStep('token');
      } catch (err) {
        alert('Signup failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    onSignupComplete();
  };

  if (step === 'token') {
    return (
      <div className="max-w-lg mx-auto mt-20 p-10 bg-white rounded-3xl shadow-2xl text-center">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-black">Payment Verified!</h2>
        <p className="text-slate-500 mt-2">Your recruiter account has been created.</p>
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border flex items-center justify-between">
          <code className="text-indigo-600 font-mono text-sm break-all">{token}</code>
          <button onClick={copyToken} className="p-2 hover:bg-slate-200 rounded-lg">
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-4">This is your payment reference token. Keep it for your records.</p>
        <button onClick={handleContinue} className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-black">
          Continue to Account Setup
        </button>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl shadow-2xl text-center">
        <h2 className="text-2xl font-black">Complete Payment</h2>
        <p className="text-slate-500 mt-2">{selectedPlan.name} – ₹{selectedPlan.price}/{selectedPlan.period}</p>
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
          <p className="text-sm text-slate-600">🔧 <strong>Demo mode:</strong> Click below to simulate payment verification.</p>
          <p className="text-xs text-slate-400 mt-2">For production, integrate Razorpay (free monthly, 2% transaction fee).</p>
        </div>
        <button onClick={simulatePayment} disabled={loading} className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Simulate Payment Verification'}
        </button>
        <button onClick={() => setStep('form')} className="mt-4 text-sm text-slate-400 hover:text-slate-600">← Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl">
      <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600 mb-4">← Back to plans</button>
      <h2 className="text-3xl font-black">Recruiter Sign Up</h2>
      <p className="text-slate-500 mb-6">Create your account to start assessing candidates</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700">Full Name</label>
          <input type="text" required className="w-full mt-1 p-3 border rounded-xl outline-none focus:border-indigo-500" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700">Email</label>
          <input type="email" required className="w-full mt-1 p-3 border rounded-xl outline-none focus:border-indigo-500" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700">Password</label>
          <input type="password" required className="w-full mt-1 p-3 border rounded-xl outline-none focus:border-indigo-500" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-sm font-bold">Selected Plan:</p>
          <p className="text-indigo-600 font-black">{selectedPlan.name} – ₹{selectedPlan.price}/{selectedPlan.period}</p>
        </div>
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black">Proceed to Payment</button>
      </form>
    </div>
  );
}