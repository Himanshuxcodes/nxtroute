import { useState, useEffect } from 'react';
import { Download, Trash2, Plus, ListFilter, Tag, Bookmark, Copy, Check } from 'lucide-react';
import API from '../api';
import RouteGenerator from './RouteGenerator';

export default function ProtocolDashboard() {
  const [tab, setTab] = useState('protocols');
  const [data, setData] = useState({ interviews: [], submissions: [] });
  const [filterCode, setFilterCode] = useState('ALL');
  const [isModalOpen, setModalOpen] = useState(false);
  const [copyingId, setCopyingId] = useState(null);

  const refresh = async () => {
    try {
      const res = await API.get('/data/stats');
      setData({ 
        interviews: res.data.allInterviews || [], 
        submissions: res.data.allSubmissions || [] 
      });
    } catch (e) {
      console.error("Dashboard Sync Error:", e);
    }
  };

  useEffect(() => { refresh(); }, []);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopyingId(id);
    setTimeout(() => setCopyingId(null), 2000);
  };

  const displayList = filterCode === 'ALL' 
    ? data.submissions 
    : data.submissions.filter(s => {
        if (!s.interviewCode) return false;
        return s.interviewCode.toString().trim().toUpperCase() === filterCode.toString().trim().toUpperCase();
      });

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    const path = type === 'protocol' ? `/protocol/${id}` : `/submission/${id}`;
    try {
      await API.delete(path);
      refresh();
    } catch (e) {
      alert("Action failed. Check server connection.");
    }
  };

  const downloadCSV = () => {
    const csvContent = "Candidate,Email,Protocol_Name,Protocol_Code,Score\n" + 
      displayList.map(s => `${s.candidateName},${s.candidateEmail},${s.interviewTitle},${s.interviewCode},${s.score}%`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Results_${filterCode}_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <div className="py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Admin Terminal</h1>
          <div className="flex gap-8 mt-8">
            <button 
              onClick={() => setTab('protocols')} 
              className={`pb-3 font-black text-sm uppercase tracking-widest transition-all ${tab === 'protocols' ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-slate-300'}`}
            >
              Protocols
            </button>
            <button 
              onClick={() => setTab('submissions')} 
              className={`pb-3 font-black text-sm uppercase tracking-widest transition-all ${tab === 'submissions' ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-slate-300'}`}
            >
              Submissions
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {tab === 'submissions' && (
            <div className="relative">
              <select 
                className="pl-12 pr-10 py-4 border-2 rounded-2xl font-black bg-white appearance-none outline-none focus:border-indigo-500 shadow-sm text-slate-700 cursor-pointer min-w-[220px]" 
                onChange={(e) => setFilterCode(e.target.value)}
                value={filterCode}
              >
                <option value="ALL">ALL ACTIVE LOGS</option>
                {data.interviews.map(i => (
                  <option key={i._id} value={i.accessCode}>
                    {i.accessCode} — {i.title.toUpperCase()}
                  </option>
                ))}
              </select>
              <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={20} />
            </div>
          )}
          
          <button 
            onClick={() => setModalOpen(true)} 
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl flex items-center gap-2"
          >
            <Plus size={18}/> New Protocol
          </button>

          {tab === 'submissions' && displayList.length > 0 && (
            <button 
              onClick={downloadCSV} 
              className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              <Download size={18}/> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-5 text-xs font-black uppercase text-slate-400">Identity & Context</th>
              <th className="px-6 py-5 text-xs font-black uppercase text-slate-400 text-right">Results & Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tab === 'protocols' ? (
              data.interviews.map(i => (
                <tr key={i._id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8">
                    <div className="font-black text-2xl text-slate-900 mb-1">{i.title}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-indigo-600 font-mono font-black text-lg bg-indigo-50 px-3 py-1 rounded-lg inline-block uppercase tracking-wider">
                        {i.accessCode}
                      </div>
                      <button 
                        onClick={() => copyCode(i.accessCode, i._id)}
                        className={`p-1.5 rounded-lg transition-all ${copyingId === i._id ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-600'}`}
                      >
                        {copyingId === i._id ? <Check size={16}/> : <Copy size={16}/>}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-right">
                    <button 
                      onClick={() => deleteItem('protocol', i._id)} 
                      className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={22}/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              displayList.map(s => (
                <tr key={s._id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8">
                    <div className="font-black text-3xl text-slate-900 mb-2 tracking-tighter uppercase italic">
                      {s.candidateName}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-slate-500 text-base font-bold flex items-center gap-2">
                        <Bookmark size={18} className="text-indigo-500" /> {s.interviewTitle || "Assessment Log"}
                      </div>
                      <div className="text-slate-400 text-xs font-black uppercase flex items-center gap-2 tracking-widest">
                        <Tag size={14} className="text-indigo-400" /> {s.interviewCode} • {s.candidateEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-right flex items-center justify-end gap-8">
                    <div className="text-right">
                      <div className={`text-5xl font-black ${s.score >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {s.score}%
                      </div>
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Final Performance</div>
                    </div>
                    <button 
                      onClick={() => deleteItem('submission', s._id)} 
                      className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={28}/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Empty state for desktop */}
        {((tab === 'protocols' && data.interviews.length === 0) || (tab === 'submissions' && displayList.length === 0)) && (
          <div className="py-24 text-center">
            <div className="text-slate-200 font-black uppercase tracking-[0.5em] text-lg">System Empty / No Matches</div>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {tab === 'protocols' ? (
          data.interviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No protocols created yet.</div>
          ) : (
            data.interviews.map(i => (
              <div key={i._id} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-xl">{i.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-indigo-600 font-mono font-bold text-sm bg-indigo-50 px-2 py-1 rounded-lg">{i.accessCode}</code>
                      <button onClick={() => copyCode(i.accessCode, i._id)} className="p-1 text-slate-400 hover:text-indigo-600">
                        {copyingId === i._id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                  <button onClick={() => deleteItem('protocol', i._id)} className="text-slate-300 hover:text-rose-500">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          displayList.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No submissions found for the selected filter.</div>
          ) : (
            displayList.map(s => (
              <div key={s._id} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-black text-2xl uppercase italic">{s.candidateName}</p>
                    <p className="text-sm text-slate-500 mt-1 break-all">{s.candidateEmail}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-mono">{s.interviewCode}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{s.interviewTitle}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-3xl font-black ${s.score >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>{s.score}%</div>
                    <button onClick={() => deleteItem('submission', s._id)} className="mt-2 text-slate-300 hover:text-rose-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <RouteGenerator 
          onCreated={() => { refresh(); }} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
}