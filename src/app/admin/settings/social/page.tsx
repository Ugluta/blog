"use client";

import { useState } from "react";

interface SocialProfile {
  platform: string;
  icon: string;
  color: string;
  label: string;
  handle: string;
  url: string;
  enabled: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  autoShare: boolean;
}

const defaultProfiles: SocialProfile[] = [
  { platform: "twitter", icon: "𝕏", color: "#000000", label: "Twitter / X", handle: "@kurumsal", url: "https://twitter.com/kurumsal", enabled: true, showInHeader: true, showInFooter: true, autoShare: true },
  { platform: "instagram", icon: "📷", color: "#E1306C", label: "Instagram", handle: "@kurumsal", url: "https://instagram.com/kurumsal", enabled: true, showInHeader: false, showInFooter: true, autoShare: true },
  { platform: "youtube", icon: "▶️", color: "#FF0000", label: "YouTube", handle: "@kurumsal", url: "https://youtube.com/@kurumsal", enabled: true, showInHeader: true, showInFooter: true, autoShare: false },
  { platform: "linkedin", icon: "in", color: "#0A66C2", label: "LinkedIn", handle: "kurumsal", url: "https://linkedin.com/company/kurumsal", enabled: true, showInHeader: true, showInFooter: true, autoShare: false },
  { platform: "facebook", icon: "f", color: "#1877F2", label: "Facebook", handle: "kurumsal", url: "https://facebook.com/kurumsal", enabled: false, showInHeader: false, showInFooter: true, autoShare: false },
  { platform: "pinterest", icon: "P", color: "#BD081C", label: "Pinterest", handle: "@kurumsal", url: "https://pinterest.com/kurumsal", enabled: false, showInHeader: false, showInFooter: false, autoShare: false },
  { platform: "tiktok", icon: "♪", color: "#010101", label: "TikTok", handle: "@kurumsal", url: "https://tiktok.com/@kurumsal", enabled: false, showInHeader: false, showInFooter: false, autoShare: false },
  { platform: "medium", icon: "M", color: "#000000", label: "Medium", handle: "@kurumsal", url: "https://medium.com/@kurumsal", enabled: false, showInHeader: false, showInFooter: false, autoShare: false },
  { platform: "reddit", icon: "R", color: "#FF4500", label: "Reddit", handle: "r/kurumsal", url: "https://reddit.com/r/kurumsal", enabled: false, showInHeader: false, showInFooter: false, autoShare: false },
];

export default function SocialSettingsPage() {
  const [profiles, setProfiles] = useState<SocialProfile[]>(defaultProfiles);
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState({
    addShareButtons: true,
    shareButtonStyle: "icon_text",
    shareOnPublish: true,
    defaultCaption: "Yeni içerik: {title} – {url} #kurumsal",
    defaultHashtags: "#haber #teknoloji #ekonomi",
  });

  const toggle = (platform: string, key: keyof SocialProfile) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.platform === platform ? { ...p, [key]: !p[key as keyof typeof p] } : p
      )
    );
  };

  const updateUrl = (platform: string, field: "handle" | "url", value: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.platform === platform ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sosyal Medya</h1>
          <p className="text-slate-400 text-sm mt-1">Profil bağlantıları, paylaşım düğmeleri ve otomatik paylaşım</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500 text-slate-900 hover:bg-amber-400"
          }`}
        >
          {saved ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {/* Profiles */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">Sosyal Medya Profilleri</h2>
          <p className="text-slate-400 text-sm mt-0.5">Header ve footer ikonları için profil URL&apos;leri</p>
        </div>
        <div className="divide-y divide-slate-700/50">
          {profiles.map((profile) => (
            <div key={profile.platform} className="p-5">
              <div className="flex items-center gap-4 mb-3">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                  style={{ backgroundColor: profile.color + "33", border: `1px solid ${profile.color}44` }}
                >
                  <span style={{ color: profile.color }}>{profile.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-200">{profile.label}</p>
                  <p className="text-xs text-slate-500">{profile.handle}</p>
                </div>
                {/* Enable Toggle */}
                <button
                  onClick={() => toggle(profile.platform, "enabled")}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${profile.enabled ? "bg-amber-500" : "bg-slate-600"}`}
                >
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: profile.enabled ? "translateX(22px)" : "translateX(2px)" }} />
                </button>
              </div>

              {profile.enabled && (
                <div className="ml-14 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Kullanıcı Adı / Handle</label>
                      <input
                        value={profile.handle}
                        onChange={(e) => updateUrl(profile.platform, "handle", e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Profil URL</label>
                      <input
                        value={profile.url}
                        onChange={(e) => updateUrl(profile.platform, "url", e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {[
                      { key: "showInHeader", label: "Header'da göster" },
                      { key: "showInFooter", label: "Footer'da göster" },
                      { key: "autoShare", label: "Otomatik paylaşım" },
                    ].map((opt) => (
                      <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                            profile[opt.key as keyof SocialProfile]
                              ? "bg-amber-500 border-amber-500"
                              : "border-slate-500"
                          }`}
                          onClick={() => toggle(profile.platform, opt.key as keyof SocialProfile)}
                        >
                          {profile[opt.key as keyof SocialProfile] && (
                            <svg className="w-2.5 h-2.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-slate-400">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Share Buttons */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700/50 space-y-4">
        <h2 className="text-lg font-bold text-white">Paylaşım Düğmeleri</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">İçerik sayfalarında paylaşım düğmelerini göster</p>
          <button
            onClick={() => setSharing((p) => ({ ...p, addShareButtons: !p.addShareButtons }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${sharing.addShareButtons ? "bg-amber-500" : "bg-slate-600"}`}
          >
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
              style={{ transform: sharing.addShareButtons ? "translateX(22px)" : "translateX(2px)" }} />
          </button>
        </div>
        {sharing.addShareButtons && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Düğme Stili</label>
            <div className="flex gap-3">
              {[
                { value: "icon_only", label: "Sadece İkon" },
                { value: "icon_text", label: "İkon + Metin" },
                { value: "count", label: "Sayım ile" },
              ].map((opt) => (
                <label key={opt.value} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border cursor-pointer text-sm transition-colors ${
                  sharing.shareButtonStyle === opt.value
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-slate-600 text-slate-400 hover:border-slate-500"
                }`} onClick={() => setSharing((p) => ({ ...p, shareButtonStyle: opt.value }))}>
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-slate-400">Yayımlama sonrası otomatik paylaşım</p>
          <button
            onClick={() => setSharing((p) => ({ ...p, shareOnPublish: !p.shareOnPublish }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${sharing.shareOnPublish ? "bg-amber-500" : "bg-slate-600"}`}
          >
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
              style={{ transform: sharing.shareOnPublish ? "translateX(22px)" : "translateX(2px)" }} />
          </button>
        </div>
        {sharing.shareOnPublish && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Varsayılan Paylaşım Metni</label>
              <textarea
                value={sharing.defaultCaption}
                onChange={(e) => setSharing((p) => ({ ...p, defaultCaption: e.target.value }))}
                rows={2}
                className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">Değişkenler: {"{title}"} {"{url}"} {"{excerpt}"} {"{author}"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Varsayılan Hashtag&apos;ler</label>
              <input
                value={sharing.defaultHashtags}
                onChange={(e) => setSharing((p) => ({ ...p, defaultHashtags: e.target.value }))}
                placeholder="#haber #teknoloji"
                className="w-full bg-slate-700 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Summary */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Aktif Profil Özeti</h3>
        <div className="flex flex-wrap gap-2">
          {profiles.filter((p) => p.enabled).map((p) => (
            <span
              key={p.platform}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ backgroundColor: p.color + "22", color: p.color, border: `1px solid ${p.color}44` }}
            >
              <span>{p.icon}</span>
              {p.label}
              {p.autoShare && <span className="text-[10px] opacity-70">🤖</span>}
            </span>
          ))}
          {profiles.filter((p) => p.enabled).length === 0 && (
            <span className="text-slate-500 text-sm">Hiçbir platform etkin değil</span>
          )}
        </div>
      </div>
    </div>
  );
}
