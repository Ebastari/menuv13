
import React, { useState } from 'react';

const LOGO_URL = "https://i.ibb.co.com/pjNwjtj0/montana-AI-1-1.jpg";

interface SystemHistoryProps {
  language?: 'id' | 'en';
}

const SUMMARY_CARDS = (lang: 'id' | 'en') => [
  {
    id: 'verif',
    title: lang === 'id' ? 'Standarisasi Verifikasi' : 'Verification Standards',
    icon: 'fa-shield-check',
    desc: lang === 'id' ? 'Menghilangkan fraud metadata dan duplikasi data lapangan dengan geotagging tervalidasi.' : 'Eliminating metadata fraud and field data duplication with validated geotagging.'
  },
  {
    id: 'mon',
    title: lang === 'id' ? 'Monitoring Real-Time' : 'Real-Time Monitoring',
    icon: 'fa-clock-rotate-left',
    desc: lang === 'id' ? 'Transisi dari inspeksi reaktif ke dashboard perkembangan tanaman yang terpantau instan.' : 'Transitioning from reactive inspections to instant growth tracking dashboards.'
  },
  {
    id: 'frag',
    title: lang === 'id' ? 'Fragmentasi Data' : 'Data Fragmentation',
    icon: 'fa-sitemap',
    desc: lang === 'id' ? 'Konsolidasi data dari berbagai sumber ke dalam satu Single Source of Truth yang terintegrasi.' : 'Consolidating data from various sources into one integrated Single Source of Truth.'
  }
];

export const SystemHistory: React.FC<SystemHistoryProps> = ({ language = 'id' }) => {
  const [isNarrativeVisible, setIsNarrativeVisible] = useState(false);

  const toggleNarrative = () => {
    setIsNarrativeVisible(!isNarrativeVisible);
    if (!isNarrativeVisible) {
      setTimeout(() => {
        document.getElementById('archive-start')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <section className="space-y-16 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="flex flex-col">
          <h3 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.4em] mb-4">Archival Intelligence</h3>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
            {language === 'id' ? 'Evolusi & ' : 'Evolution & '}<span className="text-emerald-600">{language === 'id' ? 'History Sistem' : 'System History'}</span>
          </p>
        </div>
        <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 max-w-sm text-left md:text-right leading-relaxed">
          {language === 'id' ? 'Memahami perjalanan transformasi dari proses konvensional menuju kedaulatan data berbasis AI Montana Pro.' : 'Understanding the transformation journey from conventional processes to AI-based data sovereignty.'}
        </p>
      </div>

      {!isNarrativeVisible ? (
        <div className="space-y-12 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUMMARY_CARDS(language as 'id' | 'en').map((card) => (
              <div key={card.id} className="bg-white dark:bg-slate-900 p-10 rounded-[44px] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-6 shadow-inner">
                  <i className={`fas ${card.icon}`}></i>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{card.title}</h4>
                <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-200 font-medium">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative group cursor-pointer" onClick={toggleNarrative}>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[48px] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
            <div className="relative bg-slate-900 dark:bg-slate-800 rounded-[48px] p-16 text-center overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
               <div className="relative z-10 space-y-6">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <i className="fas fa-scroll text-3xl text-emerald-400"></i>
                  </div>
                  <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">{language === 'id' ? 'Buka Arsip Sejarah Digital' : 'Open Digital History Archive'}</h3>
                  <p className="text-base text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
                    {language === 'id' ? 'Klik untuk mengeksplorasi narasi mendalam mengenai latar belakang, dampak masalah, dan analisis QCDSM yang melandasi pengembangan Montana AI Pro.' : 'Click to explore deep narratives about the background, impacts, and QCDSM analysis behind Montana AI Pro development.'}
                  </p>
                  <div className="pt-6">
                    <span className="inline-block px-12 py-5 bg-emerald-600 text-white rounded-3xl text-[12px] font-black uppercase tracking-widest group-hover:scale-105 transition-transform active:scale-95 shadow-2xl">
                      {language === 'id' ? 'Eksplorasi Sekarang' : 'Explore Now'}
                    </span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="archive-start" className="bg-white dark:bg-slate-950 rounded-[60px] border border-slate-300 dark:border-slate-800 shadow-2xl animate-drift-puff overflow-hidden">
          <div className="relative h-[450px]">
             <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000" className="w-full h-full object-cover" alt="History" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
             <div className="absolute top-10 left-10">
                <button onClick={toggleNarrative} className="px-8 py-3.5 bg-white/20 hover:bg-white/40 backdrop-blur-xl border border-white/40 text-white rounded-full text-[11px] font-bold uppercase tracking-widest transition-all">
                  <i className="fas fa-arrow-left mr-2"></i> {language === 'id' ? 'Tutup Arsip' : 'Close Archive'}
                </button>
             </div>
             <div className="absolute bottom-16 left-16 right-16">
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">{language === 'id' ? 'Arsip Evolusi ' : 'Evolution Archive '}<br/> Montana AI Pro</h2>
                <div className="flex gap-6">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-500/40 px-5 py-2 rounded-full bg-emerald-500/10">v4.5 Official Log</span>
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest border border-white/20 px-5 py-2 rounded-full">Internal Documentation</span>
                </div>
             </div>
          </div>

          <div className="p-12 md:p-32 space-y-28 max-w-4xl mx-auto">
             <section className="space-y-12">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-1 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{language === 'id' ? '1.1 Identifikasi Masalah Utama' : '1.1 Primary Issue Identification'}</h3>
                </div>

                <div className="space-y-20">
                  {[
                    { 
                      id: 'A', 
                      title: language === 'id' ? 'Tidak Adanya Sistem Standar Verifikasi' : 'Absence of Standardized Verification', 
                      body: language === 'id' ? 'Bukti lapangan seperti foto penanaman, titik koordinat, dan ID tanaman sering dicatat secara manual tanpa geotag yang tervalidasi. Tanpa verifikasi otomatis, data rawan duplikasi dan tidak dapat dijadikan bukti kuat pada audit PROPER maupun inspeksi regulasi.' : 'Field evidence like planting photos and GPS points were manually recorded without validated geotags. Without automatic verification, data was prone to duplication and failed to provide strong evidence for audits.'
                    },
                    { 
                      id: 'B', 
                      title: language === 'id' ? 'Kesulitan Monitoring Real-Time' : 'Real-Time Monitoring Difficulties', 
                      body: language === 'id' ? 'Pertumbuhan tanaman masih dicatat secara manual dan tidak terintegrasi, menghambat dashboard perkembangan yang instan. Monitoring lapangan memerlukan kunjungan fisik berulang yang memakan waktu dan biaya operasional tinggi.' : 'Plant growth was manually recorded and unintegrated, hindering instant progress dashboards. Field monitoring required repeated physical visits, driving up operational costs.'
                    }
                  ].map(item => (
                    <div key={item.id} className="space-y-5">
                      <h4 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight flex items-center gap-4">
                        <span className="text-slate-300 dark:text-slate-700 text-3xl font-black">{item.id}.</span> {item.title}
                      </h4>
                      <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed text-justify">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
             </section>

             <section className="pt-24 border-t border-slate-200 dark:border-slate-800 text-center space-y-10">
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter max-w-2xl mx-auto italic leading-tight">
                  {language === 'id' ? '“Transparansi bukan sekadar angka, melainkan integritas setiap pixel data yang kami jaga secara berkelanjutan.”' : '“Transparency is not just numbers, but the integrity of every pixel of data we maintain sustainably.”'}
                </p>
                <div className="flex flex-col items-center gap-8">
                   <div className="w-20 h-20 bg-slate-900 dark:bg-emerald-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl">
                      <img src={LOGO_URL} className="w-10 h-10 object-contain rounded-xl" alt="Logo" />
                   </div>
                   <button onClick={toggleNarrative} className="px-14 py-6 bg-slate-900 dark:bg-emerald-600 text-white rounded-3xl text-[13px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                      {language === 'id' ? 'Selesai Membaca' : 'Finish Reading'}
                   </button>
                </div>
             </section>
          </div>
        </div>
      )}
    </section>
  );
};
