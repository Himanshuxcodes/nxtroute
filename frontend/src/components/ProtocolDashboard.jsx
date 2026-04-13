import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Download, Plus, Layout, Users, Mail, Award, Loader2, Copy, CheckCircle, ClipboardList } from 'lucide-react';
import RouteGenerator from './RouteGenerator';

export default function ProtocolDashboard() {
  const [activeTab, setActiveTab] = useState('interviews');
  const [data, setData] = useState({ interviews: [], submissions: [] });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProtocolId, setSelectedProtocolId] = useState('all');
  const [copiedKey, setCopiedKey] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/interviews/data/stats');
      setData({ 
        interviews: Array.isArray(res.data.allInterviews) ? res.data.allInterviews : [], 
        submissions: Array.isArray(res.data.allSubmissions) ? res.data.allSubmissions : [] 
      });
    } catch (e) { console.error("Sync Failed"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- NEW DOWNLOAD LOGIC ---
  const downloadCSV = () => {
    const csvRows = [
      ["Candidate Name", "Email", "Protocol", "Score", "Wrongs", "Date"], // Headers
      ...data.submissions.map(s => [
        s.candidateName,
        s.candidateEmail,
        s.interviewTitle,
        `${s.score}%`,
        s.wrongAnswers || 0,
        new Date(s.submittedAt).toLocaleDateString()
      ])
    ];

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions_export_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(code);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/interviews/${type}/${id}`);
      fetchData();
    } catch (e) { alert("Error deleting record"); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Terminal Admin</h1>
          <div className="flex gap-8 mt-6">
            <button onClick={() => setActiveTab('interviews')} className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'interviews' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>
              <Layout size={16}/> Protocols
            </button>
            <button onClick={() => setActiveTab('submissions')} className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'submissions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>
              <Users size={16}/> Submissions
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          {/* ADDED DOWNLOAD BUTTON BACK */}
          {activeTab === 'submissions' && data.submissions.length > 0 && (
            <button 
              onClick={downloadCSV}
              className="p-4 text-slate-400 hover:text-indigo-600 border-2 border-slate-100 rounded-2xl transition-all bg-white hover:border-indigo-100 shadow-sm"
              title="Export to CSV"
            >
              <Download size={20} />
            </button>
          )}

          {activeTab === 'submissions' && (
            <select 
              value={selectedProtocolId} 
              onChange={(e)=>setSelectedProtocolId(e.target.value)} 
              className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-xs outline-none focus:border-indigo-500 transition-all shadow-sm"
            >
              <option value="all">All Protocols</option>
              {data.interviews.map(i => (
                <option key={i._id} value={i._id}>{i.title} ({i.accessCode})</option>
              ))}
            </select>
          )}
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg">
            <Plus size={20} /> Create
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail</th>
              {activeTab === 'submissions' && <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>}
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Metrics / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan="3" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" /></td></tr>
            ) : (
              activeTab === 'interviews' ? (
                data.interviews.map(item => (
                  <tr key={item._id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-8">
                      <div className="font-bold text-slate-900 text-lg">{item.title}</div>
                      <div onClick={() => handleCopy(item.accessCode)} className="text-xs mt-1 flex items-center gap-2 cursor-pointer w-fit">
                        <span className={`font-black px-2 py-0.5 rounded transition-all ${copiedKey === item.accessCode ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                          {item.accessCode}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button onClick={() => handleDelete('protocol', item._id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all">
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                data.submissions.filter(s => selectedProtocolId === 'all' || s.interviewId === selectedProtocolId).map(sub => (
                  <tr key={sub._id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-8">
                      <div className="font-bold text-slate-900">{sub.candidateName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12}/> {sub.candidateEmail}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <ClipboardList size={14} className="text-indigo-400" />
                        <span className="text-sm font-bold text-slate-600">{sub.interviewTitle}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-xl font-black text-slate-900">{sub.score}%</span>
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">{sub.wrongAnswers || 0} Wrongs</span>
                        </div>
                        <button onClick={() => handleDelete('submission', sub._id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && <RouteGenerator onClose={() => { setModalOpen(false); fetchData(); }} />}
    </div>
  );
}