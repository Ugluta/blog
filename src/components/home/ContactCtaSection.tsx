"use client";
import { useState } from "react";

export default function ContactCtaSection() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <section className="py-16" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">İLETİŞİM</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Projenizi Hayata Geçirelim
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              Teklif almak, iş birliği yapmak veya proje hakkında bilgi almak için formu doldurun. En kısa sürede size geri döneceğiz.
            </p>
            <div className="space-y-4">
              {[
                { label: "E-posta", value: "info@kurumsal.com.tr", icon: "✉️" },
                { label: "Telefon", value: "+90 212 000 00 00", icon: "📞" },
                { label: "Adres", value: "Maslak, İstanbul", icon: "📍" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-base flex-shrink-0">{c.icon}</span>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{c.label}</p>
                    <p className="text-sm text-slate-200">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0a0f1e] border border-slate-700/50 p-6">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white mb-1">Mesajınız İletildi!</h3>
                <p className="text-sm text-slate-400">En kısa sürede size geri döneceğiz.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">Ad Soyad</label>
                    <input type="text" required placeholder="Adınız" className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors rounded-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">E-posta</label>
                    <input type="email" required placeholder="email@example.com" className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors rounded-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Konu</label>
                  <input type="text" placeholder="Proje konusu" className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors rounded-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Mesaj</label>
                  <textarea rows={4} required placeholder="Mesajınızı yazın..." className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors rounded-sm resize-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-colors rounded-sm">
                  Gönder →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
