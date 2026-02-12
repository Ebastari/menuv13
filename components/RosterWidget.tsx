
import React, { useState, useMemo, useEffect } from 'react';
import { ROSTER_TEAM, ROSTER_START_DATE, ShiftType } from '../data/rosterData';

export const RosterWidget: React.FC = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'today' | 'full'>('today');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // LOGIKA UTAMA: Infinite Modular Cycle
  // Menghitung index berdasarkan selisih hari dari ROSTER_START_DATE (26 Jan 2026)
  // menggunakan modulo length array shifts agar otomatis looping selamanya.
  const getIndexForDate = (date: Date, shiftArray: ShiftType[]) => {
    const start = new Date(ROSTER_START_DATE);
    start.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Gunakan modulo agar data 31 hari berulang terus menerus
    const cycleLength = shiftArray.length;
    let index = diffDays % cycleLength;
    if (index < 0) index += cycleLength; // Handle tanggal sebelum start_date
    return index;
  };

  const displayedDateLabel = useMemo(() => {
    return currentDate.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }, [currentDate]);

  const teamWithCurrentShift = useMemo(() => {
    return ROSTER_TEAM.map(person => ({
      ...person,
      currentShift: person.shifts[getIndexForDate(currentDate, person.shifts)]
    }));
  }, [currentDate]);

  const stats = useMemo(() => {
    return {
      d: teamWithCurrentShift.filter(p => p.currentShift === 'D').length,
      thr: teamWithCurrentShift.filter(p => p.currentShift === 'THR').length,
      off: teamWithCurrentShift.filter(p => p.currentShift === 'OFF').length,
      total: teamWithCurrentShift.length
    };
  }, [teamWithCurrentShift]);

  const filteredTeam = teamWithCurrentShift.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase()) || 
    p.jabatan.toLowerCase().includes(search.toLowerCase())
  );

  // Generate 31 hari dari tanggal hari ini untuk tabel "Full Schedule"
  const calendarDays = useMemo(() => {
    const days = [];
    const base = new Date(currentDate);
    // Kita mulai tampilkan dari awal bulan ini agar UI lebih natural
    const startOfMonth = new Date(base.getFullYear(), base.getMonth(), 1);
    
    for (let i = 0; i < 31; i++) {
      const d = new Date(startOfMonth);
      d.setDate(startOfMonth.getDate() + i);
      days.push({
        date: d,
        label: d.getDate(),
        isToday: d.toDateString() === currentDate.toDateString()
      });
    }
    return days;
  }, [currentDate]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getShiftColorClass = (shift: ShiftType) => {
    switch (shift) {
      case 'D': return 'bg-emerald-600 text-white shadow-emerald-500/20';
      case 'THR': return 'bg-orange-600 text-white shadow-orange-500/20';
      case 'OFF': return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8 animate-drift-puff">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Tim <span className="text-emerald-600">Revegetasi</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mt-2">{displayedDateLabel}</p>
          </div>
          <div className="relative group">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-600 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Cari personil tim..." 
              value={search}
              onChange={(e) => setSearch(search)}
              className="pl-11 pr-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-[12px] font-bold focus:ring-2 focus:ring-emerald-500/40 outline-none w-full md:w-72 transition-all text-slate-900 dark:text-white shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Shift Siang', val: stats.d, color: 'emerald' },
            { label: 'Tahura-DAS', val: stats.thr, color: 'orange' },
            { label: 'Total Crew', val: stats.total, color: 'slate' },
            { label: 'Libur (OFF)', val: stats.off, color: 'rose' }
          ].map(s => (
            <div key={s.label} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-sm`}>
              <p className={`text-${s.color}-700 dark:text-${s.color}-400 text-[10px] font-bold uppercase tracking-widest mb-2 leading-none`}>{s.label}</p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{s.val}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-8 border-b border-slate-300 dark:border-slate-800 px-4">
        <button onClick={() => setView('today')} className={`pb-4 text-[12px] font-bold uppercase tracking-widest transition-all relative ${view === 'today' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
          Hari Ini
          {view === 'today' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full animate-fadeIn"></div>}
        </button>
        <button onClick={() => setView('full')} className={`pb-4 text-[12px] font-bold uppercase tracking-widest transition-all relative ${view === 'full' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
          Seluruh Jadwal (Cycle)
          {view === 'full' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full animate-fadeIn"></div>}
        </button>
      </div>

      {view === 'today' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredTeam.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedMemberId(selectedMemberId === p.id ? null : p.id)}
              className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:rotate-6 transition-transform" style={{ backgroundColor: p.color }}>
                {getInitials(p.nama)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-[15px] truncate">{p.nama}</h4>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest mt-1 truncate">{p.jabatan}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${getShiftColorClass(p.currentShift)}`}>
                {p.currentShift}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700">
                  <th className="p-6 text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest sticky left-0 bg-slate-100 dark:bg-slate-800 z-10 border-r dark:border-slate-700">Anggota Tim</th>
                  {calendarDays.map((day, i) => (
                    <th key={i} className={`p-4 text-[10px] font-black text-center min-w-[55px] ${day.isToday ? 'text-emerald-600 bg-emerald-500/10' : 'text-slate-600 dark:text-slate-400'}`}>
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredTeam.map((p, idx) => (
                  <tr key={p.id} className={`${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50 dark:bg-white/[0.03]'} hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors`}>
                    <td className="p-6 sticky left-0 bg-inherit z-10 border-r border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: p.color }}>{getInitials(p.nama)}</div>
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase truncate max-w-[120px]">{p.nama}</p>
                      </div>
                    </td>
                    {calendarDays.map((day, i) => {
                      const shift = p.shifts[getIndexForDate(day.date, p.shifts)];
                      return (
                        <td key={i} className={`p-4 text-center ${day.isToday ? 'bg-emerald-500/10' : ''}`}>
                          <span className={`text-[10px] font-black ${shift === 'D' ? 'text-emerald-700 dark:text-emerald-400' : (shift === 'THR' ? 'text-orange-700 dark:text-orange-400' : 'text-slate-400 dark:text-slate-600')}`}>
                            {shift}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
