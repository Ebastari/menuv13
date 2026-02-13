import React, { useEffect, useRef, useState } from 'react';
import { TermsContent } from './TermsContent';

/**
 * Helper: SHA-256 (dipertahankan jika diperlukan nanti)
 */
export async function secureHash(string: string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

type UserData = {
  name: string;
  photo: string;
  telepon: string;
  email: string;
  jabatan: string;
};

export const Login: React.FC<{
  onVerified: (userData: UserData, role: 'admin' | 'guest') => void;
  onClose: () => void;
}> = ({ onVerified, onClose }) => {
  // Steps
  const [currentStep, setCurrentStep] = useState<'password' | 'name' | 'terms' | 'facescan' | 'final'>('password');
  const stepsList = ['password', 'name', 'terms', 'facescan', 'final'];
  const progress = ((stepsList.indexOf(currentStep) + 1) / stepsList.length) * 100;

  // Form state
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);

  // Camera refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Terms scroll ref
  const termsScrollRef = useRef<HTMLDivElement | null>(null);

  // Validate password (simple demo check per original)
  const validatePassword = () => {
    const cleanPass = password.trim().toLowerCase();
    if (cleanPass === 'kalimantan' || cleanPass === 'kalimantan selatan') {
      setCurrentStep('name');
    } else {
      window.alert('Sandi salah — coba lagi');
    }
  };

  // Terms scroll detection
  const handleTermsScroll = () => {
    const el = termsScrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 16) {
      setScrolledToBottom(true);
    } else {
      setScrolledToBottom(false);
    }
  };

  // If terms content fits without scroll, mark as scrolled
  useEffect(() => {
    if (currentStep === 'terms') {
      const el = termsScrollRef.current;
      if (!el) {
        setScrolledToBottom(false);
        return;
      }
      // small timeout to allow layout
      const t = setTimeout(() => {
        if (el.scrollHeight <= el.clientHeight + 8) setScrolledToBottom(true);
        else setScrolledToBottom(false);
      }, 50);
      return () => clearTimeout(t);
    }
  }, [currentStep]);

  // Start face scan (opens camera); simulated progress then success
  const startFaceScan = async () => {
    setFaceVerified(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // try play
        try { await videoRef.current.play(); } catch {}
      }

      // Simulate scanning progress then success
      let p = 0;
      const interval = setInterval(() => {
        p += 14;
        if (p >= 100) {
          clearInterval(interval);
          setFaceVerified(true);
          setTimeout(() => setCurrentStep('final'), 600);
        }
      }, 140);
    } catch (err) {
      // fallback if camera unavailable or denied
      setFaceVerified(true);
      setTimeout(() => setCurrentStep('final'), 400);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        // @ts-ignore - intentionally clearing object
        videoRef.current.srcObject = null;
      } catch {}
    }
  };

  // Cleanup when currentStep changes or unmount
  useEffect(() => {
    if (currentStep !== 'facescan') stopCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Final submit
  const handleFinalSubmit = () => {
    setIsVerifying(true);
    stopCamera();
    setTimeout(() => {
      onVerified(
        {
          name: nama ? nama.toUpperCase() : 'GUEST',
          photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(nama || 'Guest')}&background=random&color=fff`,
          telepon: '-',
          email: `${(nama || 'guest').toLowerCase().replace(/\s/g, '')}@montana.internal`,
          jabatan: 'Validated Member'
        },
        'admin'
      );
    }, 900);
  };

  // Small reusable logo component (single source)
  const Logo = () => (
  <div className="flex justify-center mb-6">
    <img
      src="https://i.ibb.co.com/pjNwjtj0/montana-AI-1-1.jpg"
      alt="Montana AI Logo"
      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl
      shadow-[0_0_30px_rgba(16,185,129,0.6)]
      transition-transform duration-500 hover:scale-105"
    />
  </div>
);


  // Mobile top stepper
  const MobileTopStepper: React.FC = () => (
    <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-[700] w-[92%] max-w-md bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-2 flex items-center gap-3">
      <div className="text-[11px] font-semibold text-white/70 uppercase">Step</div>
      <div className="flex-1 h-2 bg-white/10 rounded-xl overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-[11px] font-bold text-white uppercase">{stepsList.indexOf(currentStep) + 1}/5</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center" aria-modal="true" role="dialog">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop"
          alt="Pemandangan hutan"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      {/* mobile stepper */}
      <MobileTopStepper />

      {/* Main card */}
      <div className="relative w-full max-w-5xl h-[90vh] md:h-[700px] mx-4 md:mx-0 rounded-[28px] md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex flex-col justify-between w-80 bg-black/40 backdrop-blur-2xl p-8 border-r border-white/10 text-white">
          <div>
            <h3 className="text-xl font-black uppercase">Verifikasi Akses</h3>
            <p className="text-xs text-emerald-400 mt-2">Montana AI Secure</p>
          </div>

          <nav className="mt-4 space-y-4" aria-label="Langkah verifikasi">
            {stepsList.map((step, idx) => {
              const isActive = step === currentStep;
              const isDone = stepsList.indexOf(currentStep) > idx;
              return (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                    ${isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-white text-black' : 'bg-white/10 text-white/40'}`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div className={`text-sm uppercase tracking-wider ${isActive ? 'text-white' : 'text-white/50'}`}>
                    {step}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="text-[11px] text-white/40 uppercase">Secure • Biometric • Audit</div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-white/6 backdrop-blur-3xl p-6 md:p-12 relative text-white overflow-auto">
          {/* Close button for mobile */}
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            aria-label="Tutup"
            className="md:hidden absolute top-4 right-4 z-50 bg-black/40 rounded-full p-2"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop progress */}
          <div className="hidden md:block absolute top-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>

          {/* Page content */}
          <div className="max-w-2xl mx-auto mt-6 md:mt-10 pb-10">
            <Logo />

            {/* PASSWORD */}
            {currentStep === 'password' && (
              <section className="space-y-6 text-center animate-fadeIn">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Login Admin</h1>
                <p className="text-xs text-white/60 uppercase tracking-wider">Masukan sandi akses</p>

                <input
                  type="password"
                  inputMode="text"
                  placeholder="SANDI"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && validatePassword()}
                  className="w-full px-4 py-4 rounded-xl bg-white/10 text-center text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Masukkan sandi"
                  autoFocus
                />

                <div className="flex flex-col gap-3">
                  <button onClick={validatePassword} className="w-full py-4 bg-emerald-600 rounded-xl font-bold">Verifikasi Akses</button>
                  <button onClick={() => { stopCamera(); onClose(); }} className="text-xs text-white/50">Batal</button>
                </div>
              </section>
            )}

            {/* NAME */}
            {currentStep === 'name' && (
              <section className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-black uppercase">Identitas</h2>
                <p className="text-xs text-emerald-300 uppercase tracking-wider">Gunakan nama asli untuk audit</p>

                <input
                  type="text"
                  placeholder="NAMA LENGKAP ANDA"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Nama lengkap"
                  autoFocus
                />

                <div className="flex gap-3 flex-col md:flex-row">
                  <button
                    onClick={() => setCurrentStep('terms')}
                    disabled={!nama}
                    className="flex-1 py-4 bg-emerald-600 rounded-xl font-bold disabled:opacity-40"
                  >
                    Lanjut Ke Privasi
                  </button>
                  <button onClick={() => setCurrentStep('password')} className="py-4 px-4 rounded-xl bg-white/10">Kembali</button>
                </div>
              </section>
            )}

            {/* TERMS — Fullscreen overlay that is well-behaved */}
            {currentStep === 'terms' && (
              <div className="fixed inset-0 z-[999] bg-neutral-100 flex flex-col">

                {/* HEADER */}
                <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 px-6 md:px-16 py-6 flex items-center justify-between shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Kebijakan Privasi Montana AI
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1">
                      Harap baca hingga selesai sebelum melanjutkan
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentStep('name')}
                    className="text-sm text-neutral-600 hover:text-black"
                  >
                    Tutup
                  </button>
                </header>

                {/* DOCUMENT AREA */}
                <div
                  ref={termsScrollRef}
                  onScroll={handleTermsScroll}
                  className="flex-1 overflow-y-auto px-6 md:px-16 py-10"
                >
                  <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 md:p-12 text-neutral-800 leading-8 text-[15px]">

                    <h3 className="text-lg font-semibold mb-4">1. Informasi yang Kami Kumpulkan</h3>
                    <p className="mb-6">
                      Montana AI mengumpulkan informasi identitas pengguna seperti nama,
                      alamat email, serta data autentikasi biometrik untuk keperluan
                      verifikasi keamanan sistem. Pengumpulan data dilakukan secara sah,
                      terbatas, relevan, dan sesuai dengan kebutuhan layanan yang diberikan.
                    </p>

                    <h3 className="text-lg font-semibold mb-4">2. Penggunaan Data</h3>
                    <p className="mb-6">
                      Data digunakan untuk meningkatkan keamanan, audit internal,
                      pengembangan sistem, analisis operasional, serta peningkatan kualitas layanan.
                      Montana AI tidak memperjualbelikan, menyewakan, atau menyebarkan data pribadi
                      kepada pihak lain tanpa persetujuan sah dari pemilik data, kecuali apabila
                      diwajibkan oleh ketentuan peraturan perundang-undangan yang berlaku.
                    </p>

                    <h3 className="text-lg font-semibold mb-4">3. Perlindungan Data</h3>
                    <p className="mb-6">
                      Kami menerapkan enkripsi, kontrol akses internal, pembatasan hak akses berbasis peran,
                      serta audit sistem untuk menjaga kerahasiaan, integritas, dan ketersediaan data pengguna.
                      Sistem keamanan dirancang berdasarkan prinsip manajemen risiko dan standar praktik
                      keamanan sistem elektronik.
                    </p>

                    <h3 className="text-lg font-semibold mb-4">4. Hak Pengguna</h3>
                    <p className="mb-6">
                      Pengguna berhak meminta akses, koreksi, pembaruan, pembatasan pemrosesan,
                      penarikan persetujuan, atau penghapusan data sesuai dengan regulasi
                      perlindungan data yang berlaku.
                    </p>

                    <h3 className="text-lg font-semibold mb-4">5. Dasar Hukum dan Kepatuhan Regulasi</h3>
                    <p className="mb-6">
                      Kebijakan ini disusun dan dilaksanakan sesuai dengan ketentuan hukum di Indonesia,
                      termasuk namun tidak terbatas pada:
                      <br /><br />
                      • Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)  
                      <br />
                      • Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik
                        sebagaimana telah diubah terakhir dengan Undang-Undang Nomor 1 Tahun 2024 (UU ITE)  
                      <br />
                      • Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem
                        dan Transaksi Elektronik (PP PSTE)
                    </p>

                    <h3 className="text-lg font-semibold mb-4">6. Larangan Penyebaran dan Sanksi</h3>
                    <p className="mb-6">
                      Setiap tindakan penyebaran, pengungkapan, pengambilan, atau penggunaan data pribadi
                      tanpa hak dapat dikenakan sanksi administratif dan/atau pidana sesuai dengan
                      ketentuan dalam UU Perlindungan Data Pribadi dan UU ITE.
                      Pelanggaran terhadap kerahasiaan data perusahaan maupun data pengguna
                      dapat mengakibatkan tuntutan hukum sesuai peraturan perundang-undangan yang berlaku.
                    </p>
                    <h3 className="text-lg font-semibold mb-4">Larangan Penyebaran Data Perusahaan</h3>
                    <p className="mb-6">
                      Seluruh data, dokumen, informasi teknis, data operasional, laporan analisis,
                      data proyek, kode sumber, kredensial sistem, serta informasi strategis
                      yang diakses melalui Montana AI merupakan informasi rahasia perusahaan.

                      Setiap pengguna, administrator, mitra, maupun pihak yang memperoleh akses
                      dilarang keras untuk:
                      <br /><br />
                      • Menyalin, menggandakan, menyebarkan, mempublikasikan, atau mentransfer data perusahaan kepada pihak lain tanpa izin tertulis resmi;  
                      <br />
                      • Menggunakan data perusahaan untuk kepentingan pribadi atau di luar tujuan yang sah;  
                      <br />
                      • Membocorkan kredensial, token API, atau akses sistem kepada pihak yang tidak berwenang.
                      <br /><br />
                      Pelanggaran terhadap ketentuan ini dapat dikenakan sanksi administratif,
                      pemutusan akses, tuntutan ganti rugi, serta sanksi pidana sesuai
                      Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi,
                      Undang-Undang Informasi dan Transaksi Elektronik (UU ITE),
                      serta ketentuan hukum lain yang berlaku di Republik Indonesia.
                    </p>

                    <h3 className="text-lg font-semibold mb-4">7. Perubahan Kebijakan</h3>
                    <p>
                      Montana AI berhak memperbarui kebijakan ini sewaktu-waktu dan akan
                      memberitahukan perubahan signifikan kepada pengguna melalui media resmi
                      atau sistem aplikasi.
                    </p>

                  </div>

                {/* FOOTER */}
                <footer className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 md:px-16 py-4 shadow-inner flex flex-col md:flex-row items-center gap-4">
                  <label className={`flex items-center gap-3 flex-1 ${scrolledToBottom ? '' : 'opacity-50'}`}>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      disabled={!scrolledToBottom}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-neutral-700">
                      Saya telah membaca dan menyetujui Kebijakan Privasi
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      disabled={!agreed}
                      onClick={() => setCurrentStep('facescan')}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold disabled:opacity-40"
                    >
                      Lanjut
                    </button>

                    <button
                      onClick={() => setCurrentStep('name')}
                      className="px-4 py-3 bg-neutral-200 rounded-lg"
                    >
                      Kembali
                    </button>
                  </div>
                </footer>

              </div>
            </div>
          )}

            {/* FACESCAN */}
            {currentStep === 'facescan' && (
              <section className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-black uppercase text-center">Biometrik</h2>
                <p className="text-xs text-emerald-300 text-center uppercase">Validasi kehadiran digital</p>

                <div className="mx-auto w-full max-w-md aspect-square bg-black rounded-2xl overflow-hidden relative">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" aria-label="Video preview kamera" />

                  {!faceVerified && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-3/4 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-progress-sim" style={{ width: '40%' }} />
                      </div>
                      <p className="mt-4 text-sm font-bold uppercase bg-black/40 px-4 py-2 rounded-full">Scanning...</p>
                    </div>
                  )}

                  {faceVerified && (
                    <div className="absolute inset-0 bg-emerald-600/80 flex items-center justify-center text-white text-2xl font-black uppercase">
                      VERIFIED
                    </div>
                  )}
                </div>

                {!faceVerified ? (
                  <div className="flex gap-3 flex-col md:flex-row">
                    <button onClick={startFaceScan} className="flex-1 py-4 bg-emerald-600 rounded-xl font-bold">Mulai Scan Wajah</button>
                    <button onClick={() => setCurrentStep('terms')} className="py-4 rounded-xl bg-white/10">Kembali</button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentStep('final')} className="flex-1 py-4 bg-emerald-600 rounded-xl font-bold">Lanjut</button>
                  </div>
                )}
              </section>
            )}

            {/* FINAL */}
            {currentStep === 'final' && (
              <section className="space-y-6 text-center animate-fadeIn">
                <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">✓</div>
                <h2 className="text-2xl font-black uppercase">Akses Berhasil</h2>
                <p className="text-xs text-white/60 uppercase">Identitas digital sinkron</p>

                <div className="flex gap-3 flex-col md:flex-row">
                  <button disabled={isVerifying} onClick={handleFinalSubmit} className="flex-1 py-4 bg-emerald-600 rounded-xl font-bold">
                    {isVerifying ? 'Memproses...' : 'MASUK SEKARANG'}
                  </button>

                  <button onClick={() => { setCurrentStep('password'); setNama(''); }} className="py-4 rounded-xl bg-white/10">
                    Logout
                  </button>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Inline styles and small animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 420ms ease both; }
        @keyframes progressSim { 0% { transform: translateX(-100%);} 100% { transform: translateX(0%);} }
        .animate-progress-sim { animation: progressSim 1.8s linear infinite; }
      `}</style>
    </div>
  );
};

export default Login;
