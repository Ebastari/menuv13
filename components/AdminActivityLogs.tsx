
import React, { useEffect, useState } from 'react';

interface LogEntry {
  id?: number;
  timestamp: string;
  event: string;
  role: string;
  user: string;
  last_seen?: string;
  duration_sec?: number;
}

interface AdminActivityLogsProps {
  onClose: () => void;
}

const LOGO_URL = "https://i.ibb.co.com/pjNwjtj0/montana-AI-1-1.jpg";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxljQVpyYZjBpRdZ0J_sgMXkTHX-v8i7_nBVYmnG25oLxZkpfuns_HwUyspxA66Vkvm/exec";

export const AdminActivityLogs: React.FC<AdminActivityLogsProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'cloud' | 'local'>('local');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SCRIPT_URL}?sheet=ActivityLogs`, { cache: 'no-cache' });
      if (!res.ok) throw new Error("Cloud network error");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data.reverse());
        setSource('cloud');
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Cloud fetch failed, falling back to local vault:", e);
    }

    // Fallback ke local dengan peningkatan versi ke 2
    const request = indexedDB.open('MontanaVault', 2);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      console.log("Upgrading MontanaVault DB for Logs...");
      if (!db.objectStoreNames.contains('history')) {
        db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        console.log("Object store 'history' created for Logs.");
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('history')) {
        console.warn("Object store 'history' not available in Logs.");
        setLogs([]);
        setLoading(false);
        return;
      }

      try {
        const transaction = db.transaction(['history'], 'readonly');
        const store = transaction.objectStore('history');
        const getAll = store.getAll();
        
        getAll.onsuccess = () => {
          setLogs(getAll.result.reverse());
          setSource('local');
          setLoading(false);
        };

        getAll.onerror = () => {
          setLogs([]);
          setLoading(false);
        };
      } catch (err) {
        console.error("IDB Transaction failed in Logs:", err);
        setLogs([]);
        setLoading(false);
      }
    };

    request.onerror = (e) => {
      console.error("Vault DB Error:", e);
      setLoading(false);
      setLogs([]);
    };
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0m";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}d`;
    return `${mins}m ${secs}d`;
  };

  const stats = {
    total: logs.length,
    today: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length,
    adminCount: logs.filter(l => l.role === 'admin').length
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-50 dark:bg-slate-950 flex flex-col animate-fadeIn overflow-hidden">
      <header className="px-8 py-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-b dark:border-slate-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-[22px] flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-90 transition-all border border-black/5 dark:border-white/5"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Mission Control</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Admin Room</span>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">v4.5 PRO</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-5 py-2 rounded-2xl border text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${source === 'cloud' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'}`}>
             <div className="relative">
               <i className={`fas ${source === 'cloud' ? 'fa-cloud' : 'fa-database'}`}></i>
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
             </div>
             {source === 'cloud' ? 'Cloud Sync Active' : 'Local Vault Only'}
          </div>
          <button 
            onClick={fetchLogs}
            disabled={loading}
            className={`w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-all border border-black/5 dark:border-white/5 shadow-sm active:scale-90 ${loading ? 'opacity-50' : ''}`}
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 no-scrollbar bg-slate-50/50 dark:bg-black/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Activities</p>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{stats.total}</h3>
            <div className="mt-4 w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[44px] border border-emerald-500/20 shadow-xl shadow-emerald-500/5 dark:shadow-none flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Daily Logins</p>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{stats.today}</h3>
            <div className="mt-4 w-12 h-1 bg-emerald-500/20 rounded-full"></div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[44px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Elevated Access</p>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{stats.adminCount}</h3>
            <div className="mt-4 w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>
          <div className="p-10 border-b dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
                <i className="fas fa-list-ul"></i>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Session Activity Feed</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Monitoring Real-time</span>
            </div>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            {loading ? (
              <div className="p-32 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[28px] flex items-center justify-center mx-auto animate-spin">
                   <i className="fas fa-circle-notch text-emerald-500 text-3xl"></i>
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Synchronizing Master Database...</p>
              </div>
            ) : logs.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40">
                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity & Timeline</th>
                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Duration</th>
                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity Event</th>
                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {logs.map((log, idx) => (
                    <tr key={log.id || idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-[10px] uppercase shadow-lg group-hover:scale-110 transition-transform">
                            {log.user.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{log.user}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                              {new Date(log.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} @ {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-500">
                              <i className="fas fa-hourglass-half text-[10px]"></i>
                           </div>
                           <span className="text-[11px] font-black text-slate-900 dark:text-white tabular-nums">
                             {formatDuration(log.duration_sec)}
                           </span>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.15em] bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-black/5 dark:border-white/5">
                          {log.event}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${log.role === 'admin' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`}></div>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {log.last_seen ? new Date(log.last_seen).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-32 text-center space-y-8">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <i className="fas fa-database text-slate-200 dark:text-slate-800 text-4xl"></i>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Vault Empty</h4>
                  <p className="text-[11px] font-medium text-slate-300">No session activities detected on this cloud node.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="p-8 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex justify-between items-center">
         <div className="flex items-center gap-4">
           <img src={LOGO_URL} className="w-8 h-8 rounded-lg grayscale" alt="Montana" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Montana Intelligence Architecture</p>
         </div>
         <div className="flex items-center gap-3 px-6 py-2 bg-emerald-500/10 rounded-full">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Sync Protocol Enabled</p>
         </div>
      </footer>
    </div>
  );
};
