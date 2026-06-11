import { Check } from 'lucide-react';

export default function PricingPlans({ onSelectPlan }) {
  const plans = [
    {
      name: 'Monthly',
      price: 120,
      period: 'month',
      features: ['Unlimited assessments', 'AI question generation', 'Candidate analytics', 'Email support'],
      recommended: false,
    },
    {
      name: 'Yearly',
      price: 999,
      period: 'year',
      features: ['Everything in Monthly', 'Save ₹441 (30% off)', 'Priority support', 'Custom branding'],
      recommended: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900">Choose your plan</h2>
        <p className="text-slate-500 mt-2">Start conducting AI‑powered technical interviews today</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all hover:shadow-2xl ${
              plan.recommended ? 'border-indigo-500 scale-105 md:scale-110' : 'border-slate-100'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-black px-4 py-1 rounded-full">
                BEST VALUE
              </div>
            )}
            <div className="p-8">
              <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-black text-indigo-600">₹{plan.price}</span>
                <span className="text-slate-400 font-medium">/{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate-600">
                    <Check size={18} className="text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSelectPlan(plan)}
                className="w-full mt-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all bg-slate-900 text-white hover:bg-indigo-600"
              >
                Choose {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}