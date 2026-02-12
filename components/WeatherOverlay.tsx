
import React, { useMemo } from 'react';
import { WeatherCondition } from '../types';

interface WeatherOverlayProps {
  condition: WeatherCondition;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = React.memo(({ condition }) => {
  const rainDrops = useMemo(() => {
    if (condition !== 'rain' && condition !== 'storm') return [];
    const count = condition === 'storm' ? 180 : 100; 
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${Math.random() * 30 + 50}px`,
      duration: `${0.25 + Math.random() * 0.35}s`,
      delay: `${Math.random() * 2}s`,
      opacity: condition === 'storm' ? 0.4 + Math.random() * 0.5 : 0.2 + Math.random() * 0.4,
    }));
  }, [condition]);

  if (condition === 'unknown') return null;

  const getGradientClass = () => {
    switch (condition) {
      case 'clear':
        return 'from-[#0ea5e9] via-[#38bdf8] to-[#f0fdfa]'; 
      case 'rain':
        return 'from-[#1e293b] via-[#334155] to-[#475569]'; // Mendung Moody Pekat
      case 'storm':
        return 'from-[#020617] via-[#0f172a] to-[#1e293b]'; // Gelap Badai
      case 'cloudy':
        return 'from-[#0284c7] via-[#7dd3fc] to-[#fef3c7]'; // Biru semu-semu kuning (Request User)
      default:
        return 'from-slate-50 to-slate-100';
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-[2500ms] ease-in-out bg-gradient-to-br ${getGradientClass()}`}>
      
      {/* 1. CERAH / CLEAR */}
      {condition === 'clear' && (
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-yellow-400/20 rounded-full blur-[160px] animate-pulse-gentle"></div>
          <div className="absolute top-[30%] left-[-10%] w-full h-96 bg-white/10 rounded-full blur-[120px] animate-drift"></div>
        </div>
      )}

      {/* 2. HUJAN & BADAI (Mendung & Partikel Hujan) */}
      {(condition === 'rain' || condition === 'storm') && (
        <div className="absolute inset-0 transition-opacity duration-[2000ms]">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1.5px]"></div>
          
          <div className="absolute inset-0 overflow-hidden">
            {rainDrops.map((drop) => (
              <div 
                key={drop.id}
                className="absolute w-[1px] bg-gradient-to-b from-transparent via-white/40 to-white/10 animate-rain"
                style={{
                  left: drop.left,
                  height: drop.height,
                  opacity: drop.opacity,
                  animationDuration: drop.duration,
                  animationDelay: drop.delay,
                  top: '-100px'
                }}
              />
            ))}
          </div>

          {condition === 'storm' && (
            <div className="absolute inset-0 bg-white opacity-0 pointer-events-none animate-lightning"></div>
          )}
        </div>
      )}

      {/* 3. BERAWAN (Biru Semu Kuning - Golden Sky Effect) */}
      {condition === 'cloudy' && (
        <div className="absolute inset-0">
           {/* Sun glow effect for yellow vibe behind clouds */}
           <div className="absolute top-[5%] right-[5%] w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-[140px] animate-pulse-gentle"></div>
           <div className="absolute top-[20%] left-[-10%] w-[120%] h-[400px] bg-white/20 rounded-full blur-[120px] animate-drift"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-amber-100/10 via-transparent to-transparent"></div>
        </div>
      )}

      <style>{`
        @keyframes rain {
          0% { transform: translateY(0); }
          100% { transform: translateY(120vh); }
        }
        @keyframes drift {
          0% { transform: translateX(-5%); }
          50% { transform: translateX(5%); }
          100% { transform: translateX(-5%); }
        }
        @keyframes lightning {
          0%, 94%, 96%, 98%, 100% { opacity: 0; }
          95% { opacity: 0.2; }
          97% { opacity: 0.4; }
        }
        .animate-rain {
          animation-name: rain;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-drift {
          animation: drift 60s ease-in-out infinite;
        }
        .animate-lightning {
          animation: lightning 7s infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 10s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
});
