"use client";

import { useState } from "react";

export default function PerformancePage() {
  const [saved, setSaved] = useState(false);

  const [cache, setCache] = useState({
    enabled: true,
    strategy: "stale_while_revalidate",
    ttlNews: "300",
    ttlBlog: "3600",
    ttlPages: "86400",
    ttlApi: "60",
    redisEnabled: false,
    redisUrl: "",
    purgeOnPublish: true,
  });

  const [cdn, setCdn] = useState({
    enabled: false,
    provider: "cloudflare",
    cdnUrl: "",
    imageOptimization: true,
    brotliCompression: true,
    http2Push: false,
    minifyHtml: true,
    minifyCss: true,
    minifyJs: true,
  });

  const [images, setImages] = useState({
    lazyLoad: true,
    webpConversion: true,
    avifConversion: false,
    responsiveSizes: "640,768,1024,1280,1536",
    quality: "80",
    blurPlaceholder: true,
    externalDomains: "picsum.photos\ncloudinary.com",
  });

  const [vitals, setVitals] = useState({
    preconnect: "https://fonts.googleapis.com\nhttps://fonts.gstatic.com",
    dnsPrefetch: "https://www.google-analytics.com",
    deferThirdParty: true,
    criticalCssInline: true,
    fontDisplay: "swap",
    resourceHints: true,
    analyticsId: "",
    gaEnabled: false,
    gtmEnabled: false,
    gtmId: "",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] placeholder-[#999999] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8] focus:ring-1 focus:ring-[#3A6EA8]/30 transition-colors";
  const selectCls = "w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8]";

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? "bg-[#3A6EA8]" : "bg-[#E7E2D8]"}`}>
      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: value ? "translateX(22px)" : "translateX(2px)" }} />
    </button>
  );

  const Checkbox = ({ value, onChange, label }: { value: boolean; onChange: () => void; label: string }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${value ? "bg-[#3A6EA8] border-[#3A6EA8]" : "border-[#E7E2D8]"}`} onClick={onChange}>
        {value && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="text-sm text-[#444444]">{label}</span>
    </label>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Performans</h1>
          <p className="text-[#666666] text-sm mt-1">Önbellek, CDN, görsel optimizasyon ve Core Web Vitals</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            saved ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-[#3A6EA8] text-white hover:bg-[#2D5A8E]"
          }`}
        >
          {saved ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {/* Core Web Vitals Score Preview */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8]">
        <h2 className="text-lg font-bold text-[#111111] mb-4">Tahmini Puan</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Performance", score: 94, color: "text-emerald-700" },
            { label: "Accessibility", score: 98, color: "text-emerald-700" },
            { label: "Best Practices", score: 96, color: "text-emerald-700" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E7E2D8" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={item.score >= 90 ? "#10B981" : item.score >= 50 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="3" strokeDasharray={`${item.score} ${100 - item.score}`} strokeLinecap="round" />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xl font-black ${item.color}`}>{item.score}</span>
              </div>
              <p className="text-xs font-medium text-[#666666]">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#666666] text-center mt-3">Tahmini puan — gerçek puan Google PageSpeed Insights ile ölçülür</p>
      </div>

      {/* Cache */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">Önbellek (Cache)</h2>
            <p className="text-[#666666] text-sm">HTTP önbellek stratejisi ve TTL değerleri</p>
          </div>
          <Toggle value={cache.enabled} onChange={() => setCache((p) => ({ ...p, enabled: !p.enabled }))} />
        </div>
        {cache.enabled && (
          <>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1.5">Strateji</label>
              <select value={cache.strategy} onChange={(e) => setCache((p) => ({ ...p, strategy: e.target.value }))} className={selectCls}>
                <option value="stale_while_revalidate">Stale While Revalidate (Önerilen)</option>
                <option value="cache_first">Cache First</option>
                <option value="network_first">Network First</option>
                <option value="no_cache">Önbelleksiz</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "ttlNews", label: "Haber TTL (sn)" },
                { key: "ttlBlog", label: "Blog TTL (sn)" },
                { key: "ttlPages", label: "Sayfa TTL (sn)" },
                { key: "ttlApi", label: "API TTL (sn)" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-[#666666] mb-1.5">{f.label}</label>
                  <input type="number" value={cache[f.key as keyof typeof cache] as string}
                    onChange={(e) => setCache((p) => ({ ...p, [f.key]: e.target.value }))}
                    className={inputCls} />
                </div>
              ))}
            </div>
            <div className="border-t border-[#E7E2D8] pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#111111]">Redis Önbelleği</p>
                  <p className="text-xs text-[#666666]">BullMQ kuyrukları için de kullanılır</p>
                </div>
                <Toggle value={cache.redisEnabled} onChange={() => setCache((p) => ({ ...p, redisEnabled: !p.redisEnabled }))} />
              </div>
              {cache.redisEnabled && (
                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1.5">Redis URL</label>
                  <input value={cache.redisUrl} onChange={(e) => setCache((p) => ({ ...p, redisUrl: e.target.value }))}
                    placeholder="redis://localhost:6379" className={inputCls + " font-mono"} />
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#444444]">Yayımlamada önbelleği temizle</p>
                <Toggle value={cache.purgeOnPublish} onChange={() => setCache((p) => ({ ...p, purgeOnPublish: !p.purgeOnPublish }))} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* CDN */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">CDN</h2>
            <p className="text-[#666666] text-sm">İçerik dağıtım ağı ve sıkıştırma</p>
          </div>
          <Toggle value={cdn.enabled} onChange={() => setCdn((p) => ({ ...p, enabled: !p.enabled }))} />
        </div>
        {cdn.enabled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">CDN Sağlayıcı</label>
                <select value={cdn.provider} onChange={(e) => setCdn((p) => ({ ...p, provider: e.target.value }))} className={selectCls}>
                  <option value="cloudflare">Cloudflare</option>
                  <option value="bunny">Bunny.net</option>
                  <option value="cloudfront">AWS CloudFront</option>
                  <option value="fastly">Fastly</option>
                  <option value="custom">Özel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">CDN URL</label>
                <input value={cdn.cdnUrl} onChange={(e) => setCdn((p) => ({ ...p, cdnUrl: e.target.value }))}
                  placeholder="https://cdn.kurumsal.com" className={inputCls + " font-mono"} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Checkbox value={cdn.imageOptimization} onChange={() => setCdn((p) => ({ ...p, imageOptimization: !p.imageOptimization }))} label="Görsel Optimizasyon" />
              <Checkbox value={cdn.brotliCompression} onChange={() => setCdn((p) => ({ ...p, brotliCompression: !p.brotliCompression }))} label="Brotli Sıkıştırma" />
              <Checkbox value={cdn.http2Push} onChange={() => setCdn((p) => ({ ...p, http2Push: !p.http2Push }))} label="HTTP/2 Push" />
              <Checkbox value={cdn.minifyHtml} onChange={() => setCdn((p) => ({ ...p, minifyHtml: !p.minifyHtml }))} label="HTML Küçült" />
              <Checkbox value={cdn.minifyCss} onChange={() => setCdn((p) => ({ ...p, minifyCss: !p.minifyCss }))} label="CSS Küçült" />
              <Checkbox value={cdn.minifyJs} onChange={() => setCdn((p) => ({ ...p, minifyJs: !p.minifyJs }))} label="JS Küçült" />
            </div>
          </>
        )}
      </div>

      {/* Images */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8] space-y-4">
        <h2 className="text-lg font-bold text-[#111111]">Görsel Optimizasyon</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Checkbox value={images.lazyLoad} onChange={() => setImages((p) => ({ ...p, lazyLoad: !p.lazyLoad }))} label="Lazy Load" />
          <Checkbox value={images.webpConversion} onChange={() => setImages((p) => ({ ...p, webpConversion: !p.webpConversion }))} label="WebP Dönüşüm" />
          <Checkbox value={images.avifConversion} onChange={() => setImages((p) => ({ ...p, avifConversion: !p.avifConversion }))} label="AVIF Dönüşüm" />
          <Checkbox value={images.blurPlaceholder} onChange={() => setImages((p) => ({ ...p, blurPlaceholder: !p.blurPlaceholder }))} label="Blur Placeholder" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">
              Görsel Kalitesi
              <span className="ml-2 text-[#3A6EA8] font-mono">{images.quality}</span>
            </label>
            <input type="range" min={50} max={100} step={5} value={images.quality}
              onChange={(e) => setImages((p) => ({ ...p, quality: e.target.value }))}
              className="w-full accent-[#3A6EA8]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Responsive Boyutlar</label>
            <input value={images.responsiveSizes} onChange={(e) => setImages((p) => ({ ...p, responsiveSizes: e.target.value }))}
              className={inputCls + " font-mono"} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">İzin Verilen Harici Domain&apos;ler</label>
          <textarea value={images.externalDomains} onChange={(e) => setImages((p) => ({ ...p, externalDomains: e.target.value }))}
            rows={3} className={inputCls + " resize-none font-mono text-xs"} />
          <p className="text-[11px] text-[#666666] mt-1">next.config.js &rarr; images.remotePatterns için, her satıra bir domain</p>
        </div>
      </div>

      {/* Vitals & Analytics */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8] space-y-4">
        <h2 className="text-lg font-bold text-[#111111]">Core Web Vitals & Analitik</h2>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Preconnect URL&apos;leri</label>
          <textarea value={vitals.preconnect} onChange={(e) => setVitals((p) => ({ ...p, preconnect: e.target.value }))}
            rows={3} className={inputCls + " resize-none font-mono text-xs"} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">DNS Prefetch</label>
          <input value={vitals.dnsPrefetch} onChange={(e) => setVitals((p) => ({ ...p, dnsPrefetch: e.target.value }))}
            className={inputCls + " font-mono"} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Checkbox value={vitals.deferThirdParty} onChange={() => setVitals((p) => ({ ...p, deferThirdParty: !p.deferThirdParty }))} label="3. Taraf Ertelemesi" />
          <Checkbox value={vitals.criticalCssInline} onChange={() => setVitals((p) => ({ ...p, criticalCssInline: !p.criticalCssInline }))} label="Critical CSS Inline" />
          <Checkbox value={vitals.resourceHints} onChange={() => setVitals((p) => ({ ...p, resourceHints: !p.resourceHints }))} label="Resource Hints" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Font Display</label>
          <select value={vitals.fontDisplay} onChange={(e) => setVitals((p) => ({ ...p, fontDisplay: e.target.value }))} className={selectCls}>
            <option value="swap">swap (Önerilen)</option>
            <option value="optional">optional</option>
            <option value="fallback">fallback</option>
            <option value="block">block</option>
          </select>
        </div>
        <div className="border-t border-[#E7E2D8] pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#111111]">Google Analytics 4</p>
            <Toggle value={vitals.gaEnabled} onChange={() => setVitals((p) => ({ ...p, gaEnabled: !p.gaEnabled }))} />
          </div>
          {vitals.gaEnabled && (
            <input value={vitals.analyticsId} onChange={(e) => setVitals((p) => ({ ...p, analyticsId: e.target.value }))}
              placeholder="G-XXXXXXXXXX" className={inputCls + " font-mono"} />
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#111111]">Google Tag Manager</p>
            <Toggle value={vitals.gtmEnabled} onChange={() => setVitals((p) => ({ ...p, gtmEnabled: !p.gtmEnabled }))} />
          </div>
          {vitals.gtmEnabled && (
            <input value={vitals.gtmId} onChange={(e) => setVitals((p) => ({ ...p, gtmId: e.target.value }))}
              placeholder="GTM-XXXXXXX" className={inputCls + " font-mono"} />
          )}
        </div>
      </div>
    </div>
  );
}
