
import React, { useState, useRef, useEffect, useMemo } from 'react';

interface Message {
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

interface FAQCategory {
  id: string;
  label: string;
  icon: string;
  questions: { label: string; query: string }[];
}

interface HelpCenterProps {
  language?: 'id' | 'en';
}

const FAQ_DATABASE_ID: FAQCategory[] = [
  {
    id: 'thr',
    label: 'Tahura & Roster',
    icon: 'fa-tree-city',
    questions: [
      { label: 'Apa itu status THR?', query: 'Berikan penjelasan mengenai status THR di jadwal roster karyawan.' },
      { label: 'Lokasi Tahura Sultan Adam?', query: 'Di mana letak operasional Tahura Sultan Adam Banjarbaru?' },
      { label: 'Sistem Roster Modular?', query: 'Bagaimana cara kerja siklus roster otomatis di aplikasi ini?' }
    ]
  },
  {
    id: 'tech',
    label: 'Kamera & EXIF',
    icon: 'fa-camera-rotate',
    questions: [
      { label: 'Validasi Camera EXIF?', query: 'Bagaimana sistem Montana Camera V2 mengunci data GPS dan Timestamp untuk mencegah fraud?' },
      { label: 'API Key Cuaca?', query: 'Menggunakan API apa untuk data cuaca real-time di navigasi atas?' }
    ]
  }
];

const FAQ_DATABASE_EN: FAQCategory[] = [
  {
    id: 'thr',
    label: 'Tahura & Roster',
    icon: 'fa-tree-city',
    questions: [
      { label: 'What is THR status?', query: 'Explain the THR status in the employee roster schedule.' },
      { label: 'Tahura Location?', query: 'Where is Sultan Adam Banjarbaru Tahura operational site located?' },
      { label: 'Modular Roster?', query: 'How does the automatic modular roster cycle work in this app?' }
    ]
  },
  {
    id: 'tech',
    label: 'Camera & EXIF',
    icon: 'fa-camera-rotate',
    questions: [
      { label: 'EXIF Validation?', query: 'How does Montana Camera V2 lock GPS and Timestamp data to prevent documentation fraud?' },
      { label: 'Weather API?', query: 'What API is used for real-time weather data in the top navbar?' }
    ]
  }
];

// Montana Assistant enriched FAQ (20 items) - Indonesian
const MONTANA_FAQ_ID: FAQCategory[] = [
  {
    id: 'feat',
    label: 'Fitur & Penggunaan',
    icon: 'fa-lightbulb',
    questions: [
      { label: 'Apa itu Montana Assistant?', query: 'Jelaskan apa itu Montana Assistant dan fungsinya di aplikasi.' },
      { label: 'Bagaimana cara mengganti bahasa?', query: 'Bagaimana cara mengganti bahasa aplikasi dan chat assistant menjadi ID atau EN?' },
      { label: 'Apa saja fitur utama aplikasi?', query: 'Sebutkan fitur utama Montana AI untuk manajemen nursery dan monitoring.' },
      { label: 'Bagaimana cara menggunakan mode Lite?', query: 'Apa kegunaan Mode Lite dan kapan sebaiknya digunakan?' },
      { label: 'Bagaimana memanggil bantuan pada halaman?', query: 'Cara cepat memanggil Montana Assistant saat berada di halaman tertentu.' }
    ]
  },
  {
    id: 'monitor',
    label: 'Monitoring & HCV',
    icon: 'fa-heart-pulse',
    questions: [
      { label: 'Apa itu monitoring kesehatan dini?', query: 'Apa yang dimaksud monitoring kesehatan dini dalam konteks nursery?' },
      { label: 'Bagaimana HCV dipantau?', query: 'Bagaimana aplikasi membantu pemantauan High Conservation Value (HCV)?' },
      { label: 'Apa indikator kesehatan tanaman?', query: 'Sebutkan indikator utama untuk memonitor kesehatan tanaman.' },
      { label: 'Bagaimana data dikumpulkan?', query: 'Dari mana saja sumber data (kamera, input manual, sensor) yang digunakan?' },
      { label: 'Bagaimana notifikasi dini bekerja?', query: 'Jelaskan mekanisme notifikasi dini untuk potensi penyakit atau stress.' }
    ]
  },
  {
    id: 'ai',
    label: 'AI & Integrasi',
    icon: 'fa-robot',
    questions: [
      { label: 'Mengapa AI penting?', query: 'Mengapa penggunaan AI penting untuk aplikasi monitoring dan reklamasi?' },
      { label: 'Apa peran DeepSeek?', query: 'Bagaimana API key DeepSeek digunakan oleh chatbot di menu?' },
      { label: 'Apakah data percakapan disimpan?', query: 'Apakah percakapan pengguna disimpan untuk perbaikan model atau logging?' },
      { label: 'Bagaimana mengamankan API key?', query: 'Apa praktik terbaik untuk menyimpan dan menggunakan API key layanan AI?' },
      { label: 'Apakah AI bisa memberikan diagnosis?', query: 'Apakah Montana Assistant memberikan diagnosis medis atau hanya rekomendasi agronomi?' }
    ]
  },
  {
    id: 'biz',
    label: 'Pengembangan & Bisnis',
    icon: 'fa-briefcase',
    questions: [
      { label: 'Siapa pengembangnya?', query: 'Siapa pengembang aplikasi ini dan apa jabatannya?' },
      { label: 'Berapa biaya pembuatannya?', query: 'Berapa estimasi biaya pengembangan aplikasi ini dan dari mana dananya?' },
      { label: 'Bagaimana model keuntungan?', query: 'Jelaskan logika sederhana tentang investasi 5 juta dan keuntungan 500 juta per tahun.' },
      { label: 'Apa itu reklamasi?', query: 'Apa yang dimaksud reklamasi dan hubungannya dengan aplikasi ini?' },
      { label: 'Roadmap monetisasi apa yang disarankan?', query: 'Apa langkah selanjutnya untuk meningkatkan nilai bisnis aplikasi?' }
    ]
  }
];

// Montana Assistant enriched FAQ (20 items) - English
const MONTANA_FAQ_EN: FAQCategory[] = [
  {
    id: 'feat',
    label: 'Features & Usage',
    icon: 'fa-lightbulb',
    questions: [
      { label: 'What is Montana Assistant?', query: 'Explain what Montana Assistant is and its role in the app.' },
      { label: 'How to switch language?', query: 'How do I change the app and assistant language to ID or EN?' },
      { label: 'What are main features?', query: 'List the main features of Montana AI for nursery management and monitoring.' },
      { label: 'How to use Lite mode?', query: 'What is Lite Mode and when should it be used?' },
      { label: 'How to request help on a page?', query: 'Quick way to call Montana Assistant when on a specific page.' }
    ]
  },
  {
    id: 'monitor',
    label: 'Monitoring & HCV',
    icon: 'fa-heart-pulse',
    questions: [
      { label: 'What is early health monitoring?', query: 'What is early health monitoring in the nursery context?' },
      { label: 'How is HCV monitored?', query: 'How does the app help monitor High Conservation Value (HCV)?' },
      { label: 'What are plant health indicators?', query: 'Name key indicators to monitor plant health.' },
      { label: 'Where is data from?', query: 'What data sources (camera, manual input, sensors) are used?' },
      { label: 'How do early alerts work?', query: 'Explain the early alert mechanism for disease or stress.' }
    ]
  },
  {
    id: 'ai',
    label: 'AI & Integration',
    icon: 'fa-robot',
    questions: [
      { label: 'Why AI matters?', query: 'Why is AI important for monitoring and reclamation apps?' },
      { label: 'What is DeepSeek role?', query: 'How is the DeepSeek API key used by the chatbot in the menu?' },
      { label: 'Are chats stored?', query: 'Are user conversations stored for model improvement or logging?' },
      { label: 'How to secure API keys?', query: 'Best practices to store and use external AI service keys?' },
      { label: 'Can AI diagnose?', query: 'Does Montana Assistant provide medical diagnosis or agronomic recommendations only?' }
    ]
  },
  {
    id: 'biz',
    label: 'Development & Business',
    icon: 'fa-briefcase',
    questions: [
      { label: 'Who developed this?', query: 'Who developed this application and what is their role?' },
      { label: 'How much did it cost?', query: 'Estimated development cost and source of funding?' },
      { label: 'Profit logic?', query: 'Explain simple logic for 5 million investment and 500 million annual profit.' },
      { label: 'What is reclamation?', query: 'What is reclamation and why is this app important for it?' },
      { label: 'Monetization roadmap?', query: 'Suggested next steps to increase business value of the app.' }
    ]
  }
];

export const HelpCenter: React.FC<HelpCenterProps> = ({ language = 'id' }) => {
  // Merge base FAQ with Montana-specific enriched FAQ per language
  const currentFAQ = language === 'id'
    ? FAQ_DATABASE_ID.concat(MONTANA_FAQ_ID)
    : FAQ_DATABASE_EN.concat(MONTANA_FAQ_EN);
  const initialMsg = language === 'id' 
    ? 'Halo! Saya Montana Assistant. Saya siap membantu Anda dalam Bahasa Indonesia dan English. Ada yang bisa saya bantu?'
    : 'Hello! I am Montana Assistant. I am ready to help you in Indonesian and English. How can I assist you?';

  const [messages, setMessages] = useState<Message[]>([{ role: 'model', text: initialMsg }]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(currentFAQ[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isProcessing]);

  const typeWriter = (fullText: string) => {
    setMessages(prev => [...prev, { role: 'model', text: fullText }]);
  };


    // Local responder (no external AI) - simple keyword/FAQ matcher
    const ANSWERS_ID: Record<string, string> = {
      'Jelaskan apa itu Montana Assistant dan fungsinya di aplikasi.': 'Montana Assistant adalah chatbot bilingual yang membantu navigasi, menjawab pertanyaan fitur, dan memberi panduan operasional langsung di dashboard.',
      'Bagaimana cara mengganti bahasa aplikasi dan chat assistant menjadi ID atau EN?': 'Gunakan switch bahasa di header (ID / EN). Montana Assistant akan otomatis merespons sesuai bahasa yang dipilih.',
      'Sebutkan fitur utama Montana AI untuk manajemen nursery dan monitoring.': 'Fitur utama meliputi monitoring cuaca, ringkasan seedling, visualisasi kamera, roster, notifikasi, dan chatbot bantu.',
      'Bagaimana cara menggunakan mode Lite?': 'Mode Lite menonaktifkan beberapa widget visual untuk mempercepat loading di jaringan lambat; gunakan saat sinyal/CPU terbatas.',
      'Bagaimana memanggil bantuan pada halaman?': 'Buka Help Center atau tekan ikon bantuan; pilih kategori FAQ atau ketik pertanyaan di kolom chat.',
      'Apa yang dimaksud monitoring kesehatan dini dalam konteks nursery?': 'Monitoring kesehatan dini melacak indikator awal stress atau penyakit pada tanaman agar tindakan pencegahan bisa segera diambil.',
      'Bagaimana HCV dipantau?': 'Aplikasi merekam lokasi, kondisi lingkungan, dan bukti visual untuk mendeteksi perubahan di area bernilai konservasi tinggi.',
      'Sebutkan indikator utama untuk memonitor kesehatan tanaman.': 'Indikator meliputi warna daun, kelembaban tanah, pertumbuhan, serangan hama, dan perubahan visual dari kamera.',
      'Dari mana saja sumber data (kamera, input manual, sensor) yang digunakan?': 'Data dikumpulkan dari input manual, foto/kamera, dan sensor jika tersedia; beberapa data juga diambil dari API eksternal seperti cuaca.',
      'Jelaskan mekanisme notifikasi dini untuk potensi penyakit atau stress.': 'Sistem membandingkan metrik terhadap ambang yang ditentukan dan mengirim peringatan jika terlampaui.',
      'Mengapa penggunaan AI penting untuk aplikasi monitoring dan reklamasi?': 'AI membantu analisis cepat, deteksi pola, dan rekomendasi otomatis yang sulit ditangkap manual pada skala besar.',
      'Bagaimana API key DeepSeek digunakan oleh chatbot di menu?': 'DeepSeek dipakai untuk pencarian semantik dan memperkaya jawaban chatbot dengan konteks dokumen; kunci disimpan di server, bukan di klien.',
      'Apakah percakapan pengguna disimpan untuk perbaikan model atau logging?': 'Secara default percakapan tidak disimpan di klien; penyimpanan tergantung konfigurasi backend dan kebijakan privasi.',
      'Apa praktik terbaik untuk menyimpan dan menggunakan API key layanan AI?': 'Simpan API key di server/backend dan panggil layanan eksternal dari backend, jangan menaruh kunci di kode klien.',
      'Apakah Montana Assistant memberikan diagnosis medis atau hanya rekomendasi agronomi?': 'Montana Assistant memberikan rekomendasi agronomi dan monitoring, bukan diagnosis medis untuk manusia.',
      'Siapa pengembang aplikasi ini dan apa jabatannya?': 'Pengembang: Agung Laksono, menjabat sebagai Section Revegetasi.',
      'Berapa estimasi biaya pengembangan aplikasi ini dan dari mana dananya?': 'Estimasi biaya pengembangan sekitar IDR 5.000.000, dibiayai dari dana pribadi.',
      'Jelaskan logika sederhana tentang investasi 5 juta dan keuntungan 500 juta per tahun.': 'Contoh logika: biaya awal 5 juta, jika pendapatan tahunan 500 juta, maka keuntungan = 500 - 5 = 495 juta; ROI = 495 / 5 = 99 -> 9900% per tahun (asumsi skenario agresif dan biaya operasional lain diabaikan).',
      'Apa yang dimaksud reklamasi dan hubungannya dengan aplikasi ini?': 'Reklamasi adalah pemulihan lahan yang rusak; aplikasi membantu pemantauan progres revegetasi, dokumentasi, dan koordinasi lapangan.',
      'Apa langkah selanjutnya untuk meningkatkan nilai bisnis aplikasi?': 'Saran: tambah fitur berbayar (analitik), integrasi sensor, layanan konsultasi, dan skema langganan untuk monetisasi.'
    };

    const ANSWERS_EN: Record<string, string> = {
      'Explain what Montana Assistant is and its role in the app.': 'Montana Assistant is a bilingual chatbot that helps navigation, answers feature questions, and provides operational guidance within the dashboard.',
      'How do I change the app and assistant language to ID or EN?': 'Use the language switch in the header (ID / EN). The assistant will reply in the selected language.',
      'List the main features of Montana AI for nursery management and monitoring.': 'Main features include weather monitoring, seedling summary, camera visualization, roster, notifications, and an interactive chatbot.',
      'What is Lite Mode and when should it be used?': 'Lite Mode disables some visual widgets to speed up loading on weak networks or low-power devices; use it in field conditions.',
      'Quick way to call Montana Assistant when on a specific page.': 'Open the Help Center or press the help icon; choose an FAQ category or type a question in the chat.',
      'What is early health monitoring in the nursery context?': 'Early health monitoring tracks early indicators of stress or disease so preventive action can be taken sooner.',
      'How does the app help monitor High Conservation Value (HCV)?': 'The app records location, environmental conditions, and visual evidence to detect changes in HCV areas.',
      'Name key indicators to monitor plant health.': 'Indicators include leaf color, soil moisture, growth rate, pest presence, and visual changes from camera feeds.',
      'What data sources (camera, manual input, sensors) are used?': 'Data comes from manual entries, camera images, and sensors if available; weather data from external API like Open-Meteo.',
      'Explain the early alert mechanism for disease or stress.': 'The system compares metrics against thresholds and sends alerts when values exceed those thresholds.',
      'Why is AI important for monitoring and reclamation apps?': 'AI speeds up analysis, detects patterns, and provides automated recommendations that are hard to do manually at scale.',
      'How is the DeepSeek API key used by the chatbot in the menu?': 'DeepSeek is used for semantic search and enriching chatbot responses with document context; keys should be stored server-side.',
      'Are user conversations stored for model improvement or logging?': 'By default chats are not stored on the client; storage depends on backend configuration and privacy policy.',
      'Best practices to store and use external AI service keys?': 'Store keys on the server, call external services from backend endpoints, and restrict access with authentication.',
      'Does Montana Assistant provide medical diagnosis or agronomic recommendations only?': 'The assistant provides agronomic recommendations and monitoring guidance, not medical diagnosis for humans.',
      'Who developed this application and what is their role?': 'Developer: Agung Laksono, Section Revegetasi.',
      'Estimated development cost and source of funding?': 'Estimated development cost is around IDR 5,000,000 and funded personally.',
      'Explain simple logic for 5 million investment and 500 million annual profit.': 'Example logic: initial cost 5 million; if annual revenue is 500 million, profit = 500 - 5 = 495 million; ROI = 495 / 5 = 99 -> 9900% per year (aggressive assumption).',
      'What is reclamation and why is this app important for it?': 'Reclamation is the restoration of damaged land; this app helps monitoring, documentation, and coordination for revegetation projects.',
      'Suggested next steps to increase business value of the app.': 'Suggestions: add premium analytics, sensor integrations, consulting services, and subscription plans for monetization.'
    };

    const findLocalAnswer = (queryText: string, lang: 'id'|'en') => {
      const q = queryText.trim();
      if (lang === 'id' && ANSWERS_ID[q]) return ANSWERS_ID[q];
      if (lang === 'en' && ANSWERS_EN[q]) return ANSWERS_EN[q];
      // try partial match on question labels
      const flatQs = currentFAQ.flatMap(c => c.questions.map(q => q.query));
      const found = flatQs.find(k => k.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(k.toLowerCase()));
      if (found) return lang === 'id' ? (ANSWERS_ID[found] || 'Maaf, informasi belum tersedia.') : (ANSWERS_EN[found] || 'Sorry, information not available.');
      return lang === 'id'
        ? 'Maaf, saya sedang offline dan belum menemukan jawaban spesifik. Coba pilih pertanyaan dari daftar FAQ.'
        : 'Sorry, I am offline and could not find a specific answer. Try selecting a question from the FAQ list.';
    };

    const handleSendMessage = async (textToSend: string) => {
      if (!textToSend.trim() || isProcessing) return;
      setMessages(prev => [...prev, { role: 'user', text: textToSend.trim() }]);
      setInput('');
      setIsProcessing(true);
      try {
        const answer = findLocalAnswer(textToSend.trim(), language as 'id' | 'en');
        typeWriter(answer);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'model', text: language === 'id' ? 'Terjadi kesalahan internal.' : 'Internal error occurred.' }]);
      } finally {
        setIsProcessing(false);
      }
    };





















  const activeCategory = useMemo(() => 
    currentFAQ.find(c => c.id === activeCategoryId) || currentFAQ[0]
  , [activeCategoryId, currentFAQ]);

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px] md:h-[800px] lg:h-[900px] transition-all duration-700">
      
      <div className="p-7 md:p-8 lg:p-10 border-b border-slate-100 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-lg md:text-xl shadow-xl relative">
              <i className="fas fa-robot animate-pulse"></i>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div>
              <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Montana Assistant</h4>
              <p className="text-[8px] md:text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1.5 opacity-70">Bilingual Engine v4.5</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([{ role: 'model', text: initialMsg }])}
            className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-90 text-xs md:text-sm"
          >
            <i className="fas fa-rotate"></i>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 space-y-6 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[85%] px-5 md:px-6 py-3 md:py-4 rounded-[24px] text-[11px] md:text-[12px] font-medium leading-relaxed shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-slate-900 dark:bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
            }`}>
              {msg.text}
              {msg.isTyping && <span className="ml-1 w-1.5 h-4 bg-emerald-500 inline-block animate-pulse align-middle"></span>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 md:p-8 lg:p-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/50 shrink-0 max-h-[40%] overflow-y-auto">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4 md:mb-5 border-b border-black/5 dark:border-white/5">
          {currentFAQ.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`whitespace-nowrap px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all flex-shrink-0 ${
                activeCategoryId === cat.id 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className={`fas ${cat.icon}`}></i>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {activeCategory.questions.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(faq.query)}
              disabled={isProcessing}
              className="px-3 md:px-4 lg:px-5 py-2 md:py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-500 rounded-lg md:rounded-xl text-[8px] md:text-[9px] lg:text-xs font-black uppercase tracking-widest border border-black/5 dark:border-white/5 hover:bg-emerald-600 hover:text-white transition-all active:scale-95 flex-shrink-0"
            >
              {faq.label}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex gap-3 md:gap-4">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={language === 'id' ? "Tanyakan sesuatu..." : "Ask me anything..."}
            className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl px-5 md:px-6 py-3 md:py-4 text-[11px] md:text-[12px] font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" 
          />
          <button type="submit" disabled={!input.trim() || isProcessing} className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <i className={`fas ${isProcessing ? 'fa-circle-notch fa-spin' : 'fa-paper-plane'} text-xs md:text-sm`}></i>
          </button>
        </form>
      </div>
    </div>
  );
};
