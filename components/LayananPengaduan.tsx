
import React, { useState } from 'react';

export interface FeatureDetail {
  id: string;
  title: string;
  highlight: string;
  longNarrative: string;
  icon: string;
  category: string;
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

interface LayananPengaduanProps {
  language?: 'id' | 'en';
}

const TRANSLATIONS = {
  id: {
    headerSub: "System Intelligence",
    headerTitle: "Narasi Sistem Montana AI",
    headerDesc: "Eksplorasi 10 arsitektur modul yang membangun ekosistem digital Montana Pro.",
    learnMore: "Pelajari Detail",
    backBtn: "Kembali ke Daftar",
    deepNarrative: "Arsitektur Narasi Mendalam",
    assetId: "Digital Asset ID",
    finishBtn: "Selesai Membaca",
    supportTitle: "Butuh Pendalaman Teknis?",
    supportDesc: "Gunakan Chatbox AI di bawah untuk mendapatkan rincian spesifik modul.",
    faqTitle: "Pertanyaan yang Sering Diajukan",
    faqDesc: "Pelajari lebih lanjut tentang fitur dan manfaat My Montana AI",
    expandFaq: "Buka",
    collapseFaq: "Tutup"
  },
  en: {
    headerSub: "System Intelligence",
    headerTitle: "Montana AI System Narrative",
    headerDesc: "Explore 10 module architectures that build the Montana Pro digital ecosystem.",
    learnMore: "Learn More",
    backBtn: "Back to List",
    deepNarrative: "Deep Narrative Architecture",
    assetId: "Digital Asset ID",
    finishBtn: "Finish Reading",
    supportTitle: "Need Technical Deep-dive?",
    supportDesc: "Use the AI Chatbox below to get specific module details.",
    faqTitle: "Frequently Asked Questions",
    faqDesc: "Learn more about My Montana AI features and benefits",
    expandFaq: "Expand",
    collapseFaq: "Collapse"
  }
};

export const MONTANA_FEATURES = (lang: 'id' | 'en'): FeatureDetail[] => [
  {
    id: 'camera-v2',
    title: lang === 'id' ? 'Montana Camera V2' : 'Montana Camera V2',
    highlight: lang === 'id' ? 'Dokumentasi visual presisi tinggi dengan validasi metadata GPS & Timestamp permanen.' : 'High-precision visual documentation with permanent GPS & Timestamp metadata validation.',
    category: 'Hardware',
    icon: 'fa-camera-retro',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200',
    longNarrative: lang === 'id' ? `Melalui integrasi kamera Montana V2 dan sensor tinggi tanaman, Montana AI mampu melakukan pemantauan visual dan kuantitatif terhadap pertumbuhan tanaman di lapangan secara objektif. Teknologi ini menghilangkan celah manipulasi data (fraud documentation) yang sering terjadi pada pelaporan manual. Dengan Montana Camera V2, setiap progres pertumbuhan pohon dapat dilacak secara temporal (waktu) dan spasial (lokasi).` : `Through the integration of the Montana V2 camera and plant height sensors, Montana AI performs objective visual and quantitative monitoring of field plant growth. This technology eliminates data manipulation gaps (fraud documentation) common in manual reporting. With Montana Camera V2, every tree growth progress is trackable temporally (time) and spatially (location).`
  },
  {
    id: 'ai-dashboard',
    title: lang === 'id' ? 'Dashboard Bibit AI' : 'AI Seedling Dashboard',
    highlight: lang === 'id' ? 'Sentralisasi data stok nursery terpadu yang terhubung dengan algoritma analitik real-time.' : 'Centralized nursery stock data integrated with real-time analytical algorithms.',
    category: 'Analytics',
    icon: 'fa-chart-pie',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200',
    longNarrative: lang === 'id' ? `Sistem ini meminimalkan kesalahan pencatatan manual serta memastikan ketersediaan data yang valid untuk pengambilan keputusan strategis. Dashboard ini menyajikan resume harian mengenai jumlah bibit masuk, bibit keluar untuk penanaman, hingga tingkat mortalitas di nursery.` : `This system minimizes manual recording errors and ensures valid data availability for strategic decision-making. This dashboard presents daily resumes of incoming seedlings, outgoing seedlings, and mortality rates in the nursery.`
  },
  {
    id: 'assistant-ai',
    title: lang === 'id' ? 'Montana Assistant' : 'Montana Assistant',
    highlight: lang === 'id' ? 'Asisten AI berbasis LLM untuk konsultasi teknis revegetasi dan instruksi sistem.' : 'LLM-based AI Assistant for technical revegetation consultation and system instructions.',
    category: 'AI Chat',
    icon: 'fa-robot',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200',
    longNarrative: lang === 'id' ? `Montana Assistant menggunakan kecerdasan buatan untuk menjawab pertanyaan teknis seputar operasional lapangan. Mulai dari SOP penanaman hingga analisis data cuaca, asisten ini tersedia 24/7 untuk mendukung tim di lapangan maupun manajerial.` : `Montana Assistant uses artificial intelligence to answer technical questions about field operations. From planting SOPs to weather data analysis, this assistant is available 24/7 to support field and managerial teams.`
  },
  {
    id: 'vision-health',
    title: lang === 'id' ? 'AI Vision Health' : 'AI Vision Health',
    highlight: lang === 'id' ? 'Deteksi dini kesehatan daun dan gejala penyakit menggunakan Computer Vision.' : 'Early detection of leaf health and disease symptoms using Computer Vision.',
    category: 'Vision',
    icon: 'fa-microscope',
    image: 'https://images.unsplash.com/photo-1530836361253-efad5d6ff440?q=80&w=1200',
    longNarrative: lang === 'id' ? `Algoritma Vision kami mampu menganalisis citra daun untuk mengidentifikasi defisiensi nutrisi atau serangan hama. Dengan deteksi dini, tindakan korektif dapat dilakukan lebih cepat sebelum berdampak luas pada area reklamasi.` : `Our Vision algorithms can analyze leaf imagery to identify nutrient deficiencies or pest attacks. With early detection, corrective actions can be taken faster before widespread impact occurs on reclamation areas.`
  },
  {
    id: 'height-sensor',
    title: lang === 'id' ? 'Sensor Tinggi Digital' : 'Digital Height Meter',
    highlight: lang === 'id' ? 'Pengukuran tinggi tanaman otomatis yang terkalibrasi dengan database pertumbuhan.' : 'Automatic plant height measurement calibrated with the growth database.',
    category: 'Tools',
    icon: 'fa-arrows-up-down',
    image: 'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=1200',
    longNarrative: lang === 'id' ? `Menggantikan metode pengukuran manual yang subyektif, sensor ini memberikan data numerik yang langsung masuk ke sistem. Memungkinkan pembuatan kurva pertumbuhan (Growth Curve) yang akurat untuk setiap blok penanaman.` : `Replacing subjective manual measurement methods, this sensor provides numerical data that feeds directly into the system. It enables the creation of accurate Growth Curves for every planting block.`
  },
  {
    id: 'nursery-ops',
    title: lang === 'id' ? 'Manajemen Nursery' : 'Integrated Nursery',
    highlight: lang === 'id' ? 'Digitalisasi logbook nursery dari tahap penyemaian hingga siap tanam.' : 'Digitalization of nursery logbooks from seeding to planting readiness.',
    category: 'Ops',
    icon: 'fa-house-chimney-window',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200',
    longNarrative: lang === 'id' ? `Modul ini mencatat setiap aktivitas di nursery, termasuk pemupukan, penyiraman, dan pemindahan polybag. Memastikan traceability bibit sejak awal siklus hidupnya.` : `This module records every activity in the nursery, including fertilization, watering, and polybag movement. It ensures seedling traceability from the beginning of its life cycle.`
  },
  {
    id: 'carbon-mon',
    title: lang === 'id' ? 'Monitoring Karbon' : 'Carbon Sequestration',
    highlight: lang === 'id' ? 'Estimasi penyerapan karbon berbasis biomasa dan pertumbuhan tanaman digital.' : 'Estimation of carbon sequestration based on biomass and digital plant growth.',
    category: 'ESG',
    icon: 'fa-leaf',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200',
    longNarrative: lang === 'id' ? `Melalui data pertumbuhan yang terkumpul, Montana AI memberikan estimasi kontribusi reklamasi terhadap penyerapan karbon (CO2), mendukung laporan kepatuhan lingkungan dan ESG perusahaan.` : `Through collected growth data, Montana AI provides estimates of reclamation contributions to carbon sequestration (CO2), supporting corporate environmental compliance and ESG reporting.`
  },
  {
    id: 'gis-geo',
    title: lang === 'id' ? 'Integrasi GIS' : 'GIS Integration',
    highlight: lang === 'id' ? 'Visualisasi spasial blok reklamasi dengan layer data geospasial real-time.' : 'Spatial visualization of reclamation blocks with real-time geospatial data layers.',
    category: 'Maps',
    icon: 'fa-map-location-dot',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200',
    longNarrative: lang === 'id' ? `Blok penanaman divisualisasikan dalam peta interaktif. Setiap titik memiliki ID unik dan data atribut lengkap, memudahkan inspeksi jarak jauh bagi tim audit.` : `Planting blocks are visualized in interactive maps. Every point has a unique ID and complete attribute data, facilitating remote inspection for audit teams.`
  },
  {
    id: 'digital-logbook',
    title: lang === 'id' ? 'Logbook Digital' : 'Digital Logbook',
    highlight: lang === 'id' ? 'Arsip digital aktivitas harian yang aman dan terenkripsi untuk audit.' : 'Secure and encrypted digital archive of daily activities for auditing.',
    category: 'Compliance',
    icon: 'fa-book',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200',
    longNarrative: lang === 'id' ? `Menghilangkan penggunaan kertas (paperless) dan risiko kehilangan data. Logbook digital ini menyimpan bukti operasional secara kronologis dan tidak dapat diubah tanpa otorisasi.` : `Eliminating paper usage (paperless) and the risk of data loss. This digital logbook stores operational evidence chronologically and cannot be altered without authorization.`
  },
  {
    id: 'roster-mod',
    title: lang === 'id' ? 'Roster Modular' : 'Modular Roster',
    highlight: lang === 'id' ? 'Siklus jadwal otomatis 31 hari untuk manajemen tim revegetasi.' : '31-day automatic schedule cycle for revegetation team management.',
    category: 'Team',
    icon: 'fa-users-gear',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200',
    longNarrative: lang === 'id' ? `Sistem roster modular memastikan ketersediaan personil di lapangan secara optimal. Terintegrasi dengan notifikasi WhatsApp untuk pengingat jadwal kerja harian.` : `The modular roster system ensures optimal personnel availability in the field. Integrated with WhatsApp notifications for daily work schedule reminders.`
  }
];

export const MONTANA_FAQ = (lang: 'id' | 'en'): FAQItem[] => [
  {
    id: 'faq-advantage',
    question: lang === 'id' ? 'Apa keunggulan My Montana AI dibanding metode manual?' : 'What are the advantages of My Montana AI compared to manual methods?',
    answer: lang === 'id' 
      ? 'My Montana AI memberikan 3 keunggulan kunci: (1) Visibility - Dashboard real-time vs laporan manual 2-3 minggu. (2) Accuracy - ML prediction rate 92% vs intuisi manusia 60%. (3) Scalability - Manage 10 juta pohon dengan tim 50 orang vs 500 orang manual. Survival rate meningkat dari 48% menjadi 86%.'
      : 'My Montana AI provides 3 key advantages: (1) Visibility - Real-time dashboard vs 2-3 week manual reports. (2) Accuracy - 92% ML prediction vs 60% human intuition. (3) Scalability - Manage 10 million trees with 50 people vs 500 manual. Survival rate increases from 48% to 86%.',
    keywords: ['keunggulan', 'manfaat', 'efisiensi', 'accuracy', 'comparison']
  },
  {
    id: 'faq-roi',
    question: lang === 'id' ? 'Berapa lama ROI tercapai?' : 'How long does it take to achieve ROI?',
    answer: lang === 'id'
      ? 'Rata-rata klien mencapai ROI positif dalam 8-12 bulan melalui kombinasi operational savings (43% efisiensi) + carbon credit revenue. Contoh: investasi Rp 500 juta untuk 5,000 pohon menghasilkan Rp 280 juta savings + Rp 150 juta carbon credit = ROI 86% Year 1.'
      : 'On average, clients achieve positive ROI within 8-12 months through operational savings (43% efficiency) + carbon credit revenue. Example: Rp 500M investment for 5,000 trees generates Rp 280M savings + Rp 150M carbon credit = 86% ROI Year 1.',
    keywords: ['ROI', 'investasi', 'waktu', 'pengembalian', 'revenue']
  },
  {
    id: 'faq-esg',
    question: lang === 'id' ? 'Bagaimana My Montana AI membantu target ESG perusahaan?' : 'How does My Montana AI help meet company ESG targets?',
    answer: lang === 'id'
      ? 'My Montana AI mengukur serapan CO₂ per pohon berdasarkan jenis, lokasi, dan pertumbuhan. Hasil audit trail digital terverifikasi compliant ISO 14064. Data ini dapat diintegrasikan dengan TCFD, GRI reporting dan dimonetisasi sebagai carbon credit. Potensi revenue 30-50 juta per 1,000 pohon per tahun.'
      : 'My Montana AI measures CO₂ absorption per tree by type, location, and growth. Digital audit trail verified ISO 14064 compliant. Data integrates with TCFD, GRI reporting and can be monetized as carbon credits. Potential revenue 30-50M per 1,000 trees annually.',
    keywords: ['ESG', 'karbon', 'lingkungan', 'sustainability', 'TCFD']
  },
  {
    id: 'faq-integration',
    question: lang === 'id' ? 'Apakah dapat diintegrasikan dengan sistem existing?' : 'Can it be integrated with existing systems?',
    answer: lang === 'id'
      ? 'Ya, My Montana AI dilengkapi REST API, SDK, dan middleware untuk integrasi dengan SAP, Oracle, atau sistem ERP apapun. Setup integration biasanya 4-8 minggu tergantung kompleksitas sistem existing Anda.'
      : 'Yes, My Montana AI has REST APIs, SDKs, and middleware for integration with SAP, Oracle, or any ERP system. Integration setup typically takes 4-8 weeks depending on your existing system complexity.',
    keywords: ['integrasi', 'API', 'system', 'ERP', 'compatibility']
  },
  {
    id: 'faq-security',
    question: lang === 'id' ? 'Bagaimana keamanan data di My Montana AI?' : 'How is data security handled in My Montana AI?',
    answer: lang === 'id'
      ? 'Semua data dienkripsi end-to-end dengan encryption standard industri. Log akses digital tidak dapat diubah tanpa otorisasi manager. Backup redundan di multiple data center dengan disaster recovery plan. Compliant dengan ISO 27001 Information Security Management.'
      : 'All data is encrypted end-to-end with industry-standard encryption. Digital access logs cannot be altered without manager authorization. Redundant backups across multiple data centers with disaster recovery plan. Compliant with ISO 27001 Information Security Management.',
    keywords: ['keamanan', 'encrypsi', 'data', 'privacy', 'ISO 27001']
  }
];

export const LayananPengaduan: React.FC<LayananPengaduanProps> = ({ language = 'id' }) => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  // Fixed: explicitly cast language to expected keys to satisfy TS compiler
  const t = TRANSLATIONS[language as 'id' | 'en'];
  // Fixed: explicitly cast language to expected keys to satisfy TS compiler
  const features = MONTANA_FEATURES(language as 'id' | 'en');
  const faq = MONTANA_FAQ(language as 'id' | 'en');

  const handleCloseDetail = () => {
    setSelectedFeature(null);
    window.scrollTo({ top: document.getElementById('narasi-section')?.offsetTop || 0, behavior: 'smooth' });
  };

  return (
    <div id="narasi-section" className="space-y-16 animate-fadeIn min-h-[400px] relative">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="flex flex-col">
          <h3 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.4em] mb-4 leading-none">{t.headerSub}</h3>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
            {language === 'id' ? 'Narasi Sistem' : 'System Narrative'} <span className="text-emerald-600">Montana AI</span>
          </h1>
        </div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-sm text-right">
          {t.headerDesc}
        </p>
      </div>

      {!selectedFeature ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 px-2">
          {features.map((f) => (
            <button 
              key={f.id} 
              onClick={() => setSelectedFeature(f)}
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-white/50 dark:border-slate-800 hover:border-emerald-500/40 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-2xl flex flex-col items-center text-center"
            >
              <div className="absolute top-6 right-6 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[8px] font-black text-slate-400 uppercase tracking-widest rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                {f.category}
              </div>
              <div className="w-20 h-20 shrink-0 rounded-[28px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl text-slate-400 group-hover:text-emerald-500 transition-all duration-500 mb-6">
                <i className={`fas ${f.icon}`}></i>
              </div>
              <div className="space-y-3">
                <h2 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight group-hover:text-emerald-600">
                  {f.title}
                </h2>
                <p className="text-[10px] leading-relaxed font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest line-clamp-2">
                  {f.highlight}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 w-full flex items-center justify-center gap-2 text-emerald-500 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                {t.learnMore} <i className="fas fa-arrow-right"></i>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-drift-puff">
          <div className="relative h-[300px] md:h-[400px]">
            <img 
              src={selectedFeature.image} 
              alt={`${selectedFeature.title} - Montana AI Module: ${selectedFeature.highlight}`}
              title={`Dokumentasi ${selectedFeature.title} dalam ekosistem Montana AI`}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            <button onClick={handleCloseDetail} className="absolute top-8 left-8 flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
              <i className="fas fa-arrow-left"></i> {t.backBtn}
            </button>
            <div className="absolute bottom-12 left-12 right-12">
               <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{selectedFeature.title}</h3>
            </div>
          </div>
          <div className="p-12 md:p-20 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center gap-6">
                  <div className="h-0.5 flex-1 bg-slate-100 dark:bg-slate-800"></div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] shrink-0">{t.deepNarrative}</h3>
                  <div className="h-0.5 flex-1 bg-slate-100 dark:bg-slate-800"></div>
                </div>
                <article className="prose dark:prose-invert max-w-none">
                  {selectedFeature.longNarrative.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-lg md:text-2xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed text-justify mb-10 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </article>
              <div className="pt-12 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.assetId}</p>
                  <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">SYS_MOD_{selectedFeature.id.toUpperCase()}_v4.5</p>
                </div>
                <button onClick={handleCloseDetail} className="px-12 py-5 bg-slate-900 dark:bg-emerald-600 text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                  {t.finishBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedFeature && (
        <div className="bg-slate-900 dark:bg-emerald-600/10 p-8 rounded-[44px] border border-emerald-500/20 flex items-center justify-between shadow-2xl group mx-2">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl animate-pulse">
              <i className="fas fa-headset"></i>
            </div>
            <div>
              <p className="text-[12px] font-black text-white uppercase tracking-widest">{t.supportTitle}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-emerald-400/60 uppercase tracking-widest mt-1">{t.supportDesc}</p>
            </div>
          </div>
          <i className="fas fa-arrow-right text-emerald-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 mr-4"></i>
        </div>
      )}

      {/* FAQ Section - SEO Optimized */}
      {!selectedFeature && (
        <section className="mt-24 px-4" itemScope itemType="https://schema.org/FAQPage">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
                {t.faqTitle}
              </h2>
              <p className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {t.faqDesc}
              </p>
            </div>

            <div className="space-y-4">
              {faq.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/40"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                    className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors text-left"
                  >
                    <h3 
                      className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex-1 pr-4"
                      itemProp="name"
                    >
                      {item.question}
                    </h3>
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 transition-transform duration-300 ${expandedFaq === item.id ? 'rotate-180' : ''}`}>
                      <i className="fas fa-chevron-down text-sm"></i>
                    </div>
                  </button>

                  {expandedFaq === item.id && (
                    <div className="px-6 md:px-8 pb-6 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                      <div 
                        className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium"
                        itemScope
                        itemProp="acceptedAnswer"
                        itemType="https://schema.org/Answer"
                      >
                        <p itemProp="text" className="mb-3">
                          {item.answer}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          {item.keywords.map((kw, idx) => (
                            <span 
                              key={idx}
                              className="text-[10px] md:text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full uppercase tracking-tight"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-emerald-50 dark:from-emerald-950/30 to-transparent rounded-[32px] border border-emerald-200/50 dark:border-emerald-800/30 text-center">
              <p className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4">
                {language === 'id' ? 'Pertanyaan lain? Hubungi tim kami' : 'Other questions? Contact our team'}
              </p>
              <a 
                href="mailto:support@montana-tech.info"
                className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-lg transition-all"
              >
                {language === 'id' ? 'Tanya Sekarang' : 'Ask Now'}
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
