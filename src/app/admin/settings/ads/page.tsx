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
          <h1 className="text-xl font-bold text-[#111111]">Reklam Yönetimi</h1>
          <p className="text-sm text-[#666666] mt-0.5">Reklam zone'larını ve içeriklerini yönetin</p>
        </div>
        <button onClick={save} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-500 text-white" : "bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white"}`}>
          {saved ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {/* Global Toggle */}
      <section className="bg-[#FFFFFF] rounded-xl border border-[#E7E2D8] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#111111]">Reklamları Genel Aktif/Pasif</h2>
            <p className="text-xs text-[#666666] mt-0.5">Tüm reklam zone'larını tek seferde aç/kapat</p>
          </div>
          <div
            onClick={() => setGlobalActive(!globalActive)}
            className={`w-14 h-7 rounded-full transition-colors cursor-pointer relative ${globalActive ? "bg-[#3A6EA8]" : "bg-[#E7E2D8]"}`}
          >
            <span className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${globalActive ? "translate-x-8" : "translate-x-1.5"}`} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#E7E2D8]">
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Google AdSense Client ID</label>
          <input
            value={adsenseId}
            onChange={(e) => setAdsenseId(e.target.value)}
            placeholder="ca-pub-XXXXXXXXXXXXXXXXX"
            className="w-full bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8] font-mono"
          />
        </div>
      </section>

      {/* Ad Zones */}
      <section className="bg-[#FFFFFF] rounded-xl border border-[#E7E2D8]">
        <div className="px-5 py-4 border-b border-[#E7E2D8]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#444444]">Reklam Zone&apos;ları</h2>
        </div>
        <div className="divide-y divide-[#E7E2D8]">
          {zones.map((zone) => (
            <div key={zone.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#111111]">{zone.label}</p>
                  <p className="text-xs text-[#666666]">{zone.width}×{zone.height} px</p>
                </div>
                <div
                  onClick={() => toggleZone(zone.id)}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${zone.active ? "bg-[#3A6EA8]" : "bg-[#E7E2D8]"}`}
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
                          zone.type === t ? "bg-[#3A6EA8] text-white" : "bg-[#EBF2FA] text-[#666666] hover:bg-[#E7E2D8]"
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
                    className="w-full bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] placeholder-[#999999] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#3A6EA8] resize-none"
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
