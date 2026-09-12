"use client";

import { useState } from "react";
import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
};

const SUBJECTS = [
  "Genel Bilgi",
  "Kurumsal Satış",
  "Teknik Destek",
  "İş Birliği Teklifi",
  "Basın & Medya",
  "Kariyer",
];

const CONTACT_INFO = [
  { icon: "📍", title: "Adres", lines: ["Levent Mahallesi, Büyükdere Cad.", "No: 201, 34394 Şişli / İstanbul"] },
  { icon: "📞", title: "Telefon", lines: ["+90 (212) 555 01 00", "+90 (212) 555 01 01 (Faks)"] },
  { icon: "✉️", title: "E-posta", lines: ["info@kurumsal.com.tr", "destek@kurumsal.com.tr"] },
  { icon: "🕐", title: "Çalışma Saatleri", lines: ["Pazartesi–Cuma: 09:00–18:00", "Teknik Destek: 7/24"] },
];

export default function IletisimPage() {
  const [form, setForm] = useState<FormState>({
    name: "", email: "", company: "", phone: "", subject: "Genel Bilgi", message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormState, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Ad, e-posta ve mesaj alanları zorunludur.");
      return;
    }
    setSending(true);
    setError("");
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <MegaHeader />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-slate-300">İletişim</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bizimle İletişime Geçin
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm">
            Sorularınız, proje teklifleriniz veya işbirliği önerileriniz için bize ulaşın. Ekibimiz en kısa sürede yanıt verecektir.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Contact info */}
          <div className="space-y-5">
            {CONTACT_INFO.map((c) => (
              <div key={c.title} className="flex gap-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <span className="text-2xl flex-shrink-0">{c.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">{c.title}</p>
                  {c.lines.map((l) => (
                    <p key={l} className="text-xs text-slate-300">{l}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Sosyal Medya</p>
              <div className="flex gap-3">
                {["𝕏", "in", "▶", "f"].map((s) => (
                  <div key={s} className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-sm text-slate-300 cursor-pointer transition-colors">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-white mb-2">Mesajınız İletildi!</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Ekibimiz en kısa sürede &mdash; genellikle 1 iş günü içinde &mdash; size geri dönecektir.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", phone: "", subject: "Genel Bilgi", message: "" }); }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Ad Soyad *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Adınız Soyadınız"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">E-posta *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="ornek@sirket.com"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Şirket</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                      placeholder="Şirket Adı"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Telefon</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+90 5XX XXX XX XX"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Konu</label>
                  <select
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  >
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Mesajınız *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={5}
                    placeholder="Mesajınızı buraya yazın…"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-slate-500 resize-none"
                  />
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-600">* Zorunlu alanlar</p>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    {sending ? "Gönderiliyor…" : "Mesaj Gönder"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-10 rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/50 h-52 flex items-center justify-center text-slate-500 text-sm">
          <div className="text-center">
            <div className="text-3xl mb-2">🗺️</div>
            <p>Harita burada görünecek</p>
            <p className="text-xs mt-1">Levent, İstanbul</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
