
import React, { useState, useEffect } from 'react';
import { UserProfile, WeatherCondition } from '../types';

const LOGO_URL = "https://i.ibb.co.com/pjNwjtj0/montana-AI-1-1.jpg";

interface TopNavbarProps {
  user: UserProfile;
  isAuthenticated: boolean;
  currentTime: string;
  weatherCondition: WeatherCondition;
  temp: number;
  humidity: number;
  precipitation: number;
  windspeed: number;
  windDirection: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLiteMode: boolean;
  toggleLiteMode: () => void;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  onProfileClick: () => void;
}

interface NavBoxProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

const NavBox: React.FC<NavBoxProps> = ({ children, className = "", label }) => (
  <div className={`bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[24px] sm:rounded-[32px] p-3 sm:p-5 shadow-sm flex flex-col gap-2 sm:gap-2.5 transition-all hover:shadow-lg ring-1 ring-black/5 dark:ring-white/5 group ${className}`}>
    {label && <span className="text-[8px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] ml-1">{label}</span>}
    <div className="flex items-center gap-2 sm:gap-4">
      {children}
    </div>
  </div>
);

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  isAuthenticated,
  currentTime,
  weatherCondition,
  temp,
  humidity,
  precipitation,
  windspeed,
  windDirection,
  isDarkMode,
  toggleDarkMode,
  isLiteMode,
  toggleLiteMode,
  language,
  setLanguage,
  onProfileClick
}) => {
  const [coords, setCoords] = useState<{ lat: string; lon: string }>({ lat: "...", lon: "..." });
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [gpsStatus, setGpsStatus] = useState<'searching' | 'locked' | 'error'>('searching');
  const [compassHeading, setCompassHeading] = useState(0); // New: for accurate compass

  useEffect(() => {
    // Handle Device Orientation for accurate compass
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCompassHeading(event.alpha); // Alpha is Z-axis rotation (compass heading)
      }
    };

    // Request permission if needed (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permission: string) => {
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        })
        .catch(() => {
          // Fallback: Add listener anyway (Android)
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        });
    } else {
      // Non-iOS devices
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let watchId: number | null = null;
    if (navigator.geolocation) {
      setGpsStatus('searching');
      watchId = navigator.geolocation.watchPosition((pos) => {
        setAccuracy(pos.coords.accuracy);
        setCoords({
          lat: pos.coords.latitude.toFixed(6),
          lon: pos.coords.longitude.toFixed(6)
        });
        setGpsStatus('locked');
      }, (err) => {
        setGpsStatus('error');
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getWeatherLabel = (condition: WeatherCondition) => {
    switch (condition) {
      case 'clear': return language === 'id' ? 'CERAH' : 'CLEAR';
      case 'rain': return language === 'id' ? 'HUJAN' : 'RAIN';
      case 'cloudy': return language === 'id' ? 'BERAWAN' : 'CLOUDY';
      case 'storm': return language === 'id' ? 'BADAI' : 'STORM';
      default: return 'SCANNING';
    }
  };

  const getWindDirectionRotation = (dir: string) => {
    const mapping: Record<string, number> = {
      'N': 0, 'NE': 45, 'E': 90, 'SE': 135,
      'S': 180, 'SW': 225, 'W': 270, 'NW': 315
    };
    return mapping[dir] || 0;
  };

  const getSignalStrength = () => {
    if (!accuracy) return 0;
    if (accuracy < 10) return 4;
    if (accuracy < 30) return 3;
    if (accuracy < 100) return 2;
    return 1;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-[100] bg-gradient-to-b from-white/80 via-white/70 to-white/50 dark:from-slate-950/80 dark:via-slate-950/70 dark:to-slate-950/40 backdrop-blur-3xl border-b border-gradient transition-all duration-500 ${isLiteMode ? 'py-2 sm:py-2.5 md:py-4 px-2 sm:px-4 md:px-10 lg:px-14' : 'py-2 sm:py-3 md:py-5 px-2 sm:px-4 md:px-10 lg:px-14'}`} 
      style={{
        borderBottomImage: 'linear-gradient(90deg, rgba(16,185,129,0.3) 0%, rgba(52,211,153,0.1) 50%, rgba(16,185,129,0.3) 100%)',
        borderBottomImageSlice: 1,
        boxShadow: '0 4px 32px rgba(16, 185, 129, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 20px rgb(0 0 0 / 0.02)'
      }}>
      <div className="max-w-[1440px] mx-auto flex flex-col gap-0 sm:gap-0 md:gap-4 lg:gap-5">
        
        <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-6 lg:gap-8">
          <div 
            className={`flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-5 pl-1.5 sm:pl-2 md:pl-5 pr-1.5 sm:pr-2.5 md:pr-6 lg:pr-8 py-1 sm:py-1.5 md:py-3.5 lg:py-5 rounded-[16px] sm:rounded-[18px] md:rounded-[28px] lg:rounded-[36px] bg-gradient-to-br from-slate-900/95 to-slate-800/90 dark:from-emerald-600/95 dark:to-emerald-700/90 text-white cursor-pointer hover:shadow-xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-95 transition-all shadow-lg ring-1 ring-white/10 dark:ring-emerald-400/20 backdrop-blur-xl ${isLiteMode ? 'shrink-0' : ''}`}
            onClick={onProfileClick}
          >
            <div className="relative group shrink-0">
              <img 
                src={isAuthenticated ? user.photo : LOGO_URL} 
                className={`${isLiteMode ? 'w-5 h-5 sm:w-6 sm:h-6 md:w-11 md:h-11 lg:w-13 lg:h-13' : 'w-6 h-6 sm:w-7 sm:h-7 md:w-12 md:h-12 lg:w-14 lg:h-14'} rounded-[10px] sm:rounded-[12px] md:rounded-[18px] lg:rounded-[20px] object-cover border-2 border-white/20 bg-white shadow-lg`}
                alt="Profile"
              />
              <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-full border-2 border-slate-900 ${isAuthenticated ? 'bg-emerald-400' : 'bg-slate-400'} shadow-[0_0_10px_rgba(52,211,153,0.5)]`}></div>
            </div>
            <div className={`flex flex-col min-w-0 ${isLiteMode ? 'hidden md:flex' : 'hidden md:flex'}`}>
              <span className={`text-[11px] md:text-[15px] lg:text-[17px] font-black uppercase tracking-tight leading-none mb-1 truncate text-white`}>
                {isAuthenticated ? user.name : (language === 'id' ? 'AKSES PUBLIK' : 'PUBLIC ACCESS')}
              </span>
              <span className="text-[8px] md:text-[10px] lg:text-[11px] font-black text-white/80 uppercase tracking-[0.2em] truncate">
                {isAuthenticated ? user.jabatan : (language === 'id' ? 'IDENTITAS TERKUNCI' : 'IDENTITY LOCKED')}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-0.5 sm:gap-1.5 md:gap-3 lg:gap-4 bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/40 rounded-[20px] sm:rounded-[26px] md:rounded-[32px] lg:rounded-[40px] p-1 sm:p-1.5 md:p-3 lg:p-4 px-1.5 sm:px-2 md:px-5 lg:px-7 shadow-xl backdrop-blur-2xl ring-1 ring-white/30 dark:ring-emerald-400/10 transition-all duration-300 hover:bg-white/90 dark:hover:bg-slate-900/90 hover:ring-emerald-400/20 ${isLiteMode ? 'gap-0.5' : ''}`}>
             
             {/* BILINGUAL SWITCHER - hidden on mobile completely */}
             <div className={`hidden md:flex flex-col items-center gap-1 mr-0 md:mr-1.5 lg:mr-2`}>
                <div className="flex bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-lg p-1 md:p-1.5 lg:p-2 rounded-full ring-1 ring-black/5 dark:ring-emerald-400/10 border border-slate-200/40 dark:border-emerald-500/10">
                   <button 
                    onClick={() => setLanguage('id')}
                    className={`px-2.5 md:px-3 lg:px-4 py-0.5 md:py-1 lg:py-1.5 rounded-full text-[7px] md:text-[9px] lg:text-[10px] font-black transition-all ${language === 'id' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                   >ID</button>
                   <button 
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 md:px-3 lg:px-4 py-0.5 md:py-1 lg:py-1.5 rounded-full text-[7px] md:text-[9px] lg:text-[10px] font-black transition-all ${language === 'en' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                   >EN</button>
                </div>
             </div>

             <div className={`flex flex-col items-center gap-0 ${isLiteMode ? 'gap-0' : ''}`}>
                <div className="toggle-btn-container shadow-lg shadow-emerald-500/20 dark:shadow-emerald-600/30 scale-50 sm:scale-60 md:scale-80 lg:scale-100 origin-center transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={isLiteMode}
                    onChange={toggleLiteMode}
                  />
                  <div className="knobs"></div>
                  <div className="layer"></div>
                </div>
             </div>

             <div className={`flex items-center gap-0.5 sm:gap-1 md:gap-2.5 lg:gap-3.5 border-r border-slate-200/60 dark:border-emerald-500/20 pr-0.5 sm:pr-1 md:pr-3 lg:pr-5 ml-0 sm:ml-0.5 md:ml-1.5 lg:ml-2 ${isLiteMode ? 'gap-0.5' : ''}`}>
                <div className="flex flex-col items-end">
                   <span className={`text-[10px] sm:text-[11px] md:text-[16px] lg:text-[19px] font-black text-slate-900 dark:text-emerald-200 tabular-nums tracking-tighter leading-none`}>
                     {currentTime}
                   </span>
                </div>
                <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse'}`}></div>
             </div>
             
             <button onClick={toggleDarkMode} className={`w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-[14px] md:rounded-[18px] lg:rounded-[22px] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-700 dark:text-emerald-300 active:scale-90 transition-all border border-slate-200/60 dark:border-emerald-500/20 hover:bg-gradient-to-br hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-md hover:shadow-lg dark:hover:shadow-emerald-500/20`}>
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-[9px] sm:text-[10px] md:text-[14px] lg:text-[16px]`}></i>
             </button>
          </div>
        </div>

        {/* Row 2: Minimalist Horizontal Weather Strip - Hidden on mobile */}
        {!isLiteMode && (
          <div className="hidden md:flex items-center justify-center gap-3 lg:gap-6 px-2 md:px-4 lg:px-6 py-3 md:py-3.5 lg:py-4.5 bg-gradient-to-r from-emerald-50/40 dark:from-emerald-950/30 to-transparent backdrop-blur-xl border-t border-emerald-200/30 dark:border-emerald-800/30 rounded-b-lg overflow-x-auto scrollbar-hide shadow-inner transition-all duration-300" style={{ boxShadow: 'inset 0 1px 8px rgba(16, 185, 129, 0.05)' }}>
            
            {/* GPS Signal Indicator */}
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4 shrink-0">
              <div className="flex flex-col items-center gap-0.5 md:gap-1.5">
                <div className="flex items-end gap-1 md:gap-1.5 h-4 md:h-5 lg:h-6">
                  {[1,2,3,4].map(bar => (
                    <div 
                      key={bar} 
                      className={`w-1 md:w-1.5 lg:w-2 rounded-t transition-all ${bar <= getSignalStrength() ? (gpsStatus === 'locked' ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse') : 'bg-slate-200 dark:bg-slate-700'}`}
                      style={{ height: `${bar * 20}%` }}
                    />
                  ))}
                </div>
                <span className={`text-[6px] md:text-[7px] lg:text-[8px] font-black uppercase tracking-widest leading-none ${gpsStatus === 'locked' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {gpsStatus}
                </span>
              </div>
              <div className="flex flex-col gap-0 min-w-0">
                <span className="text-[8px] md:text-[9px] lg:text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono leading-tight truncate">{coords.lat}</span>
                <span className="text-[8px] md:text-[9px] lg:text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono leading-tight truncate">{coords.lon}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-5 md:h-7 lg:h-8 bg-slate-200 dark:bg-slate-700 shrink-0"></div>

            {/* Weather Info */}
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4 shrink-0">
              <div className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-emerald-700 text-white flex items-center justify-center text-[10px] md:text-sm lg:text-lg flex-shrink-0 shadow-lg dark:shadow-emerald-500/30">
                <i className={`fas ${weatherCondition === 'clear' ? 'fa-sun' : weatherCondition === 'rain' ? 'fa-cloud-showers-heavy' : weatherCondition === 'storm' ? 'fa-bolt' : 'fa-cloud'}`}></i>
              </div>
              <div className="flex flex-col gap-0">
                <div className="flex items-baseline gap-1 md:gap-1.5">
                  <span className="text-[11px] md:text-base lg:text-xl font-black text-slate-900 dark:text-white tabular-nums">{temp}°</span>
                  <span className="text-[6px] md:text-[8px] lg:text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">{getWeatherLabel(weatherCondition)}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-5 md:h-7 lg:h-8 bg-slate-200 dark:bg-slate-700 shrink-0"></div>

            {/* Compass & Wind Info */}
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4 shrink-0 group cursor-pointer">
              <div className="relative w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-emerald-700 border border-slate-300 dark:border-emerald-600 flex items-center justify-center shrink-0 group-hover:shadow-lg dark:group-hover:shadow-emerald-500/30 transition-all">
                <i 
                  className="fas fa-location-arrow text-white text-[9px] md:text-sm lg:text-base transition-transform duration-300"
                  style={{ transform: `rotate(${compassHeading}deg)` }}
                  title="Device Compass"
                ></i>
              </div>
              <div className="flex flex-col gap-0">
                <div className="text-[7px] md:text-xs lg:text-sm font-bold text-slate-600 dark:text-slate-400 uppercase leading-none">{windspeed} km/h</div>
                <div className="text-[6px] md:text-xs lg:text-sm font-bold text-slate-500 dark:text-slate-500">{windDirection}</div>
              </div>
              <div className="hidden md:block absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[7px] md:text-[8px] lg:text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {Math.round(compassHeading)}°
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-5 md:h-7 lg:h-8 bg-slate-200 dark:bg-slate-700 shrink-0"></div>

            {/* Humidity & Rainfall */}
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6 shrink-0">
              <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3">
                <div className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white flex items-center justify-center text-[9px] md:text-sm lg:text-base flex-shrink-0 shadow-lg dark:shadow-blue-500/30">
                  <i className="fas fa-droplet"></i>
                </div>
                <div className="flex flex-col gap-0">
                  <span className="text-[6px] md:text-[8px] lg:text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-tight">{language === 'id' ? 'Lemb' : 'H'}</span>
                  <span className="text-[9px] md:text-base lg:text-xl font-black text-slate-900 dark:text-white leading-none">{humidity}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3">
                <div className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700 text-white flex items-center justify-center text-[9px] md:text-sm lg:text-base flex-shrink-0 shadow-lg dark:shadow-cyan-500/30">
                  <i className="fas fa-cloud-rain"></i>
                </div>
                <div className="flex flex-col gap-0">
                  <span className="text-[6px] md:text-[8px] lg:text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-tight">{language === 'id' ? 'H' : 'R'}</span>
                  <span className="text-[9px] md:text-base lg:text-xl font-black text-slate-900 dark:text-white leading-none">{precipitation}mm</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
