
import React, { useEffect, useRef, useState } from 'react';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  user: UserProfileType;
  isOAuthAuthenticated: boolean;
  onOAuthSuccess: (data: { name: string; photo: string; email: string }) => void;
  onEdit: () => void;
  onLogout: () => void;
}

interface VaultEntry {
  id: number;
  timestamp: string;
  event: string;
  role: string;
  user: string;
}

const GOOGLE_CLIENT_ID = "357045986446-03056acv0ggnrhv7irv1dtk3b0fn5vmf.apps.googleusercontent.com";

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const UserProfileView: React.FC<UserProfileProps> = ({ 
  user, 
  isOAuthAuthenticated, 
  onOAuthSuccess,
  onEdit, 
  onLogout 
}) => {
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [vaultData, setVaultData] = useState<VaultEntry[]>([]);
  const [showVault, setShowVault] = useState(false);

  useEffect(() => {
    const fetchVault = () => {
      // Menaikkan versi ke 2 untuk memaksa upgrade dan pembuatan tabel yang hilang
      const request = indexedDB.open('MontanaVault', 2);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        console.log("Upgrading MontanaVault DB...");
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
          console.log("Object store 'history' created successfully.");
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        // Hanya jalankan transaksi jika store 'history' benar-benar ada
        if (!db.objectStoreNames.contains('history')) {
          console.warn("Object store 'history' still not found after upgrade.");
          return;
        }
        
        try {
          const transaction = db.transaction(['history'], 'readonly');
          const store = transaction.objectStore('history');
          const getAll = store.getAll();
          getAll.onsuccess = () => {
            setVaultData(getAll.result.reverse());
          };
        } catch (err) {
          console.error("Transaction failed:", err);
        }
      };

      request.onerror = (e) => console.error("Vault DB Error:", e);
    };
    fetchVault();

    const renderGoogleButton = () => {
      const google = (window as any).google;
      if (!isOAuthAuthenticated && google && googleBtnRef.current) {
        try {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response: any) => {
              console.log("Google OAuth response:", response);
              const payload = parseJwt(response.credential);
              if (payload) {
                console.log("Parsed JWT payload:", payload);
                onOAuthSuccess({
                  name: payload.name,
                  photo: payload.picture,
                  email: payload.email
                });
              } else {
                console.error("Failed to parse JWT token");
              }
            },
            error_callback: (error: any) => {
              console.error("Google OAuth error:", error);
            }
          });
          google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "filled_blue",
            size: "large",
            width: 300,
            shape: "pill",
            text: "continue_with"
          });
          console.log("Google OAuth button rendered successfully");
        } catch (error) {
          console.error("Error rendering Google OAuth button:", error);
        }
      }
    };

    // Check if Google API is already loaded
    if ((window as any).google) {
      renderGoogleButton();
    } else {
      // Wait for Google API to load
      const checkGoogleAPI = setInterval(() => {
        if ((window as any).google) {
          clearInterval(checkGoogleAPI);
          renderGoogleButton();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogleAPI);
        console.error("Google OAuth API failed to load");
      }, 10000);
    }
  }, [isOAuthAuthenticated]);

  return (
    <div className="animate-fadeIn space-y-8 pb-20">
      <div className="bg-white dark:bg-slate-900 rounded-[44px] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative mb-8">
            <img
              src={user.photo || 'https://ui-avatars.com/api/?name=User&background=cbd5e1&color=fff'}
              className="w-32 h-32 rounded-[40px] object-cover border-4 border-white dark:border-slate-800 shadow-2xl transform group-hover:rotate-3 transition-transform duration-500"
              alt={user.name}
            />
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${isOAuthAuthenticated ? 'bg-emerald-500' : 'bg-slate-300'} border-4 border-white dark:border-slate-900 rounded-full shadow-lg`}></div>
          </div>
          
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">{user.name}</h2>
          <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.4em] mt-3 bg-emerald-500/5 px-4 py-1.5 rounded-full inline-block">
            {user.jabatan || 'Anggota Lapangan'}
          </p>
          
          <div className="flex flex-col gap-4 mt-10 w-full max-w-sm">
            {isOAuthAuthenticated ? (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex gap-4">
                  <button
                    onClick={onEdit}
                    className="flex-1 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                  >
                    <i className="fas fa-user-pen"></i> Edit Profil
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex-1 py-4 bg-rose-500/10 text-rose-600 rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-white active:scale-95 transition-all"
                  >
                    <i className="fas fa-power-off"></i> Keluar
                  </button>
                </div>
                <button
                  onClick={() => setShowVault(!showVault)}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all border border-slate-200 dark:border-slate-700"
                >
                  <i className={`fas ${showVault ? 'fa-eye-slash' : 'fa-database'}`}></i> {showVault ? 'Tutup Data Vault' : 'Buka Montana Vault'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[32px] border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <i className="fas fa-shield-keyhole text-emerald-500"></i>
                  </div>
                  <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Verifikasi Google Diperlukan</h4>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-relaxed">
                    Beberapa fitur profil terkunci. Hubungkan akun Google Anda untuk memverifikasi identitas digital dan membuka akses penuh.
                  </p>
                  <div className="flex justify-center" ref={googleBtnRef}></div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full py-3 text-[9px] font-black text-rose-500 uppercase tracking-widest"
                >
                  <i className="fas fa-arrow-left-from-bracket mr-2"></i> Log out Administrator
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showVault && (
        <div className="bg-slate-900 dark:bg-black rounded-[44px] p-8 shadow-2xl animate-drift-puff">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Montana Database Vault</h3>
             </div>
             <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">{vaultData.length} RECORDS</span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 no-scrollbar">
            {vaultData.length > 0 ? vaultData.map((entry) => (
              <div key={entry.id} className="p-5 bg-white/5 border border-white/10 rounded-[28px] space-y-3">
                 <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">{entry.event}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                 </div>
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-user-shield text-slate-500 text-[10px]"></i>
                      <span className="text-[9px] font-black text-white uppercase">{entry.user}</span>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase px-2 py-0.5 bg-white/5 rounded-md">ID: {entry.id}</span>
                 </div>
                 <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">{new Date(entry.timestamp).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            )) : (
              <div className="py-10 text-center">
                <i className="fas fa-database text-slate-700 text-3xl mb-4"></i>
                <p className="text-[10px] font-black text-slate-600 uppercase">Database Kosong</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border border-slate-100 dark:border-slate-800 transition-all ${!isOAuthAuthenticated ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Informasi Akun Terverifikasi</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[28px] border border-slate-100 dark:border-white/5">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center text-lg">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Email Korespondensi</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user.email || 'Belum ditautkan'}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[28px] border border-slate-100 dark:border-white/5">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center text-lg">
              <i className="fas fa-phone-volume"></i>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">WhatsApp Aktif</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user.telepon || 'Belum terdaftar'}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[28px] border border-slate-100 dark:border-white/5">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center text-lg">
              <i className="fas fa-id-badge"></i>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Peran Struktural</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user.jabatan || 'Anggota Lapangan'}</p>
            </div>
          </div>
        </div>
        
        {!isOAuthAuthenticated && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-center">
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 animate-pulse">
               <i className="fas fa-lock text-emerald-500"></i>
               Data terkunci sementara
             </p>
          </div>
        )}
      </div>
    </div>
  );
};
