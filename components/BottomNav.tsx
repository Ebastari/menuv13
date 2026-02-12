
import React from 'react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthenticated: boolean;
  userRole: 'admin' | 'guest' | 'none';
  onRequestLogin: () => void;
  language?: 'id' | 'en';
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  isAuthenticated, 
  userRole,
  onRequestLogin,
  language = 'id'
}) => {

  const navItems = [
    { id: 'home', icon: 'fa-house', label: language === 'id' ? 'Beranda' : 'Home' },
    { id: 'peta', icon: 'fa-map-location-dot', label: language === 'id' ? 'Peta' : 'Maps', external: 'https://ebastari.github.io/Realisasi-pekerjaan/Realisasi2025.html', isAdminOnly: true },
    { id: 'montana', icon: 'fa-camera', label: language === 'id' ? 'Kamera' : 'Capture', external: 'https://camera.montana-tech.info/', isAdminOnly: true },
    { id: 'notif', icon: 'fa-bell', label: language === 'id' ? 'Notif' : 'Alerts', external: 'https://ebastari.github.io/notifikasi/notif.html', isAdminOnly: true },
    { id: 'profile', icon: isAuthenticated ? 'fa-user-gear' : 'fa-door-open', label: isAuthenticated ? (language === 'id' ? 'Profil' : 'Settings') : (language === 'id' ? 'Masuk' : 'Login'), isAuthTrigger: true }
  ];

  const handleNavClick = (item: any) => {
    if (item.isAuthTrigger) {
      if (isAuthenticated) {
        setActiveTab('profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onRequestLogin();
      }
      return;
    }

    if (!isAuthenticated) {
      onRequestLogin();
      return;
    }

    if (item.isAdminOnly && userRole !== 'admin') {
      alert(language === 'id' ? "Akses Administrator diperlukan." : "Administrator access required.");
      return;
    }

    if (item.external) {
      window.open(item.external, '_blank', 'noopener,noreferrer');
    } else {
      setActiveTab(item.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-6 pointer-events-none pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-[540px] mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[44px] border border-white/50 dark:border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.5)] flex justify-around p-2 pointer-events-auto ring-1 ring-black/5 dark:ring-white/5 relative">
        
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl border border-white/20 whitespace-nowrap animate-drift-puff flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          {language === 'id' ? 'Terhubung Awan' : 'Cloud Connected'}
        </div>

        {navItems.map((item) => {
          const isCurrent = activeTab === item.id || (item.isAuthTrigger && activeTab === 'profile');
          const isLocked = !isAuthenticated && !item.isAuthTrigger;
          const isRoleLocked = item.isAdminOnly && userRole === 'guest';
          
          return (
            <button 
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center py-5 px-1 rounded-[32px] transition-all duration-500 relative flex-1 group active:scale-90 ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white'} ${(isLocked || isRoleLocked) ? 'opacity-30' : 'opacity-100'}`}
            >
              {isCurrent && (
                <div className="absolute inset-1.5 bg-emerald-500/10 dark:bg-emerald-400/15 rounded-[30px] transition-all animate-pulse-gentle"></div>
              )}
              
              <div className="relative mb-2">
                <i className={`fas ${item.icon} text-[22px] transition-all duration-500 relative z-10 ${isCurrent ? 'scale-110 -translate-y-2 drop-shadow-[0_10px_15px_rgba(16,185,129,0.5)]' : 'group-hover:scale-110 group-hover:-translate-y-1'}`}></i>
                
                {(isLocked || isRoleLocked) && (
                  <div className="absolute -top-2 -right-3 w-4 h-4 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-xl border border-white/10">
                    <i className="fas fa-lock text-[7px] text-white"></i>
                  </div>
                )}
              </div>

              <span className={`text-[8.5px] font-black uppercase tracking-widest relative z-10 transition-all duration-500 ${isCurrent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 scale-90 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'}`}>
                  {item.label}
              </span>

              {isCurrent && (
                <div className="absolute bottom-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,1)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
