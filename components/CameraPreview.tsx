
import React from 'react';

interface CameraPreviewProps {
  type?: 'map' | 'camera';
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ type = 'map' }) => {
  const isMap = type === 'map';
  const url = isMap ? "https://livepeta.montana-tech.info/" : "https://camera.montana-tech.info/";
  const title = isMap ? "Live Spatial Monitoring" : "Smart Camera Terminal";
  const icon = isMap ? "fa-map-marked-alt" : "fa-camera-retro";
  const subtitle = isMap ? "Montana Geospatial Intelligence" : "Montana Documentation Engine";

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[44px] p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden group transition-all animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-[24px] ${isMap ? 'bg-emerald-600' : 'bg-blue-600'} text-white flex items-center justify-center text-2xl shadow-2xl`}>
            <i className={`fas ${icon}`}></i>
          </div>
          <div>
            <h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1.5">{title}</h3>
            <p className={`text-[9px] font-black ${isMap ? 'text-emerald-600' : 'text-blue-600'} uppercase tracking-[0.25em]`}>{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {isMap && (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Enhanced View Active</span>
            </div>
          )}
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 md:flex-none px-8 py-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-expand-arrows-alt"></i>
            Full Screen
          </a>
        </div>
      </div>

      <div className={`relative rounded-[36px] overflow-hidden ${isMap ? 'aspect-[21/9] sm:aspect-[2.8/1]' : 'aspect-video'} bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 shadow-2xl group-hover:border-emerald-500/30 transition-all duration-700 ring-1 ring-black/5`}>
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title={title}
          loading="lazy"
          allow="geolocation; camera; microphone"
        ></iframe>
        
        {/* Status Indicator Overlay */}
        <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/70 backdrop-blur-2xl rounded-full border border-white/20 pointer-events-none shadow-2xl">
          <div className={`w-2 h-2 rounded-full ${isMap ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]`}></div>
          <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{isMap ? 'Geospatial Node Active' : 'Lens Sync Stable'}</span>
        </div>

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]"></div>
      </div>
      
      <div className="mt-6 flex items-center justify-between px-2">
         <p className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter truncate">
           Secure Terminal: {url.replace('https://', '')}
         </p>
         <div className="flex gap-4 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
            <i className="fas fa-satellite text-xs"></i>
            <i className="fas fa-wifi text-xs"></i>
            <i className="fas fa-shield-alt text-xs"></i>
         </div>
      </div>
    </div>
  );
};
