import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ClipboardList, Copy, Trash2, Users, Layout, XCircle } from 'lucide-react';
import RouteGenerator from './RouteGenerator';

export default function ProtocolDashboard() {
  const [activeTab, setActiveTab] = useState('interviews'); // 'interviews' or 'submissions'
  const [interviews, setInterviews] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  // 1. Fetch data for both interviews and submissions
  const fetchData = async () => {
    try {
      const interviewRes = await axios.get('http://localhost:5000/api/interviews/data/stats');
      setInterviews(interviewRes.data.allInterviews || []);
      
      const submissionRes = await axios.get('http://localhost:5000/api/interviews/data/submissions');
      setSubmissions(submissionRes.data || []);
    } catch (e) { 
      console.error("Sync Error", e); 
    }
  };

  // 2. Handle single submission deletion
  const handleDeleteSubmission = async (id) => {
    if (!window.confirm("Delete this candidate's record?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/interviews/submission/${id}`);
      fetchData(); 
    } catch (e) { 
      alert("Delete failed"); 
    }
  };

  // 3. Purge all records (Interviews and Submissions)
  const handlePurge = async () => {
    if (!window.confirm("Permanently delete all interview records and submissions?")) return;
    try {
      await axios.delete('http://localhost:5000/api/interviews/purge');
      fetchData();
    } catch (e) { 
      alert("Purge failed."); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  return (
    <div className="pb-20 animate-in fade-in duration-700">
      {/* Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Management</h1>
          <div className="flex gap-6 mt-6">
            <button 
              onClick={() => setActiveTab('interviews')}
              className={`flex items-center gap-2 pb-2 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'interviews' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Layout size={16} /> Active Interviews
            </button>
            <button 
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center gap-2 pb-2 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'submissions' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Users size={16} /> Candidate Results
            </button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handlePurge} 
            title="Purge All Data"
            className="p-3 text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all bg-white shadow-sm"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={18} /> Create Interview
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            {activeTab === 'interviews' ? (
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Interview Title</th>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Target Roles</th>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Access Key</th>
              </tr>
            ) : (
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Candidate Details</th>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Assessment</th>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Final Score</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeTab === 'interviews' ? (
              // Interviews Tab Content
              interviews.length > 0 ? interviews.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <ClipboardList size={16}/>
                      </div>
                      <span className="font-semibold text-slate-900">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      {item.targetRoles?.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase border border-indigo-100">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(item.accessCode);
                        alert("Key Copied!");
                      }} 
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    >
                      {item.accessCode} <Copy size={10} className="inline ml-1 opacity-40"/>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-8 py-12 text-center text-slate-400 italic">No active interviews found.</td>
                </tr>
              )
            ) : (
              // Submissions Tab Content
              submissions.length > 0 ? submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-semibold text-slate-900">{sub.candidateName}</p>
                    <p className="text-xs text-slate-400">{sub.candidateEmail}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-600 font-medium">{sub.interviewTitle}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span className={`px-4 py-2 rounded-full font-bold text-xs border ${
                        sub.score >= 70 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {sub.score}%
                      </span>
                      <button 
                        onClick={() => handleDeleteSubmission(sub._id)}
                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                        title="Delete Record"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-8 py-12 text-center text-slate-400 italic">No candidate results logged yet.</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Create Interview Modal */}
      {isModalOpen && (
        <RouteGenerator 
          onClose={() => { 
            setModalOpen(false); 
            fetchData(); 
          }} 
        />
      )}
    </div>
  );
}