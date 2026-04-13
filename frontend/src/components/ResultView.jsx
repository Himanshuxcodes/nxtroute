<td className="px-8 py-5 text-right">
  <div className="flex items-center justify-end gap-4">
    <div className="flex flex-col items-end">
      <span className={`px-4 py-1.5 rounded-full font-black text-xs border ${
        sub.score >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
      }`}>
        {sub.score}%
      </span>
      {/* Mini metric for context */}
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">
        {sub.wrongAnswers} Errors / {sub.totalQuestions} Qs
      </span>
    </div>
    {/* Delete button remains here */}
  </div>
</td>