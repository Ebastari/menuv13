
import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { MenuGrid } from './MenuGrid';
import { SeedlingSummary } from './SeedlingSummary';

interface LiteDashboardProps {
  role: 'admin' | 'guest' | 'none';
  onOpenDashboardAI: () => void;
  onOpenActivityLogs: () => void;
  onRequestLogin: () => void;
  language?: 'id' | 'en';
}

export const LiteDashboard: React.FC<LiteDashboardProps> = ({ 
  role, 
  onOpenDashboardAI, 
  onOpenActivityLogs, 
  onRequestLogin,
  language = 'id'
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItemsCount = MENU_ITEMS.filter(item => {
    const title = language === 'id' ? item.title : (item.titleEn || item.title);
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  }).length;

  return (
    <div className="animate-fadeIn space-y-12 pb-20">
      <div className="bg-emerald-600 dark:bg-emerald-600 rounded-[32px] p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight">{language === 'id' ? 'Mode Lite Aktif' : 'Lite Mode Active'}</h2>
          <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">{language === 'id' ? 'Navigasi Cepat & Efisien' : 'Fast & Efficient Navigation'}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
          <i className="fas fa-bolt-lightning text-xl"></i>
        </div>
      </div>

      {role === 'admin' && (
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">{language === 'id' ? 'Ringkasan Cepat' : 'Quick Summary'}</h3>
          <SeedlingSummary language={language} />
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">{language === 'id' ? 'Eksplorasi Fitur' : 'Feature Exploration'}</h3>
        <div className="relative group px-1">
          <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder={language === 'id' ? "Cari Menu..." : "Search Menu..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'id' ? 'Direktori Menu' : 'Menu Directory'}</h3>
            <span className="text-[10px] font-bold text-emerald-600">{filteredItemsCount} Item</span>
          </div>
          
          <MenuGrid 
            role={role} 
            onOpenDashboardAI={onOpenDashboardAI} 
            onOpenActivityLogs={onOpenActivityLogs} 
            onRequestLogin={onRequestLogin} 
            searchQuery={searchQuery}
            language={language}
          />
        </div>
      </div>

      <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
          {language === 'id' ? (
            <>{role === 'admin' ? 'Beberapa widget visual dinonaktifkan untuk kecepatan.' : 'Widget Dashboard Bibit hanya dapat diakses oleh Admin.'} <br/> Gunakan Pro Mode untuk fitur lengkap.</>
          ) : (
            <>{role === 'admin' ? 'Some visual widgets are disabled for speed.' : 'Seedling Dashboard is restricted to Admins.'} <br/> Use Pro Mode for full features.</>
          )}
        </p>
      </div>
    </div>
  );
};
