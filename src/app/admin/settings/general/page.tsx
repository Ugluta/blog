"use client";

import { useState } from "react";

export default function GeneralSettings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteName: "KURUMSAL",
    tagline: "Türkiye'nin Öncü Haber & Analiz Platformu",
    siteUrl: "https://kurumsal.com.tr",
    adminEmail: "admin@kurumsal.com.tr",
    language: "tr",
    timezone: "Europe/Istanbul",
    postsPerPage: "12",
    maintenanceMode: false,
    darkMode: true,
    cookieConsent: true,
    preloader: false,
    backToTop: true,
  });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Genel Ayarlar</h1>
          <p className="text-sm text-slate-400 mt-0.5">Site kimliği ve temel yapılandırma</p>
        </div>
        <button
          onClick={save}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            saved ? "bg-green-500 text-white" : "bg-amber-500 hover:bg-amber-400 text-slate-900"
          }`}
        >
          {saved ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {/* Site Identity */}
      <section className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Site Kimliği</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Site Adı</label>
            <input
              value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Sloğan / Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Site URL</label>
            <input
              value={form.siteUrl}
              onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Admin E-posta</label>
            <input
              type="email"
              value={form.adminEmail}
              onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Localization */}
      <section className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Yerelleştirme</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Dil</label>
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Saat Dilimi</label>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
              <option value="UTC">UTC</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Sayfa Başına Yazı</label>
            <input
              type="number"
              value={form.postsPerPage}
              onChange={(e) => setForm({ ...form, postsPerPage: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Toggles */}
      <section className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Özellikler</h2>
        {[
          { key: "darkMode", label: "Karanlık Mod Varsayılan", desc: "Site karanlık modda açılır" },
          { key: "maintenanceMode", label: "Bakım Modu", desc: "Ziyaretçilere bakım mesajı göster" },
          { key: "cookieConsent", label: "Çerez Onayı", desc: "GDPR/KVKK çerez bildirimi" },
          { key: "preloader", label: "Sayfa Yükleyici", desc: "Sayfa açılırken animasyon göster" },
          { key: "backToTop", label: "Yukarı Çık Butonu", desc: "Sayfanın sağ altında" },
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0 cursor-pointer">
            <div>
              <span className="text-sm text-slate-200">{item.label}</span>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <div
              onClick={() => setForm({ ...form, [item.key]: !form[item.key as keyof typeof form] })}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 relative ${
                form[item.key as keyof typeof form] ? "bg-amber-500" : "bg-slate-600"
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                form[item.key as keyof typeof form] ? "translate-x-6" : "translate-x-1"
              }`} />
            </div>
          </label>
        ))}
      </section>
    </div>
  );
}
