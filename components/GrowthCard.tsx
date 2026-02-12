
import React, { useMemo } from 'react';
import { GrowthLevel, UserProfile } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';

interface GrowthCardProps {
  currentSeconds: number;
  user?: UserProfile;
  isVerified?: boolean;
  language?: 'id' | 'en';
}

export const GrowthCard: React.FC<GrowthCardProps> = ({ currentSeconds, user, isVerified, language = 'id' }) => {
  const formattedTime = useMemo(() => {
    const days = Math.floor(currentSeconds / 86400);
    const hours = Math.floor((currentSeconds % 86400) / 3600);
    const minutes = Math.floor((currentSeconds % 3600) / 60);
    const seconds = currentSeconds % 60;
    
    if (language === 'en') {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    return `${days}h ${hours}j ${minutes}m ${seconds}d`;
  }, [currentSeconds, language]);

  const growthData = useMemo(() => {
    const rimbaThreshold = LEVEL_THRESHOLDS[GrowthLevel.RIMBA];
    const totalProgress = Math.min(100, Math.round((currentSeconds / rimbaThreshold) * 100));

    let currentLevel = GrowthLevel.SEMAI;
    if (currentSeconds >= LEVEL_THRESHOLDS[GrowthLevel.RIMBA]) currentLevel = GrowthLevel.RIMBA;
    else if (currentSeconds >= LEVEL_THRESHOLDS[GrowthLevel.POHON]) currentLevel = GrowthLevel.POHON;
    else if (currentSeconds >= LEVEL_THRESHOLDS[GrowthLevel.TIANG]) currentLevel = GrowthLevel.TIANG;
    else if (currentSeconds >= LEVEL_THRESHOLDS[GrowthLevel.PANCANG]) currentLevel = GrowthLevel.PANCANG;

    return { currentLevel, totalProgress };
  }, [currentSeconds]);

  const levels = [GrowthLevel.SEMAI, GrowthLevel.PANCANG, GrowthLevel.TIANG, GrowthLevel.POHON, GrowthLevel.RIMBA];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[52px] p-10 shadow-2xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-white/5 transition-all group relative overflow-hidden">
      <div className="absolute -right-24 -top-24 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[90px] group-hover:scale-125 transition-all duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="flex items-center gap-7">
            <div className="w-20 h-20 bg-emerald-600 rounded-[30px] flex items-center justify-center text-white text-4xl shadow-2xl group-hover:rotate-12 transition-all duration-700 ring-4 ring-emerald-500/10">
              <i className="fas fa-tree-deciduous"></i>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.5em] leading-none opacity-80">
                  {language === 'id' ? 'Status Ekosistem' : 'Ecosystem Status'}
                </h3>
                {isVerified && (
                  <span className="flex items-center gap-1 bg-emerald-500 text-white text-[7px] font-black px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                    <i className="fas fa-shield-check"></i> VERIFIED
                  </span>
                )}
              </div>
              <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-3">{growthData.currentLevel}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {language === 'id' ? 'Pengelola' : 'Managed By'}: <span className={isVerified ? "text-emerald-600 dark:text-emerald-400 font-black" : "italic"}>{isVerified ? user?.name : "Administrator"}</span>
              </p>
            </div>
          </div>
          <div className="text-right bg-slate-50 dark:bg-white/5 px-8 py-5 rounded-[32px] border border-black/[0.03] dark:border-white/5 shadow-inner">
            <p className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter leading-none tabular-nums drop-shadow-md">{formattedTime}</p>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 leading-none">
              {language === 'id' ? 'Waktu Aktif' : 'Active Runtime'}
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="relative pt-8">
            <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
              {levels.map((level, i) => (
                <div key={level} className="flex flex-col items-center">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 mb-2 ${growthData.currentLevel === level ? 'bg-emerald-500 scale-150 shadow-[0_0_8px_rgba(16,185,129,1)]' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                </div>
              ))}
            </div>

            <div className="relative h-5 w-full bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden shadow-inner ring-1 ring-black/5 dark:ring-white/5">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-400 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{ width: `${growthData.totalProgress}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>

            <div 
              className="absolute top-3.5 w-8 h-8 rounded-full bg-white dark:bg-slate-950 shadow-2xl border-[5px] border-emerald-500 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-20 flex items-center justify-center"
              style={{ left: `calc(${growthData.totalProgress}% - 16px)` }}
            >
               <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-2">
            {levels.map(level => (
               <span key={level} className={`transition-all duration-700 ${growthData.currentLevel === level ? 'text-emerald-600 dark:text-emerald-400 scale-110 drop-shadow-sm' : 'text-slate-300 dark:text-slate-600'}`}>
                 {level}
               </span>
            ))}
          </div>

          <div className="bg-slate-50/80 dark:bg-white/5 rounded-[44px] p-8 flex flex-col md:flex-row justify-between items-center gap-6 group-hover:bg-emerald-50/60 dark:group-hover:bg-white/[0.07] transition-all duration-500 border border-black/5 dark:border-white/5 shadow-inner">
            <div className="flex items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2 leading-none">
                  {language === 'id' ? 'Progres Global' : 'Global Progress'}
                </p>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                  <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{growthData.totalProgress}%</p>
                  <span className="text-emerald-500 text-sm font-black animate-bounce"><i className="fas fa-arrow-trend-up"></i></span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right space-y-4">
               <div className="inline-flex items-center gap-3 bg-emerald-500 text-white px-7 py-3 rounded-full shadow-2xl active:scale-95 transition-all">
                 <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                 <p className="text-[10px] font-black uppercase tracking-widest">
                   {language === 'id' ? 'Target 30 Hari' : '30-Day Target'}
                 </p>
               </div>
               <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-60">Environmentally Certified Engine v4.5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
