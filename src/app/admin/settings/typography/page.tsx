"use client";

import { useState } from "react";

const FONT_OPTIONS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat",
  "Poppins", "Raleway", "Nunito", "Source Sans 3",
  "Playfair Display", "Merriweather", "Roboto Slab", "Oswald", "Georgia",
];

export default function TypographyPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    fontBody: "Inter",
    fontHeading: "Playfair Display",
    baseFontSize: "16",
    lineHeight: "1.7",
    headingWeight: "700",
    letterSpacing: "normal",
    paragraphSpacing: "1.5",
  });

  const set = (k: keyof typeof settings, v: string) =>
    setSettings((p) => ({ ...p, [k]: v }));

  const save = async () => {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        font_body: settings.fontBody,
        font_heading: settings.fontHeading,
        font_size_base: settings.baseFontSize,
        line_height: settings.lineHeight,
        font_weight_heading: settings.headingWeight,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[#111111]">Tipografi</h1>
        <p className="text-sm text-[#666666] mt-1">Yazı tipi ve boyut ayarları</p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#444444] mb-1.5">Gövde Fontu</label>
          <select
            value={settings.fontBody}
            onChange={(e) => set("fontBody", e.target.value)}
            className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#111111] text-sm focus:outline-none focus:ring-1 focus:ring-[#3A6EA8]/50"
          >
            {FONT_OPTIONS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#444444] mb-1.5">Başlık Fontu</label>
          <select
            value={settings.fontHeading}
            onChange={(e) => set("fontHeading", e.target.value)}
            className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#111111] text-sm focus:outline-none focus:ring-1 focus:ring-[#3A6EA8]/50"
          >
            {FONT_OPTIONS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#444444] mb-1.5">
            Temel Font Boyutu — <span className="text-[#3A6EA8]">{settings.baseFontSize}px</span>
          </label>
          <input
            type="range" min="12" max="20" step="1"
            value={settings.baseFontSize}
            onChange={(e) => set("baseFontSize", e.target.value)}
            className="w-full accent-[#3A6EA8]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#444444] mb-1.5">Satır Yüksekliği</label>
          <select
            value={settings.lineHeight}
            onChange={(e) => set("lineHeight", e.target.value)}
            className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#111111] text-sm focus:outline-none focus:ring-1 focus:ring-[#3A6EA8]/50"
          >
            {["1.4","1.5","1.6","1.7","1.8","2.0"].map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#444444] mb-1.5">Başlık Kalınlığı</label>
          <select
            value={settings.headingWeight}
            onChange={(e) => set("headingWeight", e.target.value)}
            className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#111111] text-sm focus:outline-none focus:ring-1 focus:ring-[#3A6EA8]/50"
          >
            {[["400","Normal"],["500","Medium"],["600","SemiBold"],["700","Bold"],["800","ExtraBold"],["900","Black"]].map(([v,l]) => (
              <option key={v} value={v}>{l} ({v})</option>
            ))}
          </select>
        </div>

        {/* Preview */}
        <div className="mt-2 p-4 rounded-xl border border-[#E7E2D8] bg-[#F8F6F1]">
          <p className="text-[10px] text-[#666666] uppercase tracking-widest mb-3">Önizleme</p>
          <h3 style={{ fontFamily: settings.fontHeading, fontWeight: settings.headingWeight, fontSize: "20px" }} className="text-[#111111] mb-2">
            Örnek Başlık Metni
          </h3>
          <p style={{ fontFamily: settings.fontBody, fontSize: `${settings.baseFontSize}px`, lineHeight: settings.lineHeight }} className="text-[#444444]">
            Türkiye&apos;nin öncü kurumsal içerik platformu. Yapay zeka destekli içerik üretimi ve otomasyon çözümleri.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="px-5 py-2 rounded-lg bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm transition-colors"
        >
          Kaydet
        </button>
        {saved && <span className="text-xs text-green-700">✓ Kaydedildi</span>}
      </div>
    </div>
  );
}
