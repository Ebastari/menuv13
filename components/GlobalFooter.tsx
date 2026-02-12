
import React from 'react';

const LOGO_URL = "https://i.ibb.co.com/pjNwjtj0/montana-AI-1-1.jpg";

interface GlobalFooterProps {
  onOpenMontanaProfile?: () => void;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ onOpenMontanaProfile }) => {
  return (
    <footer className="w-full pt-24 pb-16 px-6 relative z-10">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Decorative Quote Section */}
        <div className="flex flex-col items-center mb-12 group">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-slate-200 dark:to-slate-800 mb-6"></div>
          <p className="text-[12px] md:text-[14px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.8em] transition-all group-hover:tracking-[1em] duration-1000">
            “Urip kudu urup.”
          </p>
          <div className="w-px h-6 bg-gradient-to-t from-transparent to-slate-200 dark:to-slate-800 mt-6"></div>
        </div>

        {/* Brand Integration Section */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[40px] p-10 w-full shadow-sm ring-1 ring-black/5 flex flex-col items-center gap-8 transition-all hover:shadow-xl">
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-3">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-60">Strategic Partner</p>
              <a 
                href="https://hasnurgroup.com/page/our-business/energy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[11px] font-bold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors uppercase tracking-tight"
              >
                PT Energi Batubara Lestari
              </a>
            </div>

            <div className="h-px w-8 md:w-px md:h-8 bg-slate-200 dark:bg-slate-800"></div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img 
                  src={LOGO_URL} 
                  alt="Montana Logo" 
                  className="w-12 h-12 rounded-2xl grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700 shadow-lg" 
                />
                <div className="absolute -inset-2 bg-emerald-500/5 blur-xl -z-10 rounded-full"></div>
              </div>
            </div>

            <div className="h-px w-8 md:w-px md:h-8 bg-slate-200 dark:bg-slate-800"></div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-60">Developer Entity</p>
              <button 
                onClick={onOpenMontanaProfile}
                className="text-[11px] font-bold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors uppercase tracking-tight"
              >
                PT Montana Wana Teknologi
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-800 to-transparent"></div>

          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
              Hak Cipta © 2026 PT Montana Wana Teknologi
            </p>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 px-4 py-1.5 rounded-full border border-black/5 dark:border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Integrated Environment Management System • v4.5.0
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Policy Link */}
        <div className="mt-12">
          <a 
            href="/privacy-policy.html" 
            className="text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-[0.4em] transition-all hover:tracking-[0.5em]"
          >
            Kebijakan Privasi
          </a>
        </div>

      </div>
    </footer>
  );
};
