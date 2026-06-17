"use client";

import { useState } from "react";
import { defaultSettings } from "@/lib/siteSettings";

export default function AdsSettings() {
  const [zones, setZones] = useState(defaultSettings.ads.zones);
  const [adsenseId, setAdsenseId] = useState(defaultSettings.ads.adsenseClientId);
  const [globalActive, setGlobalActive] = useState(defaultSettings.ads.globalAdsActive);
  const [saved, setSaved] = useState(false);

  const toggleZone = (id: string) => {
    setZones((prev) => prev.map((z) => z.id === id ? { ...z, active: !z.active } : z));
  };

  const updateContent = (id: string, content: string) => {
    setZones((prev) => prev.map((z) => z.id === id ? { ...z, content } : z));
  };

  const updateType = (id: string, type: "adsense" | "html" | "image") => {
    setZones((prev) => prev.map((z) => z.id === id ? { ...z, type } : z));
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Reklam Yönetimi</h1>
          <p className="text-sm text-slate-400 mt-0.5">Reklam zone'larını ve içeriklerini yönetin</p>
        </div>
        <button onClick={save} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-500 text-white" : "bg-amber-500 hover:bg-amber-400 text-slate-900"}`}>
          {saved ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {/* Global Toggle */}
      <section className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-200">Reklamları Genel Aktif/Pasif</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tüm reklam zone'larını tek seferde aç/kapat</p>
          </div>
          <div
            onClick={() => setGlobalActive(!globalActive)}
            className={`w-14 h-7 rounded-full transition-colors cursor-pointer relative ${globalActive ? "bg-amber-500" : "bg-slate-600"}`}
          >
            <span className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${globalActive ? "translate-x-8" : "translate-x-1.5"}`} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Google AdSense Client ID</label>
          <input
            value={adsenseId}
            onChange={(e) => setAdsenseId(e.target.value)}
            placeholder="ca-pub-XXXXXXXXXXXXXXXXX"
            className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </section>

      {/* Ad Zones */}
      <section className="bg-[#1E293B] rounded-xl border border-slate-700/50">
        <div className="px-5 py-4 border-b border-slate-700/50">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Reklam Zone&apos;ları</h2>
        </div>
        <div className="divide-y divide-slate-700/30">
          {zones.map((zone) => (
            <div key={zone.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{zone.label}</p>
                  <p className="text-xs text-slate-500">{zone.width}×{zone.height} px</p>
                </div>
                <div
                  onClick={() => toggleZone(zone.id)}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${zone.active ? "bg-amber-500" : "bg-slate-600"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${zone.active ? "translate-x-6" : "translate-x-1"}`} />
                </div>
              </div>
              {zone.active && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {(["adsense", "html", "image"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => updateType(zone.id, t)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          zone.type === t ? "bg-amber-500 text-slate-900" : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                        }`}
                      >
                        {t === "adsense" ? "AdSense" : t === "html" ? "Özel HTML" : "Görsel"}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={zone.content}
                    onChange={(e) => updateContent(zone.id, e.target.value)}
                    placeholder={
                      zone.type === "adsense" ? "AdSense slot ID: XXXXXXXXXX"
                      : zone.type === "html" ? "<script>...</script> veya banner HTML kodunuz"
                      : "Görsel URL: https://..."
                    }
                    rows={2}
                    className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
