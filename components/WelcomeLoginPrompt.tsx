
import React from 'react';

interface WelcomeLoginPromptProps {
  onRequestLogin: () => void;
  language?: 'id' | 'en';
}

export const WelcomeLoginPrompt: React.FC<WelcomeLoginPromptProps> = ({ onRequestLogin, language = 'id' }) => {
  return (
    <div className="relative group animate-fadeIn mb-8 px-2">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 rounded-[48px] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>
      
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[44px] p-8 md:p-12 border border-white/50 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-10 overflow-hidden">
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
        
        <div className="relative shrink-0">
          <div className="w-24 h-24 bg-slate-950 dark:bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-all duration-500 ring-4 ring-white/10">
            <i className="fas fa-shield-halved text-white text-4xl"></i>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce">
            <i className="fas fa-key text-emerald-500 text-[10px]"></i>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              {language === 'id' ? 'Akses Publik Terbatas' : 'Limited Public Access'}
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            {language === 'id' ? (
              <>Selamat Datang di <br className="hidden md:block"/><span className="text-emerald-600">Montana AI Pro</span></>
            ) : (
              <>Welcome to <br className="hidden md:block"/><span className="text-emerald-600">Montana AI Pro</span></>
            )}
          </h2>
          <p className="text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
            {language === 'id' ? 'Aktifkan Montana ID Anda untuk membuka dashboard analisis penuh, manajemen roster tim, dan monitoring inventaris bibit secara real-time.' : 'Activate your Montana ID to unlock the full analytical dashboard, team roster management, and real-time seedling inventory monitoring.'}
          </p>
        </div>

        <div className="shrink-0 relative z-10 w-full md:w-auto">
          <button 
            onClick={onRequestLogin}
            className="w-full md:w-auto px-12 py-6 bg-slate-950 dark:bg-emerald-600 text-white rounded-[28px] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group/btn"
          >
            <span>{language === 'id' ? 'Aktivasi Akses' : 'Activate Access'}</span>
            <i className="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
