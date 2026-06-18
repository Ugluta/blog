"use client";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    q: "İçerik yönetim sistemini nasıl kullanabilirim?",
    a: "Sisteme kayıt olduktan sonra /uygulama paneline erişerek içeriklerinizi yönetebilirsiniz. Yazı oluşturma, kategori atama ve yayınlama işlemlerini kolayca gerçekleştirebilirsiniz.",
  },
  {
    id: 2,
    q: "Sosyal medya otomasyonu nasıl çalışır?",
    a: "Sosyal hesaplarınızı panele bağladıktan sonra içeriklerinizi tek tıkla tüm platformlarda paylaşabilirsiniz. Zamanlanmış yayın ve analitik takibi de desteklenmektedir.",
  },
  {
    id: 3,
    q: "Çoklu kullanıcı desteği var mı?",
    a: "Evet. Ekip yönetimi özelliğiyle editör, yazar ve yönetici rolleri atayabilirsiniz. Her rolün yetki seviyesi özelleştirilebilir.",
  },
  {
    id: 4,
    q: "Verilerimin güvenliği nasıl sağlanıyor?",
    a: "Tüm veriler şifrelenmiş bağlantılar üzerinden iletilir, günlük yedekleme yapılır ve KVKK uyumlu altyapı kullanılmaktadır.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-16" style={{ backgroundColor: "#0F172A" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">SORU & CEVAP</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sık Sorulan Sorular
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platformumuza dair en sık sorulan soruları ve yanıtlarını burada bulabilirsiniz.
            </p>
          </div>
          <div className="lg:col-span-2 space-y-2">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-slate-700/50 overflow-hidden">
                <button
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-700/30 transition-colors"
                >
                  <span className="text-2xl font-black text-slate-700 flex-shrink-0 w-8">
                    {String(faq.id).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-slate-200">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-amber-400 flex-shrink-0 transition-transform ${open === faq.id ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${open === faq.id ? "max-h-48" : "max-h-0"}`}>
                  <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed" style={{ paddingLeft: "4.5rem" }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
