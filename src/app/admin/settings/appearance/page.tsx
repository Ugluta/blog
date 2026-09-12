"use client";

import { useState } from "react";

const PRESET_THEMES = [
  { name: "Lacivert & Altın", primary: "#0F172A", accent: "#F59E0B", label: "Varsayılan" },
  { name: "Koyu & Mavi", primary: "#0D1B2A", accent: "#3B82F6", label: "" },
  { name: "Siyah & Kırmızı", primary: "#0A0A0A", accent: "#EF4444", label: "" },
  { name: "Derin Mor & Altın", primary: "#1A0A2E", accent: "#F59E0B", label: "" },
  { name: "Antrasit & Yeşil", primary: "#111827", accent: "#10B981", label: "" },
  { name: "Koyu & Beyaz", primary: "#18181B", accent: "#FAFAFA", label: "" },
];

const FONT_PAIRS = [
  { heading: "Playfair Display", body: "Inter", label: "Klasik Kurumsal" },
  { heading: "Merriweather", body: "Source Sans Pro", label: "Gazete" },
  { heading: "Roboto Slab", body: "Roboto", label: "Modern" },
  { heading: "Georgia", body: "Arial", label: "Sade" },
  { heading: "Inter", body: "Inter", label: "Minimalist" },
];

interface ColorState {
  primary: string;
  accent: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  linkColor: string;
}

export default function AppearancePage() {
  const [saved, setSaved] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedFont, setSelectedFont] = useState(0);
  const [colors, setColors] = useState<ColorState>({
    primary: "#0F172A",
    accent: "#F59E0B",
    cardBg: "#1E293B",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    borderColor: "#1E293B",
    linkColor: "#F59E0B",
  });
  const [layout, setLayout] = useState({
    containerMaxWidth: "1280",
    sidebarWidth: "320",
    headerHeight: "64",
    borderRadius: "12",
    cardShadow: "medium",
    navStyle: "dark",
    logoStyle: "text",
  });
  const [typography, setTypography] = useState({
    baseFontSize: "16",
    lineHeight: "1.6",
    headingWeight: "700",
    bodyWeight: "400",
    letterSpacing: "normal",
  });

  const applyTheme = (idx: number) => {
    setSelectedTheme(idx);
    setColors((prev) => ({
      ...prev,
      primary: PRESET_THEMES[idx].primary,
      accent: PRESET_THEMES[idx].accent,
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Görünüm Ayarları</h1>
          <p className="text-[#666666] text-sm mt-1">Renkler, yazı tipleri, düzen ve bileşen stili</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-[#3A6EA8] text-white hover:bg-[#2D5A8E]"
          }`}
        >
          {saved ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {/* Theme Presets */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8]">
        <h2 className="text-lg font-bold text-[#111111] mb-1">Hazır Temalar</h2>
        <p className="text-[#666666] text-sm mb-5">Bir tema seçin — renkleri aşağıdan özelleştirebilirsiniz.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESET_THEMES.map((theme, idx) => (
            <button
              key={theme.name}
              onClick={() => applyTheme(idx)}
              className={`relative rounded-xl p-4 border-2 transition-all text-left ${
                selectedTheme === idx
                  ? "border-[#3A6EA8] ring-1 ring-[#3A6EA8]/30"
                  : "border-[#E7E2D8] hover:border-[#E7E2D8]"
              }`}
              style={{ backgroundColor: theme.primary }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                <div className="flex-1 h-2 rounded-full opacity-30 bg-white" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2 w-3/4 rounded-full opacity-20 bg-white" />
                <div className="h-1.5 w-1/2 rounded-full opacity-15 bg-white" />
              </div>
              <p className="text-[11px] font-semibold mt-3" style={{ color: theme.accent }}>
                {theme.name}
              </p>
              {theme.label && (
                <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: theme.accent + "33", color: theme.accent }}>
                  {theme.label}
                </span>
              )}
              {selectedTheme === idx && (
                <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-[#3A6EA8] flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Color Customizer */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8]">
        <h2 className="text-lg font-bold text-[#111111] mb-1">Renk Paleti</h2>
        <p className="text-[#666666] text-sm mb-5">Site genelinde kullanılan renkleri özelleştirin.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.entries(colors) as [keyof ColorState, string][]).map(([key, value]) => {
            const labels: Record<keyof ColorState, string> = {
              primary: "Ana Arka Plan",
              accent: "Vurgu Rengi (Altın)",
              cardBg: "Kart Arka Planı",
              textPrimary: "Birincil Metin",
              textSecondary: "İkincil Metin",
              borderColor: "Kenar Çizgisi",
              linkColor: "Bağlantı Rengi",
            };
            return (
              <label key={key} className="flex items-center gap-4 p-3 rounded-xl bg-[#EBF2FA] hover:bg-[#EBF2FA] transition-colors cursor-pointer">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => setColors((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent p-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111]">{labels[key]}</p>
                  <p className="text-xs text-[#666666] font-mono">{value}</p>
                </div>
                <div className="w-6 h-6 rounded-md border border-[#E7E2D8]" style={{ backgroundColor: value }} />
              </label>
            );
          })}
        </div>
      </div>

      {/* Font Pairs */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8]">
        <h2 className="text-lg font-bold text-[#111111] mb-1">Yazı Tipi Çiftleri</h2>
        <p className="text-[#666666] text-sm mb-5">Başlık ve gövde metni için yazı tipi kombinasyonu.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {FONT_PAIRS.map((pair, idx) => (
            <button
              key={pair.label}
              onClick={() => setSelectedFont(idx)}
              className={`rounded-xl p-4 border-2 text-left transition-all ${
                selectedFont === idx
                  ? "border-[#3A6EA8] bg-[#EBF2FA]"
                  : "border-[#E7E2D8] hover:border-[#E7E2D8]"
              }`}
            >
              <p className="text-lg font-bold text-[#111111]" style={{ fontFamily: pair.heading }}>
                Aa Başlık
              </p>
              <p className="text-sm text-[#666666] mt-1" style={{ fontFamily: pair.body }}>
                Gövde metni örneği
              </p>
              <p className="text-[11px] text-[#3A6EA8] mt-2 font-medium">{pair.label}</p>
            </button>
          ))}
        </div>

        {/* Typography Detail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "baseFontSize", label: "Temel Font Boyutu (px)", type: "range", min: 14, max: 20 },
            { key: "lineHeight", label: "Satır Yüksekliği", type: "range", min: 1.2, max: 2.0, step: 0.1 },
            { key: "headingWeight", label: "Başlık Font Ağırlığı", type: "select", options: ["400", "500", "600", "700", "800", "900"] },
            { key: "bodyWeight", label: "Gövde Font Ağırlığı", type: "select", options: ["300", "400", "500"] },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-[#666666] mb-1.5">
                {field.label}
                {field.type === "range" && (
                  <span className="ml-2 text-[#3A6EA8] font-mono">
                    {typography[field.key as keyof typeof typography]}
                    {field.key === "baseFontSize" ? "px" : ""}
                  </span>
                )}
              </label>
              {field.type === "range" ? (
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step ?? 1}
                  value={typography[field.key as keyof typeof typography]}
                  onChange={(e) => setTypography((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full accent-[#3A6EA8]"
                />
              ) : (
                <select
                  value={typography[field.key as keyof typeof typography]}
                  onChange={(e) => setTypography((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]"
                >
                  {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Layout Settings */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8]">
        <h2 className="text-lg font-bold text-[#111111] mb-1">Düzen</h2>
        <p className="text-[#666666] text-sm mb-5">Sayfa genişliği, kenar yuvarlaklığı ve gölge seçenekleri.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">
              Maks. Container Genişliği
              <span className="ml-2 text-[#3A6EA8] font-mono">{layout.containerMaxWidth}px</span>
            </label>
            <input type="range" min={960} max={1536} step={64}
              value={layout.containerMaxWidth}
              onChange={(e) => setLayout((p) => ({ ...p, containerMaxWidth: e.target.value }))}
              className="w-full accent-[#3A6EA8]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">
              Kenar Yuvarlaklığı
              <span className="ml-2 text-[#3A6EA8] font-mono">{layout.borderRadius}px</span>
            </label>
            <input type="range" min={0} max={24} step={2}
              value={layout.borderRadius}
              onChange={(e) => setLayout((p) => ({ ...p, borderRadius: e.target.value }))}
              className="w-full accent-[#3A6EA8]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Kart Gölgesi</label>
            <select
              value={layout.cardShadow}
              onChange={(e) => setLayout((p) => ({ ...p, cardShadow: e.target.value }))}
              className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]"
            >
              <option value="none">Yok</option>
              <option value="soft">Hafif</option>
              <option value="medium">Orta</option>
              <option value="strong">Güçlü</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Navigasyon Stili</label>
            <select
              value={layout.navStyle}
              onChange={(e) => setLayout((p) => ({ ...p, navStyle: e.target.value }))}
              className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]"
            >
              <option value="dark">Koyu</option>
              <option value="light">Açık</option>
              <option value="transparent">Şeffaf</option>
              <option value="glass">Cam (Glassmorphism)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Logo Stili</label>
            <select
              value={layout.logoStyle}
              onChange={(e) => setLayout((p) => ({ ...p, logoStyle: e.target.value }))}
              className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]"
            >
              <option value="text">Metin</option>
              <option value="image">Resim</option>
              <option value="both">Resim + Metin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">
              Header Yüksekliği
              <span className="ml-2 text-[#3A6EA8] font-mono">{layout.headerHeight}px</span>
            </label>
            <input type="range" min={48} max={96} step={4}
              value={layout.headerHeight}
              onChange={(e) => setLayout((p) => ({ ...p, headerHeight: e.target.value }))}
              className="w-full accent-[#3A6EA8]"
            />
          </div>
        </div>
      </div>

      {/* Preview Bar */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8]">
        <h2 className="text-lg font-bold text-[#111111] mb-4">Önizleme</h2>
        <div className="rounded-xl overflow-hidden border border-[#E7E2D8]" style={{ backgroundColor: colors.primary }}>
          <div className="px-4 py-3 border-b border-[#E7E2D8] flex items-center justify-between" style={{ backgroundColor: colors.cardBg }}>
            <span className="font-black text-sm tracking-widest uppercase" style={{ color: colors.accent }}>
              KURUMSAL
            </span>
            <div className="flex gap-2">
              {["Ana Sayfa", "Haberler", "Blog", "İletişim"].map((l) => (
                <span key={l} className="text-xs px-3 py-1 rounded" style={{ color: colors.textSecondary }}>{l}</span>
              ))}
            </div>
          </div>
          <div className="p-4 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg p-3 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
                <div className="h-2 rounded mb-2 w-2/3" style={{ backgroundColor: colors.accent }} />
                <div className="h-1.5 rounded mb-1 w-full opacity-30" style={{ backgroundColor: colors.textPrimary }} />
                <div className="h-1.5 rounded w-3/4 opacity-20" style={{ backgroundColor: colors.textSecondary }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
