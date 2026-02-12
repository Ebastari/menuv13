
import React, { useState } from 'react';

interface SubscribeWidgetProps {
  language?: 'id' | 'en';
}

export const SubscribeWidget: React.FC<SubscribeWidgetProps> = ({ language = 'id' }) => {
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    hp: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.jabatan || !formData.hp) {
      alert(language === 'id' ? "Silakan lengkapi seluruh data pendaftaran." : "Please complete all registration data.");
      return;
    }

    setIsSending(true);

    const message = `Halo Admin Montana AI,%0ASaya ingin mendaftar untuk mendapatkan update otomatis via WhatsApp.%0A%0A*Data Pendaftar:*%0A- Nama: ${formData.nama}%0A- Jabatan: ${formData.jabatan}%0A- No. HP: ${formData.hp}%0A%0AMohon diproses, terima kasih.`;
    
    const waUrl = `https://wa.me/6281122220044?text=${message}`;
    
    setTimeout(() => {
      window.open(waUrl, '_blank');
      setIsSending(false);
      setFormData({ nama: '', jabatan: '', hp: '' });
    }, 800);
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-[44px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
        
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors duration-1000"></div>
        <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full blur-[80px] bg-blue-500/5"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[28px] bg-emerald-600 text-white flex items-center justify-center text-4xl shadow-2xl shadow-emerald-500/30 group-hover:rotate-6 transition-all duration-500">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.4em] leading-none">Broadcast Service</h4>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{language === 'id' ? 'Update WhatsApp' : 'WhatsApp Updates'}</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'id' ? 'Daftarkan diri Anda untuk menerima notifikasi real-time mengenai stok bibit, laporan nursery, dan pengumuman penting Montana AI langsung di WhatsApp Anda.' : 'Register to receive real-time notifications about seedling stock, nursery reports, and important Montana AI announcements directly to your WhatsApp.'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                    <i className="fas fa-check-circle text-emerald-500 mr-2"></i> {language === 'id' ? 'Gratis' : 'Free'}
                  </span>
                  <span className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                    <i className="fas fa-shield-check text-emerald-500 mr-2"></i> {language === 'id' ? 'Terenkripsi' : 'Encrypted'}
                  </span>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{language === 'id' ? 'Isi form data diri dengan benar.' : 'Fill in your data correctly.'}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{language === 'id' ? 'Konfirmasi pendaftaran via WhatsApp.' : 'Confirm registration via WhatsApp.'}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/40 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{language === 'id' ? 'Nama Lengkap' : 'Full Name'}</label>
                  <input 
                    type="text" 
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder={language === 'id' ? "Contoh: Agung Laksono" : "e.g. Agung Laksono"}
                    required
                    className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{language === 'id' ? 'Jabatan / Peran' : 'Job Title / Role'}</label>
                  <input 
                    type="text" 
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleInputChange}
                    placeholder={language === 'id' ? "Contoh: Revegetation Staff" : "e.g. Revegetation Staff"}
                    required
                    className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">WhatsApp</label>
                  <input 
                    type="tel" 
                    name="hp"
                    value={formData.hp}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081122220044"
                    required
                    className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSending}
                  className="w-full py-5 bg-slate-900 dark:bg-emerald-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-6 flex items-center justify-center gap-3"
                >
                  {isSending ? (
                    <>
                      <i className="fas fa-circle-notch animate-spin"></i>
                      {language === 'id' ? 'MENGHUBUNGKAN...' : 'CONNECTING...'}
                    </>
                  ) : (
                    <>
                      <i className="fab fa-whatsapp text-lg"></i>
                      {language === 'id' ? 'DAFTAR SEKARANG' : 'REGISTER NOW'}
                    </>
                  )}
                </button>
              </form>
              
              <p className="text-[8px] font-bold text-slate-400 uppercase text-center mt-6 tracking-widest leading-relaxed">
                {language === 'id' ? 'Pendaftaran akan diteruskan ke Admin Montana AI melalui WhatsApp Messenger Resmi.' : 'Registration will be forwarded to Montana AI Admin via Official WhatsApp Messenger.'}
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-center gap-4">
               <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                 <p className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Priority Status</p>
               </div>
               <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Admin ID: 081122220044</p>
            </div>
            
            <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">
              POWERED BY <span className="text-emerald-500">MONTANA</span> CONNECT ENGINE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
