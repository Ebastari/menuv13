
import React, { useState, useEffect, useMemo } from 'react';
import { GrowthCard } from './components/GrowthCard';
import { MenuGrid } from './components/MenuGrid';
import { BottomNav } from './components/BottomNav';
import { WeatherOverlay } from './components/WeatherOverlay';
import { Login } from './components/Login';
import { ProfileEdit } from './components/ProfileEdit';
import { AboutSection } from './components/AboutSection';
import { DashboardBibitAI } from './components/DashboardBibitAI';
import { RosterWidget } from './components/RosterWidget';
import { SeedlingSummary } from './components/SeedlingSummary';
import { HelpCenter } from './components/HelpCenter';
import { LayananPengaduan } from './components/LayananPengaduan';
import { FloatingStockBubble } from './components/FloatingStockBubble';
import { TopNavbar } from './components/TopNavbar';
import { PartnerSection } from './components/PartnerSection';
import { GamePromotionSection } from './components/GamePromotionSection';
import { PlayStoreSection } from './components/PlayStoreSection';
import { DeveloperInfo } from './components/DeveloperInfo';
import { BibitNotificationToast } from './components/BibitNotificationToast';
import { UserProfileView } from './components/UserProfileView';
import { SubscribeWidget } from './components/SubscribeWidget';
import { GlobalFooter } from './components/GlobalFooter';
import { MontanaProfile } from './components/MontanaProfile';
import { Forecast7Days } from './components/Forecast7Days';
import { SystemHistory } from './components/SystemHistory';
import { WelcomeLoginPrompt } from './components/WelcomeLoginPrompt';
import { CameraPreview } from './components/CameraPreview';
import { AdminActivityLogs } from './components/AdminActivityLogs';
import { LiteDashboard } from './components/LiteDashboard';
import { UserProfile, WeatherCondition } from './types';

const LOGO_URL = "https://i.ibb.co.com/pjNwjtj0/montana-AI-1-1.jpg";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxljQVpyYZjBpRdZ0J_sgMXkTHX-v8i7_nBVYmnG25oLxZkpfuns_HwUyspxA66Vkvm/exec"; 
const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <section className={`px-4 sm:px-10 py-16 md:py-28 max-w-[1440px] mx-auto transition-all duration-700 animate-fadeIn ${className}`}>
    {children}
  </section>
);

const AdminFeatureLock: React.FC<{ children: React.ReactNode; role: string; title?: string; language?: 'id' | 'en' }> = ({ children, role, title = "Akses Terbatas", language = 'id' }) => {
  if (role === 'admin') return <>{children}</>;
  const lockDesc = language === 'id' ? 'Hanya tersedia untuk Administrator Montana AI.' : 'Only available for Montana AI Administrators.';
  const lockTitle = language === 'id' ? title : (title === 'Akses Terbatas' ? 'Restricted Access' : title);

  return (
    <div className="relative group overflow-hidden rounded-[48px] transition-all">
      <div className="absolute inset-0 z-20 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-[16px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[48px] scale-100 group-hover:scale-105 transition-transform duration-700">
        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl mb-4 ring-8 ring-emerald-500/10 transition-transform group-hover:rotate-12">
          <i className="fas fa-lock text-emerald-600 dark:text-emerald-400 text-xl"></i>
        </div>
        <h3 className="text-[13px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">{lockTitle}</h3>
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center px-8">{lockDesc}</p>
      </div>
      <div className="opacity-30 grayscale blur-[10px] pointer-events-none scale-[0.97]">
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isOAuthAuthenticated, setIsOAuthAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'guest' | 'none'>('none');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('clear');
  const [weatherDetails, setWeatherDetails] = useState({ temp: 0, windspeed: 0, humidity: 0, rain: 0, windDirection: 'N' });
  const [allBibitData, setAllBibitData] = useState<any[]>([]);
  const [latestUpdate, setLatestUpdate] = useState<any>(null);
  const [showDailyToast, setShowDailyToast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('montana_dark_mode') === 'true');
  const [isLiteMode, setIsLiteMode] = useState(() => localStorage.getItem('montana_lite_mode') === 'true');
  const [language, setLanguage] = useState<'id' | 'en'>(() => (localStorage.getItem('montana_lang') as 'id' | 'en') || 'id');
  const [proMenuSearch, setProMenuSearch] = useState('');
  
  const [user, setUser] = useState<UserProfile>({
    name: 'Tamu Montana', photo: LOGO_URL, jabatan: 'Public Access', telepon: '', email: '', activeSeconds: 0, lastSeen: new Date().toISOString()
  });

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showDashboardAI, setShowDashboardAI] = useState(false);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);
  const [showMontanaProfile, setShowMontanaProfile] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user.name !== 'Tamu Montana') {
      const heartbeat = () => {
        fetch(`${SCRIPT_URL}?action=heartbeat&user=${encodeURIComponent(user.name)}`, { 
          method: 'GET', 
          mode: 'no-cors',
          cache: 'no-cache'
        }).catch(() => {}); 
      };
      heartbeat();
      const interval = setInterval(heartbeat, 60000); 
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user.name]);

  useEffect(() => {
    // Check if user was previously authenticated
    const savedUserData = localStorage.getItem('montana_user_data');
    const savedUserRole = localStorage.getItem('montana_user_role');
    const savedOAuthStatus = localStorage.getItem('montana_oauth_status');
    
    if (savedUserData && savedUserRole) {
      setUser(JSON.parse(savedUserData));
      setUserRole(savedUserRole as 'admin' | 'guest');
      setIsAuthenticated(true);
      setIsOAuthAuthenticated(savedOAuthStatus === 'true');
    }
    
    setLoading(false);
    fetchLatestNotif(); 
    // Do NOT automatically open login modal - user must request it
  }, []);

  const todaySummary = useMemo(() => {
    if (!allBibitData.length) return null;
    return allBibitData[allBibitData.length - 1];
  }, [allBibitData]);

  const fetchWeather = async () => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-3.33&longitude=115.79&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m`);
      const data = await res.json();
      if (data.current) {
        const cur = data.current;
        setWeatherDetails({
          temp: Math.round(cur.temperature_2m), 
          windspeed: Math.round(cur.wind_speed_10m),
          humidity: cur.relative_humidity_2m, 
          rain: cur.precipitation, 
          windDirection: DIRECTIONS[Math.round(cur.wind_direction_10m / 45) % 8]
        });
        const code = cur.weather_code;
        if ([0, 1].includes(code)) setWeatherCondition('clear');
        else if ([2, 3, 45, 48].includes(code)) setWeatherCondition('cloudy');
        else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) setWeatherCondition('rain');
        else if ([95, 96, 99].includes(code)) setWeatherCondition('storm');
        else setWeatherCondition('cloudy');
      }
    } catch (err) { setWeatherCondition('cloudy'); }
  };

  const fetchLatestNotif = async () => {
    try {
      const res = await fetch(`${SCRIPT_URL}?sheet=Bibit`);
      const json = await res.json();
      if (Array.isArray(json)) {
        const normalized = json.map((r: any) => ({
          tanggal: String(r.tanggal || ''), 
          bibit: (r.bibit || '').toString().trim(),
          masuk: parseInt(r.masuk || 0), 
          keluar: parseInt(r.keluar || 0),
          mati: parseInt(r.mati || 0)
        }));
        setAllBibitData(normalized);
        if (normalized.length > 0) {
          setLatestUpdate(normalized[normalized.length - 1]);
          if (userRole === 'admin') setShowDailyToast(true);
        }
      }
    } catch (err) { console.warn("Seedling sync unavailable"); }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(() => {
      setActiveSeconds(prev => prev + 1);
      setCurrentTime(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('montana_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('montana_lite_mode', isLiteMode.toString());
  }, [isLiteMode]);

  useEffect(() => {
    localStorage.setItem('montana_lang', language);
  }, [language]);

  const handleLoginSuccess = (userData: any, role: 'admin' | 'guest') => {
    setUser(userData); 
    setUserRole(role); 
    setIsAuthenticated(true); 
    setShowLoginModal(false); 
    
    fetch(`${SCRIPT_URL}?action=addLog&user=${encodeURIComponent(userData.name)}&event=LOGIN_SUCCESS&role=${role}`, {
      method: 'GET', mode: 'no-cors'
    }).catch(() => {});

    localStorage.setItem('montana_user_data', JSON.stringify(userData));
    localStorage.setItem('montana_user_role', role);
    localStorage.setItem('montana_oauth_status', 'false');

    fetchLatestNotif();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsOAuthAuthenticated(false);
    setUserRole('none');
    localStorage.removeItem('montana_user_data');
    localStorage.removeItem('montana_user_role');
    localStorage.removeItem('montana_oauth_status');
    setUser({ name: 'Tamu Montana', photo: LOGO_URL, jabatan: 'Public Access', telepon: '', email: '', activeSeconds: 0, lastSeen: new Date().toISOString() });
    setActiveTab('home');
  };

  const handleOAuthSuccess = (data: { name: string; photo: string; email: string }) => {
    const updated = { ...user, ...data };
    setUser(updated);
    setIsOAuthAuthenticated(true);
    localStorage.setItem('montana_user_data', JSON.stringify(updated));
    localStorage.setItem('montana_oauth_status', 'true');
    fetch(`${SCRIPT_URL}?action=addLog&user=${encodeURIComponent(data.name)}&event=OAUTH_VERIFIED&role=${userRole}`, {
      method: 'GET', mode: 'no-cors'
    }).catch(() => {});
  };

  if (loading) return null;

  return (
    <div className={`min-h-screen ${isLiteMode ? 'pb-24' : 'pb-48'} dark:bg-slate-950 text-slate-800 dark:text-slate-100 relative selection:bg-emerald-500/30 font-sans overflow-x-hidden`}>
      <WeatherOverlay condition={isLiteMode ? 'unknown' : weatherCondition} />
      
      <TopNavbar 
          user={user} isAuthenticated={isAuthenticated} currentTime={currentTime} weatherCondition={weatherCondition}
          temp={weatherDetails.temp} humidity={weatherDetails.humidity} precipitation={weatherDetails.rain}
          windspeed={weatherDetails.windspeed} windDirection={weatherDetails.windDirection}
          isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isLiteMode={isLiteMode} toggleLiteMode={() => setIsLiteMode(!isLiteMode)}
          language={language} setLanguage={setLanguage}
          onProfileClick={() => setActiveTab('profile')}
      />

      <main className={`relative z-10 transition-all duration-500 ${isLiteMode ? 'pt-16 sm:pt-20 md:pt-32' : 'pt-20 sm:pt-28 md:pt-44'}`}>
          
          <div className={`${activeTab === 'home' ? 'block' : 'hidden'}`}>
              <SectionWrapper>
                  {!isAuthenticated && <WelcomeLoginPrompt onRequestLogin={() => setShowLoginModal(true)} language={language} />}
                  
                  {isLiteMode ? (
                    <LiteDashboard 
                      role={userRole} 
                      onOpenDashboardAI={() => setShowDashboardAI(true)} 
                      onOpenActivityLogs={() => setShowActivityLogs(true)} 
                      onRequestLogin={() => setShowLoginModal(true)} 
                      language={language}
                    />
                  ) : (
                    <div className="space-y-28">
                      {/* Weather/Forecast - Stays at Top */}
                      <Forecast7Days language={language} />

                      {/* MAIN MENU GRID - Prominent Feature Display */}
                      <div>
                        <div className="mb-8 md:mb-10 lg:mb-12">
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Montana Features</h2>
                          <p className="text-[12px] md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{language === 'id' ? 'Sistem Cerdas Manajemen Lapangan' : 'Intelligent Field Management System'}</p>
                        </div>
                        
                        <div className="relative group mb-6">
                          <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10"></i>
                          <input 
                            type="text" 
                            placeholder={language === 'id' ? "Cari Fitur Montana..." : "Search Montana Features..."}
                            value={proMenuSearch}
                            onChange={(e) => setProMenuSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 md:py-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[32px] md:rounded-[40px] font-bold text-[12px] md:text-[13px] outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-xl transition-all placeholder:text-slate-400"
                          />
                        </div>

                        <MenuGrid 
                          role={userRole} 
                          onOpenDashboardAI={() => setShowDashboardAI(true)} 
                          onOpenActivityLogs={() => setShowActivityLogs(true)} 
                          onRequestLogin={() => setShowLoginModal(true)} 
                          searchQuery={proMenuSearch}
                          language={language}
                        />
                      </div>

                      {/* Other Components */}
                      
                      <div className="flex flex-col gap-10">
                         {/* Expanded Peta Lapangan */}
                         <AdminFeatureLock role={userRole} title={language === 'id' ? "Visualisasi Peta Lapangan" : "Field Map Visualization"} language={language}>
                            <CameraPreview type="map" />
                         </AdminFeatureLock>
                         
                         {/* Smart Camera Visualization */}
                         <AdminFeatureLock role={userRole} title={language === 'id' ? "Visualisasi Kamera Pintar" : "Smart Camera Visualization"} language={language}>
                            <CameraPreview type="camera" />
                         </AdminFeatureLock>
                      </div>

                      <AdminFeatureLock role={userRole} title={language === 'id' ? "Data Roster Admin" : "Admin Roster Data"} language={language}>
                        <RosterWidget />
                      </AdminFeatureLock>
                      
                      <AdminFeatureLock role={userRole} title={language === 'id' ? "Dashboard Inventaris Bibit" : "Seedling Inventory Dashboard"} language={language}>
                        <SeedlingSummary language={language} />
                      </AdminFeatureLock>

                      <GrowthCard currentSeconds={activeSeconds} user={user} isVerified={isOAuthAuthenticated} language={language} />
                      <SubscribeWidget language={language} />
                      <SystemHistory language={language} />
                      
                      {/* System Intelligence & Montana Assistant - Full Width */}
                      <LayananPengaduan language={language} />
                      <HelpCenter language={language} />
                    </div>
                  )}
              </SectionWrapper>
          </div>

          <div className={`${activeTab === 'profile' ? 'block' : 'hidden'}`}>
              <SectionWrapper>
                  <div className="space-y-16">
                      <UserProfileView user={user} isOAuthAuthenticated={isOAuthAuthenticated} onOAuthSuccess={handleOAuthSuccess} onEdit={() => setShowProfileEdit(true)} onLogout={handleLogout} />
                      <AboutSection onOpenMontanaProfile={() => setShowMontanaProfile(true)} onOpenDeveloper={() => setShowDeveloperInfo(true)} language={language} />
                  </div>
              </SectionWrapper>
          </div>
      </main>
      
      {!isLiteMode && (
        <div className="mt-24 space-y-24 relative z-10 transition-all duration-700">
            <GamePromotionSection />
            <PlayStoreSection />
            <PartnerSection />
            <GlobalFooter onOpenMontanaProfile={() => setShowMontanaProfile(true)} />
        </div>
      )}

      {isLiteMode && (
        <div className="mt-12 transition-all duration-700">
          <GlobalFooter onOpenMontanaProfile={() => setShowMontanaProfile(true)} />
        </div>
      )}

      {userRole === 'admin' && <FloatingStockBubble data={todaySummary} />}
      {userRole === 'admin' && <BibitNotificationToast data={showDailyToast ? latestUpdate : null} onClose={() => setShowDailyToast(false)} />}
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAuthenticated={isAuthenticated} userRole={userRole} onRequestLogin={() => setShowLoginModal(true)} language={language} />

      {showLoginModal && <Login onVerified={handleLoginSuccess} onClose={() => setShowLoginModal(false)} />}
      {showProfileEdit && <ProfileEdit user={user} onSave={(updated) => { 
        const nextUser = {...user, ...updated};
        fetch(`${SCRIPT_URL}?action=updateProfile&oldName=${encodeURIComponent(user.name)}&newName=${encodeURIComponent(updated.name || user.name)}&email=${encodeURIComponent(updated.email || '')}&phone=${encodeURIComponent(updated.telepon || '')}&role=${userRole}`, {
          method: 'GET', mode: 'no-cors'
        }).catch(() => {});
        setUser(nextUser); 
        localStorage.setItem('montana_user_data', JSON.stringify(nextUser));
        setShowProfileEdit(false); 
      }} onClose={() => setShowProfileEdit(false)} />}
      {showDashboardAI && <DashboardBibitAI onClose={() => setShowDashboardAI(false)} />}
      {showActivityLogs && <AdminActivityLogs onClose={() => setShowActivityLogs(false)} />}
      {showDeveloperInfo && <DeveloperInfo onClose={() => setShowDeveloperInfo(false)} />}
      {showMontanaProfile && <MontanaProfile onClose={() => setShowMontanaProfile(false)} />}
    </div>
  );
};

export default App;
