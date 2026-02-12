
import React, { useState, useEffect, useMemo } from 'react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby09rbjwN2EcVRwhsNBx8AREI7k41LY1LrZ-W4U36HmzMB5BePD9h8wBSVPJwa_Ycduvw/exec";
const CACHE_KEY = "montana_seedling_cache_v6";

interface BibitRow {
  tanggal: Date;
  bibit: string;
  masuk: number;
  keluar: number;
  mati: number;
  sumber: string;
  tujuan: string;
}

interface SeedlingSummaryProps {
  language?: 'id' | 'en';
}

export const SeedlingSummary: React.FC<SeedlingSummaryProps> = ({ language = 'id' }) => {
  const [rawData, setRawData] = useState<BibitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeCard, setActiveCard] = useState<'masuk' | 'keluar' | 'jenis' | 'produksi' | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const normalized = parsed.map((r: any) => ({
          ...r,
          tanggal: new Date(r.tanggal)
        }));
        setRawData(normalized);
        setLoading(false);
      } catch (e) {
        console.error("Cache corrupted");
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`${SCRIPT_URL}?sheet=Bibit`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      
      const json = await res.json();
      const rows = Array.isArray(json) ? json : (json.Bibit || []);
      
      const normalized = rows.map((r: any) => ({
        tanggal: new Date(r.Tanggal || r.tanggal),
        bibit: (r.Bibit || r.jenis || '').toString().trim(),
        masuk: parseInt(r.Masuk || r.masuk || 0),
        keluar: parseInt(r.Keluar || r.keluar || 0),
        mati: parseInt(r.Mati || r.mati || 0),
        sumber: (r.Sumber || r.sumber || '').toString().trim(),
        tujuan: (r.Tujuan || r.tujuan || '').toString().trim()
      })).filter((r: any) => !isNaN(r.tanggal.getTime()) && r.bibit !== "");

      if (normalized.length > 0) {
        setRawData(normalized);
        localStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
      }
    } catch (err) {
      console.warn("Sync failed:", err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  const analytics = useMemo(() => {
    const masukByBibit: Record<string, number> = {};
    const keluarByBibit: Record<string, number> = {};
    const stokByBibit: Record<string, number> = {};
    const sources: Record<string, number> = { Internal: 0, Eksternal: 0 };
    let totalIn = 0, totalOut = 0, totalDead = 0;

    rawData.forEach(r => {
      totalIn += r.masuk;
      totalOut += r.keluar;
      totalDead += r.mati;
      stokByBibit[r.bibit] = (stokByBibit[r.bibit] || 0) + r.masuk - r.keluar - r.mati;
      if (r.masuk > 0) {
        masukByBibit[r.bibit] = (masukByBibit[r.bibit] || 0) + r.masuk;
        const s = r.sumber.toLowerCase();
        const isInternal = s.includes('pembibitan') || s.includes('nursery') || s.includes('montana') || s.includes('ebl') || s === 'internal';
        if (isInternal) sources.Internal += r.masuk;
        else sources.Eksternal += r.masuk;
      }
      if (r.keluar > 0) keluarByBibit[r.bibit] = (keluarByBibit[r.bibit] || 0) + r.keluar;
    });

    Object.keys(stokByBibit).forEach(k => { if (stokByBibit[k] < 0) stokByBibit[k] = 0; });

    return { 
      totalIn, totalOut, totalDead, sources,
      masukByBibit: Object.entries(masukByBibit).sort((a, b) => b[1] - a[1]),
      keluarByBibit: Object.entries(keluarByBibit).sort((a, b) => b[1] - a[1]),
      stokByBibit: Object.entries(stokByBibit).sort((a, b) => b[1] - a[1])
    };
  }, [rawData]);

  const totalCurrentStok = analytics.totalIn - analytics.totalOut - analytics.totalDead;

  if (loading && rawData.length === 0) return (
    <div className="w-full h-48 bg-white dark:bg-slate-900 rounded-[44px] animate-pulse flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-800">
      <i className="fas fa-sync fa-spin text-emerald-600 mb-4 text-xl"></i>
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
        {language === 'id' ? 'Menghubungkan Data Apps Script...' : 'Connecting to Apps Script...'}
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <h3 className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.4em] mb-2 leading-none">{language === 'id' ? 'Mesin Data Real-Time' : 'Real-Time Data Engine'}</h3>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{language === 'id' ? 'Dashboard Performa' : 'Performance Dashboard'}</p>
        </div>
        <button 
          onClick={() => fetchData()}
          disabled={isSyncing}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm active:scale-95 transition-all"
        >
          <i className={`fas ${isSyncing ? 'fa-sync fa-spin' : 'fa-rotate'}`}></i>
          {isSyncing ? (language === 'id' ? 'Sinkronisasi...' : 'Syncing...') : (language === 'id' ? 'Segarkan Data' : 'Refresh Data')}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setActiveCard(activeCard === 'masuk' ? null : 'masuk')}
          className={`text-left p-6 rounded-[38px] border-2 transition-all active:scale-[0.98] ${activeCard === 'masuk' ? 'bg-emerald-600 border-emerald-500 shadow-2xl scale-105' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 shadow-sm'}`}
        >
          <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${activeCard === 'masuk' ? 'text-white/80' : 'text-slate-900 dark:text-slate-400'}`}>
            {language === 'id' ? 'Realisasi Masuk' : 'Total Inflow'}
          </p>
          <h4 className={`text-3xl font-black tracking-tighter tabular-nums ${activeCard === 'masuk' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            +{analytics.totalIn.toLocaleString()}
          </h4>
          <p className={`text-[8px] font-black mt-2 uppercase tracking-tighter ${activeCard === 'masuk' ? 'text-white/60' : 'text-emerald-600'}`}>
            {language === 'id' ? 'Klik untuk Detail' : 'Click for Details'}
          </p>
        </button>

        <button 
          onClick={() => setActiveCard(activeCard === 'keluar' ? null : 'keluar')}
          className={`text-left p-6 rounded-[38px] border-2 transition-all active:scale-[0.98] ${activeCard === 'keluar' ? 'bg-slate-900 border-slate-800 shadow-2xl scale-105' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-orange-500/30 shadow-sm'}`}
        >
          <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${activeCard === 'keluar' ? 'text-white/80' : 'text-slate-900 dark:text-slate-400'}`}>
            {language === 'id' ? 'Realisasi Keluar' : 'Total Outflow'}
          </p>
          <h4 className={`text-3xl font-black tracking-tighter tabular-nums ${activeCard === 'keluar' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            -{analytics.totalOut.toLocaleString()}
          </h4>
          <p className={`text-[8px] font-black mt-2 uppercase tracking-tighter ${activeCard === 'keluar' ? 'text-white/60' : 'text-orange-600'}`}>
            {language === 'id' ? 'Klik untuk Detail' : 'Click for Details'}
          </p>
        </button>

        <button 
          onClick={() => setActiveCard(activeCard === 'jenis' ? null : 'jenis')}
          className={`text-left p-6 rounded-[38px] border-2 transition-all active:scale-[0.98] ${activeCard === 'jenis' ? 'bg-blue-600 border-blue-500 shadow-2xl scale-105' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 shadow-sm'}`}
        >
          <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${activeCard === 'jenis' ? 'text-white/80' : 'text-slate-900 dark:text-slate-400'}`}>
            {language === 'id' ? 'Total Stok Aktif' : 'Active Stock'}
          </p>
          <h4 className={`text-3xl font-black tracking-tighter tabular-nums ${activeCard === 'jenis' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {totalCurrentStok.toLocaleString()}
          </h4>
          <p className={`text-[8px] font-black mt-2 uppercase tracking-tighter ${activeCard === 'jenis' ? 'text-white/60' : 'text-blue-600'}`}>
            {language === 'id' ? 'Klik Daftar Bibit' : 'View Seed List'}
          </p>
        </button>

        <button 
          onClick={() => setActiveCard(activeCard === 'produksi' ? null : 'produksi')}
          className={`text-left p-6 rounded-[38px] border-2 transition-all active:scale-[0.98] ${activeCard === 'produksi' ? 'bg-purple-600 border-purple-500 shadow-2xl scale-105' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-purple-500/30 shadow-sm'}`}
        >
          <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${activeCard === 'produksi' ? 'text-white/80' : 'text-slate-900 dark:text-slate-400'}`}>
            {language === 'id' ? 'Produksi Bibit' : 'Seed Production'}
          </p>
          <div className="flex items-baseline gap-1">
             <h4 className={`text-2xl font-black tracking-tighter ${activeCard === 'produksi' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {Math.round((analytics.sources.Internal / (analytics.totalIn || 1)) * 100)}%
             </h4>
             <span className={`text-[8px] font-bold ${activeCard === 'produksi' ? 'text-white/70' : 'text-slate-500'}`}>{language === 'id' ? 'Internal' : 'Internal'}</span>
          </div>
          <p className={`text-[8px] font-black mt-2 uppercase tracking-tighter ${activeCard === 'produksi' ? 'text-white/60' : 'text-purple-600'}`}>
            {language === 'id' ? 'Breakdown Sumber' : 'Source Breakdown'}
          </p>
        </button>
      </div>

      {activeCard && (
        <div className="animate-drift-puff bg-white dark:bg-slate-900 rounded-[48px] p-8 border-2 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                        <i className={`fas ${activeCard === 'masuk' ? 'fa-arrow-down-long' : activeCard === 'keluar' ? 'fa-arrow-up-long' : activeCard === 'jenis' ? 'fa-boxes-stacked' : 'fa-industry'}`}></i>
                    </div>
                    <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                        {activeCard === 'masuk' ? (language === 'id' ? 'Rincian Bibit Masuk' : 'Inflow Breakdown') : 
                         activeCard === 'keluar' ? (language === 'id' ? 'Rincian Bibit Keluar' : 'Outflow Breakdown') : 
                         activeCard === 'jenis' ? (language === 'id' ? 'Daftar Stok Berjalan' : 'Running Stock List') : 
                         (language === 'id' ? 'Audit Sumber Pasokan' : 'Supply Source Audit')}
                    </h5>
                </div>
                <button onClick={() => setActiveCard(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                    <i className="fas fa-times-circle text-2xl"></i>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                {(activeCard === 'masuk' || activeCard === 'keluar' || activeCard === 'jenis') && (
                    (activeCard === 'masuk' ? analytics.masukByBibit : activeCard === 'keluar' ? analytics.keluarByBibit : analytics.stokByBibit).map(([name, val], i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-black/5 dark:border-white/5 transition-all hover:border-emerald-500/30 group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-emerald-600 group-hover:scale-110 transition-transform">
                                    {i + 1}
                                </div>
                                <span className="text-[12px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">{name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[14px] font-black text-slate-900 dark:text-white tabular-nums">
                                    {val.toLocaleString()}
                                </span>
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Seeds</p>
                            </div>
                        </div>
                    ))
                )}

                {activeCard === 'produksi' && (
                    <>
                        <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center text-center gap-4">
                             <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-xl">
                                <i className="fas fa-house-chimney"></i>
                             </div>
                             <div>
                                <h6 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{language === 'id' ? 'Internal (Pembibitan)' : 'Internal (Nursery)'}</h6>
                                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{analytics.sources.Internal.toLocaleString()}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">Nursery Montana Node</p>
                             </div>
                        </div>
                        <div className="p-8 bg-purple-50 dark:bg-purple-950/20 rounded-3xl border border-purple-100 dark:border-purple-900/30 flex flex-col items-center text-center gap-4">
                             <div className="w-16 h-16 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-2xl shadow-xl">
                                <i className="fas fa-truck-ramp-box"></i>
                             </div>
                             <div>
                                <h6 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">{language === 'id' ? 'Eksternal (Supplier)' : 'External (Supplier)'}</h6>
                                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{analytics.sources.Eksternal.toLocaleString()}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">Vendor & Strategic Partners</p>
                             </div>
                        </div>
                    </>
                )}
            </div>
        </div>
      )}

      <div className="bg-slate-900 dark:bg-emerald-950/20 p-8 rounded-[44px] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[24px] bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-xl">
                <i className="fas fa-warehouse"></i>
              </div>
              <div>
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">{language === 'id' ? 'Stok Inventaris Bersih (Net)' : 'Net Inventory Stock'}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {totalCurrentStok.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{language === 'id' ? 'Bibit Tersedia' : 'Available Seeds'}</span>
                </div>
              </div>
          </div>
          <div className="relative z-10 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
             <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">Safety Stock Level</p>
             <div className="flex items-center gap-2">
                <div className="h-1.5 w-32 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-[10px] font-black text-white">85%</span>
             </div>
          </div>
      </div>
    </div>
  );
};
