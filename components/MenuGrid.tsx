
import React, { useEffect, useState, useMemo } from 'react';
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';

interface MenuGridProps {
  role: 'admin' | 'guest' | 'none';
  onOpenDashboardAI: () => void;
  onOpenActivityLogs: () => void;
  onRequestLogin: () => void;
  searchQuery?: string;
  language?: 'id' | 'en';
}

const GUEST_ALLOWED_IDS = [
  'carbon', 
  'height', 
  'weather', 
  'download-1', 
  'download-2', 
  'report-seed', 
  'docs-rr', 
  'notif-bibit', 
  'about-app'
];

export const MenuGrid: React.FC<MenuGridProps> = ({ role, onOpenDashboardAI, onOpenActivityLogs, onRequestLogin, searchQuery = '', language = 'id' }) => {
  const [visibleItemsCount, setVisibleItemsCount] = useState<number>(0);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const title = language === 'id' ? item.title : (item.titleEn || item.title);
      return title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, language]);

  useEffect(() => {
    setVisibleItemsCount(0);
    const interval = setInterval(() => {
      setVisibleItemsCount(prev => {
        if (prev >= filteredItems.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [filteredItems]);
  
  const hasAccess = (itemId: string) => {
    if (role === 'admin') return true;
    if (role === 'guest' && GUEST_ALLOWED_IDS.includes(itemId)) return true;
    return false;
  };

  const handleMenuClick = (e: React.MouseEvent, item: MenuItem) => {
    const canAccessItem = hasAccess(item.id);

    if (role === 'none') {
      e.preventDefault();
      onRequestLogin();
      return;
    }

    if (role === 'guest' && !canAccessItem) {
      e.preventDefault();
      alert(language === 'id' ? "Fitur ini memerlukan hak akses Administrator." : "This feature requires Administrator access.");
      return;
    }

    if (item.id === 'db-bibit-ai' && role === 'admin') {
      e.preventDefault();
      onOpenDashboardAI();
      return;
    }

    if (item.id === 'user-activity' && role === 'admin') {
      e.preventDefault();
      onOpenActivityLogs();
      return;
    }
  };

  if (filteredItems.length === 0) {
    return (
      <div className="col-span-3 py-16 text-center animate-fadeIn">
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
          <i className="fas fa-search"></i>
        </div>
        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
          {language === 'id' ? 'Fitur tidak ditemukan' : 'Feature not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 p-2">
      {filteredItems.map((item, index) => {
        const canAccess = hasAccess(item.id);
        const locked = role === 'none' || !canAccess;
        const isVisible = index < visibleItemsCount;
        const displayTitle = language === 'id' ? item.title : (item.titleEn || item.title);

        return (
          <a 
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleMenuClick(e, item)}
            className={`group relative flex flex-col items-center justify-center p-8 md:p-10 py-10 md:py-14 bg-white dark:bg-slate-900 rounded-[40px] md:rounded-[48px] border border-slate-200 dark:border-white/10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 active:scale-95 overflow-hidden ${locked ? 'opacity-50 grayscale-[0.4]' : 'opacity-100 cursor-pointer'} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: `${index * 15}ms` }}
          >
            {item.badge && !locked && (
              <span className="absolute top-4 right-4 md:top-5 md:right-5 px-3 md:px-4 py-1 md:py-1.5 text-white text-[7px] md:text-[8px] font-black uppercase rounded-full shadow-md z-10 tracking-widest bg-emerald-600 ring-2 ring-white dark:ring-slate-900 group-hover:scale-110 transition-all duration-300">
                {item.badge}
              </span>
            )}

            {locked && (
               <div className="absolute top-4 right-4 md:top-5 md:right-5 w-6 h-6 md:w-7 md:h-7 bg-slate-900/10 dark:bg-slate-700/30 rounded-lg flex items-center justify-center z-10">
                  <i className="fas fa-lock text-[8px] md:text-[9px] text-slate-600 dark:text-slate-400"></i>
               </div>
            )}
            
            <div className={`w-16 h-16 md:w-20 md:h-20 mb-5 md:mb-6 rounded-3xl md:rounded-4xl flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 relative ${locked ? 'bg-slate-100 dark:bg-slate-950 text-slate-400' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-500/10 shadow-inner'}`}>
              <i className={`fas ${item.icon}`}></i>
            </div>

            <span className={`text-[13px] md:text-[16px] font-black text-center leading-tight px-2 transition-colors duration-300 ${locked ? 'text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`}>
              {displayTitle}
            </span>
          </a>
        );
      })}
    </div>
  );
};
