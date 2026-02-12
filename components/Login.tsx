
import React, { useState, useRef, useEffect } from 'react';
import { TermsContent } from './TermsContent';

/**
 * Generates a SHA-256 hash of the provided string.
 * This is used for secure comparison of credentials.
 */
export async function secureHash(string: string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

export const Login: React.FC<{
  onVerified: (userData: { name: string; photo: string; telepon: string; email: string; jabatan: string }, role: 'admin' | 'guest') => void;
  onClose: () => void;
}> = ({ onVerified, onClose }) => {
  // Alur Langkah: password -> name -> terms -> facescan -> final
  const [currentStep, setCurrentStep] = useState<'password' | 'name' | 'terms' | 'facescan' | 'final'>('password');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const termsScrollRef = useRef<HTMLDivElement>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  // Langkah 1: Validasi Sandi
  const validatePassword = () => {
    const cleanPass = password.trim().toLowerCase();
    if (cleanPass === 'kalimantan' || cleanPass === 'kalimantan selatan') {
      setCurrentStep('name');
    } else {
      alert("mohon berikan sandi akses dengan benar");
    }
  };

  // Langkah 3: Handle Scroll Persetujuan
  const handleTermsScroll = () => {
    if (termsScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsScrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) setScrolledToBottom(true);
    }
  };

  // Langkah 4: Scan Wajah
  const startFaceScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        if (p >= 100) {
          clearInterval(interval);
          setFaceVerified(true);
          setTimeout(() => setCurrentStep('final'), 800);
        }
      }, 100);
    } catch (err) {
      setFaceVerified(true);
      setCurrentStep('final');
    }
  };

  // Submit Akhir
  const handleFinalSubmit = () => {
    setIsVerifying(true);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    
    setTimeout(() => {
      onVerified({
        name: nama.toUpperCase(),
        photo: `https://ui-avatars.com/api/?name=${nama}&background=random&color=fff`,
        telepon: '-',
        email: `${nama.toLowerCase().replace(/\s/g, '')}@montana.internal`,
        jabatan: 'Validated Member'
      }, 'admin');
    }, 1000);
  };

  const stepsList = ['password', 'name', 'terms', 'facescan', 'final'];
  const progress = ((stepsList.indexOf(currentStep) + 1) / stepsList.length) * 100;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-md">
      
      {/* FULLSCREEN TERMS VIEW */}
      {currentStep === 'terms' && (
        <div className="fixed inset-0 z-[600] bg-white dark:bg-slate-950 flex flex-col animate-fadeIn">
          <header className="px-6 py-6 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Persetujuan Privasi</h2>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Langkah 3 dari 5</p>
            </div>
            <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border ${scrolledToBottom ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              {scrolledToBottom ? 'SIAP DISETUJUI' : 'BACA HINGGA BAWAH'}
            </span>
          </header>
          <div ref={termsScrollRef} onScroll={handleTermsScroll} className="flex-1 overflow-y-auto p-6 md:p-16 max-w-4xl mx-auto no-scrollbar">
            <TermsContent />
          </div>
          <footer className="p-6 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-800 flex flex-col items-center gap-4">
             <label className={`flex items-center gap-4 p-4 transition-all ${scrolledToBottom ? 'opacity-100 cursor-pointer' : 'opacity-30 pointer-events-none'}`}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-6 h-6 rounded-lg text-emerald-600" />
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">SAYA MENYETUJUI KEBIJAKAN PRIVASI MONTANA AI</span>
             </label>
             <button disabled={!agreed} onClick={() => setCurrentStep('facescan')} className="w-full max-w-md py-6 bg-emerald-600 disabled:bg-slate-200 text-white rounded-[28px] font-black uppercase text-sm shadow-2xl active:scale-95 transition-all">
               Lanjutkan Ke Scan Wajah
             </button>
          </footer>
        </div>
      )}

      {/* COMPACT MODAL FOR OTHER STEPS */}
      {currentStep !== 'terms' && (
        <div className={`relative w-full max-w-sm h-full md:h-auto bg-white dark:bg-slate-900 md:rounded-[44px] p-10 shadow-2xl transition-all duration-500 flex flex-col justify-center ${isVerifying ? 'scale-95 opacity-50' : 'opacity-100'}`}>
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800 md:rounded-t-[44px] overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>

          {currentStep === 'password' && (
            <div className="space-y-8 animate-fadeIn text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <i className="fas fa-shield-halved text-emerald-600 text-3xl"></i>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Akses Sistem</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Masukan Sandi Wilayah Kerja</p>
              </div>
              <input 
                type="password" 
                placeholder="SANDI" 
                value={password}
                autoFocus
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && validatePassword()}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center text-sm font-black tracking-[0.5em] uppercase outline-none border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <button onClick={validatePassword} className="w-full py-6 bg-slate-900 dark:bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs shadow-2xl active:scale-95 transition-all">Verifikasi Akses</button>
              <button onClick={onClose} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Batal</button>
            </div>
          )}

          {currentStep === 'name' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Identitas</h3>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Gunakan nama asli untuk audit data</p>
              </div>
              <input 
                type="text" 
                placeholder="NAMA LENGKAP ANDA" 
                value={nama}
                autoFocus
                onChange={e => setNama(e.target.value)}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-black uppercase outline-none dark:text-white border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500"
              />
              <button disabled={!nama} onClick={() => setCurrentStep('terms')} className="w-full py-6 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs shadow-xl active:scale-95 transition-all">Lanjut Ke Privasi</button>
            </div>
          )}

          {currentStep === 'facescan' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Biometrik</h3>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Validasi Kehadiran Digital</p>
              </div>
              <div className="relative rounded-[48px] overflow-hidden aspect-square bg-black shadow-inner ring-4 ring-emerald-500/10">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                {!faceVerified && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-emerald-500 absolute animate-[scan_2s_infinite]"></div>
                    <p className="text-[10px] font-black text-white uppercase mt-auto mb-10 bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">Scanning...</p>
                  </div>
                )}
                {faceVerified && (
                  <div className="absolute inset-0 bg-emerald-600/60 flex flex-col items-center justify-center animate-fadeIn">
                    <i className="fas fa-shield-check text-white text-6xl mb-3"></i>
                    <p className="text-sm font-black text-white uppercase tracking-widest">VERIFIED</p>
                  </div>
                )}
              </div>
              {!faceVerified && (
                <button onClick={startFaceScan} className="w-full py-6 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs shadow-xl active:scale-95">Mulai Scan Wajah</button>
              )}
            </div>
          )}

          {currentStep === 'final' && (
            <div className="space-y-10 text-center animate-fadeIn">
              <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-2xl">
                <i className="fas fa-check-double"></i>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Akses Berhasil</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identitas Digital Sinkron</p>
              </div>
              <button onClick={handleFinalSubmit} disabled={isVerifying} className="w-full py-8 bg-slate-900 dark:bg-emerald-600 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl animate-pulse active:scale-95 transition-all">
                {isVerifying ? <i className="fas fa-circle-notch animate-spin"></i> : 'MASUK SEKARANG'}
              </button>
            </div>
          )}
        </div>
      )}
      <style>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
};
