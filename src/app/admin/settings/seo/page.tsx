"use client";

import { useState } from "react";

export default function SeoSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [general, setGeneral] = useState({
    siteTitle: "KURUMSAL – Güvenilir Haber & Analiz",
    titleSeparator: " – ",
    titleFormat: "page_site",
    metaDescription: "Türkiye'nin önde gelen kurumsal haber ve analiz platformu. Teknoloji, ekonomi, dünya ve daha fazlası.",
    metaKeywords: "haber, ekonomi, teknoloji, analiz, Türkiye",
    canonicalBase: "https://kurumsal.com.tr",
    robotsTxt: "index,follow",
    googleVerification: "",
    bingVerification: "",
  });
  const [og, setOg] = useState({
    ogTitle: "KURUMSAL – Güvenilir Haber & Analiz",
    ogDescription: "Türkiye'nin önde gelen kurumsal haber ve analiz platformu.",
    ogImage: "/og-default.jpg",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterSite: "@kurumsal",
    twitterCreator: "@kurumsal",
  });
  const [structured, setStructured] = useState({
    organizationName: "Kurumsal Medya A.Ş.",
    organizationUrl: "https://kurumsal.com.tr",
    organizationLogo: "/logo.svg",
    sameAs: "https://twitter.com/kurumsal\nhttps://linkedin.com/company/kurumsal\nhttps://youtube.com/@kurumsal",
    articleAuthorType: "organization",
    breadcrumbs: true,
    articleSchema: true,
    faqSchema: false,
  });
  const [sitemap, setSitemap] = useState({
    enabled: true,
    includeNews: true,
    includeBlog: true,
    includeCategories: true,
    includePages: true,
    changefreq: "daily",
    newsPriority: "1.0",
    blogPriority: "0.8",
    pagesPriority: "0.6",
    pingSearchEngines: true,
    googleNews: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] placeholder-[#999999] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8] focus:ring-1 focus:ring-[#3A6EA8]/30 transition-colors";
  const selectCls = "w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8]";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">SEO Ayarları</h1>
          <p className="text-[#666666] text-sm mt-1">Meta etiketler, Open Graph, yapısal veri ve site haritası</p>
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

      {/* General */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8] space-y-4">
        <h2 className="text-lg font-bold text-[#111111]">Genel Meta Bilgiler</h2>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Site Başlığı</label>
          <input value={general.siteTitle} onChange={(e) => setGeneral((p) => ({ ...p, siteTitle: e.target.value }))} className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Başlık Ayracı</label>
            <input value={general.titleSeparator} onChange={(e) => setGeneral((p) => ({ ...p, titleSeparator: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Başlık Formatı</label>
            <select value={general.titleFormat} onChange={(e) => setGeneral((p) => ({ ...p, titleFormat: e.target.value }))} className={selectCls}>
              <option value="page_site">Sayfa Adı – Site Adı</option>
              <option value="site_page">Site Adı – Sayfa Adı</option>
              <option value="page_only">Yalnızca Sayfa Adı</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Varsayılan Meta Açıklama</label>
          <textarea
            value={general.metaDescription}
            onChange={(e) => setGeneral((p) => ({ ...p, metaDescription: e.target.value }))}
            rows={3}
            className={inputCls + " resize-none"}
          />
          <p className="text-[11px] text-[#666666] mt-1">{general.metaDescription.length}/160 karakter</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Meta Anahtar Kelimeler</label>
          <input value={general.metaKeywords} onChange={(e) => setGeneral((p) => ({ ...p, metaKeywords: e.target.value }))} placeholder="kelime1, kelime2, ..." className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Canonical URL Tabanı</label>
            <input value={general.canonicalBase} onChange={(e) => setGeneral((p) => ({ ...p, canonicalBase: e.target.value }))} className={inputCls + " font-mono"} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Robots</label>
            <select value={general.robotsTxt} onChange={(e) => setGeneral((p) => ({ ...p, robotsTxt: e.target.value }))} className={selectCls}>
              <option value="index,follow">index, follow</option>
              <option value="noindex,follow">noindex, follow</option>
              <option value="index,nofollow">index, nofollow</option>
              <option value="noindex,nofollow">noindex, nofollow</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Google Site Doğrulama</label>
            <input value={general.googleVerification} onChange={(e) => setGeneral((p) => ({ ...p, googleVerification: e.target.value }))} placeholder="xxxx..." className={inputCls + " font-mono"} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Bing Site Doğrulama</label>
            <input value={general.bingVerification} onChange={(e) => setGeneral((p) => ({ ...p, bingVerification: e.target.value }))} placeholder="xxxx..." className={inputCls + " font-mono"} />
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8] space-y-4">
        <h2 className="text-lg font-bold text-[#111111]">Open Graph & Twitter Card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">OG Başlığı</label>
            <input value={og.ogTitle} onChange={(e) => setOg((p) => ({ ...p, ogTitle: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">OG Türü</label>
            <select value={og.ogType} onChange={(e) => setOg((p) => ({ ...p, ogType: e.target.value }))} className={selectCls}>
              <option value="website">website</option>
              <option value="article">article</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">OG Açıklama</label>
          <textarea value={og.ogDescription} onChange={(e) => setOg((p) => ({ ...p, ogDescription: e.target.value }))} rows={2} className={inputCls + " resize-none"} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Varsayılan OG Görseli (yol)</label>
          <input value={og.ogImage} onChange={(e) => setOg((p) => ({ ...p, ogImage: e.target.value }))} className={inputCls + " font-mono"} />
          <p className="text-[11px] text-[#666666] mt-1">Önerilen: 1200×630 piksel, JPG/PNG</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Twitter Card Türü</label>
            <select value={og.twitterCard} onChange={(e) => setOg((p) => ({ ...p, twitterCard: e.target.value }))} className={selectCls}>
              <option value="summary">summary</option>
              <option value="summary_large_image">summary_large_image</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Twitter Site</label>
            <input value={og.twitterSite} onChange={(e) => setOg((p) => ({ ...p, twitterSite: e.target.value }))} placeholder="@hesap" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Twitter Creator</label>
            <input value={og.twitterCreator} onChange={(e) => setOg((p) => ({ ...p, twitterCreator: e.target.value }))} placeholder="@hesap" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8] space-y-4">
        <h2 className="text-lg font-bold text-[#111111]">Yapısal Veri (JSON-LD)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Kuruluş Adı</label>
            <input value={structured.organizationName} onChange={(e) => setStructured((p) => ({ ...p, organizationName: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1.5">Kuruluş URL</label>
            <input value={structured.organizationUrl} onChange={(e) => setStructured((p) => ({ ...p, organizationUrl: e.target.value }))} className={inputCls + " font-mono"} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">sameAs Profiller (her satıra bir URL)</label>
          <textarea
            value={structured.sameAs}
            onChange={(e) => setStructured((p) => ({ ...p, sameAs: e.target.value }))}
            rows={4}
            className={inputCls + " resize-none font-mono text-xs"}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "breadcrumbs", label: "Breadcrumb Schema" },
            { key: "articleSchema", label: "Article Schema" },
            { key: "faqSchema", label: "FAQ Schema" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  structured[item.key as keyof typeof structured]
                    ? "bg-[#3A6EA8] border-[#3A6EA8]"
                    : "border-[#E7E2D8]"
                }`}
                onClick={() => setStructured((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
              >
                {structured[item.key as keyof typeof structured] && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#444444]">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sitemap */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7E2D8] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#111111]">Site Haritası (XML)</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-[#666666]">Aktif</span>
            <button
              onClick={() => setSitemap((p) => ({ ...p, enabled: !p.enabled }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${sitemap.enabled ? "bg-[#3A6EA8]" : "bg-[#E7E2D8]"}`}
            >
              <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                style={{ transform: sitemap.enabled ? "translateX(22px)" : "translateX(2px)" }} />
            </button>
          </label>
        </div>
        {sitemap.enabled && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "includeNews", label: "Haberler" },
                { key: "includeBlog", label: "Blog" },
                { key: "includeCategories", label: "Kategoriler" },
                { key: "includePages", label: "Sayfalar" },
                { key: "googleNews", label: "Google News" },
                { key: "pingSearchEngines", label: "Arama Motoru Ping" },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      sitemap[item.key as keyof typeof sitemap]
                        ? "bg-[#3A6EA8] border-[#3A6EA8]"
                        : "border-[#E7E2D8]"
                    }`}
                    onClick={() => setSitemap((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                  >
                    {sitemap[item.key as keyof typeof sitemap] && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-[#444444]">{item.label}</span>
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Güncelleme Sıklığı</label>
                <select value={sitemap.changefreq} onChange={(e) => setSitemap((p) => ({ ...p, changefreq: e.target.value }))} className={selectCls}>
                  <option value="always">Her Zaman</option>
                  <option value="hourly">Saatlik</option>
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Haber Önceliği</label>
                <select value={sitemap.newsPriority} onChange={(e) => setSitemap((p) => ({ ...p, newsPriority: e.target.value }))} className={selectCls}>
                  {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5"].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Blog Önceliği</label>
                <select value={sitemap.blogPriority} onChange={(e) => setSitemap((p) => ({ ...p, blogPriority: e.target.value }))} className={selectCls}>
                  {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5"].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#111111] text-sm transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Sitemap İndir
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#111111] text-sm transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Yenile & Ping
              </button>
              <code className="text-xs text-[#666666] font-mono">/sitemap.xml</code>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
