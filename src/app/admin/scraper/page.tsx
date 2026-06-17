"use client";

import { useState } from "react";

type SourceType = "news_site" | "blog" | "twitter" | "rss" | "youtube";
type SourceStatus = "active" | "paused" | "error";

interface ScraperSource {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  status: SourceStatus;
  interval: number;
  lastRun: string;
  articlesFound: number;
  aiProvider: string;
  aiTask: string;
  autoPublish: boolean;
  targetCategory: string;
  selectors?: {
    articleList?: string;
    title?: string;
    content?: string;
    image?: string;
    date?: string;
  };
}

const TYPE_LABELS: Record<SourceType, string> = {
  news_site: "Haber Sitesi",
  blog: "Blog",
  twitter: "Twitter/X",
  rss: "RSS Beslemesi",
  youtube: "YouTube",
};

const TYPE_ICONS: Record<SourceType, string> = {
  news_site: "📰",
  blog: "✍️",
  twitter: "𝕏",
  rss: "📡",
  youtube: "▶️",
};

const STATUS_COLORS: Record<SourceStatus, string> = {
  active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  paused: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  error: "text-red-400 bg-red-400/10 border-red-400/20",
};

const AI_PROVIDERS = ["Claude", "Gemini", "GPT-4", "Grok", "DeepSeek"];
const CATEGORIES = ["Teknoloji", "Ekonomi", "Dünya", "Spor", "Sağlık", "Kültür", "Genel"];

const defaultSources: ScraperSource[] = [
  {
    id: "1", name: "TechCrunch Türkçe", url: "https://techcrunch.com", type: "news_site",
    status: "active", interval: 30, lastRun: "5 dk önce", articlesFound: 142,
    aiProvider: "Claude", aiTask: "rewrite", autoPublish: false, targetCategory: "Teknoloji",
  },
  {
    id: "2", name: "Bloomberg HT", url: "https://bloomberght.com", type: "news_site",
    status: "active", interval: 15, lastRun: "12 dk önce", articlesFound: 89,
    aiProvider: "Gemini", aiTask: "summary", autoPublish: true, targetCategory: "Ekonomi",
  },
  {
    id: "3", name: "@elonmusk", url: "https://twitter.com/elonmusk", type: "twitter",
    status: "paused", interval: 60, lastRun: "2 sa önce", articlesFound: 34,
    aiProvider: "Grok", aiTask: "social_caption", autoPublish: false, targetCategory: "Teknoloji",
  },
  {
    id: "4", name: "Hacker News RSS", url: "https://news.ycombinator.com/rss", type: "rss",
    status: "active", interval: 60, lastRun: "45 dk önce", articlesFound: 267,
    aiProvider: "Claude", aiTask: "rewrite", autoPublish: false, targetCategory: "Teknoloji",
  },
  {
    id: "5", name: "Arda Güler YouTube", url: "https://youtube.com/@ardaguler", type: "youtube",
    status: "error", interval: 120, lastRun: "Hata: Auth gerekli", articlesFound: 0,
    aiProvider: "GPT-4", aiTask: "video_script", autoPublish: false, targetCategory: "Spor",
  },
];

function genId() { return Math.random().toString(36).slice(2, 9); }

const emptySource: Partial<ScraperSource> = {
  type: "news_site", status: "paused", interval: 60,
  aiProvider: "Claude", aiTask: "rewrite", autoPublish: false, targetCategory: "Genel",
};

export default function ScraperPage() {
  const [sources, setSources] = useState<ScraperSource[]>(defaultSources);
  const [modal, setModal] = useState<"add" | ScraperSource | null>(null);
  const [form, setForm] = useState<Partial<ScraperSource>>(emptySource);
  const [running, setRunning] = useState<string | null>(null);
  const [filter, setFilter] = useState<SourceType | "all">("all");

  const filtered = sources.filter((s) => filter === "all" || s.type === filter);

  const openAdd = () => { setForm(emptySource); setModal("add"); };
  const openEdit = (s: ScraperSource) => { setForm({ ...s }); setModal(s); };

  const saveForm = () => {
    if (!form.name || !form.url) return;
    if (modal === "add") {
      const ns: ScraperSource = {
        id: genId(), name: form.name!, url: form.url!, type: form.type ?? "news_site",
        status: "paused", interval: form.interval ?? 60, lastRun: "Hiç çalışmadı",
        articlesFound: 0, aiProvider: form.aiProvider ?? "Claude", aiTask: form.aiTask ?? "rewrite",
        autoPublish: form.autoPublish ?? false, targetCategory: form.targetCategory ?? "Genel",
      };
      setSources((p) => [...p, ns]);
    } else if (modal && typeof modal === "object") {
      setSources((p) => p.map((s) => s.id === (modal as ScraperSource).id ? { ...s, ...form } as ScraperSource : s));
    }
    setModal(null);
  };

  const deleteSource = (id: string) => setSources((p) => p.filter((s) => s.id !== id));
  const toggleStatus = (id: string) => setSources((p) => p.map((s) =>
    s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s
  ));

  const runNow = async (id: string) => {
    setRunning(id);
    await new Promise((r) => setTimeout(r, 2000));
    setSources((p) => p.map((s) => s.id === id ? { ...s, lastRun: "Az önce", articlesFound: s.articlesFound + Math.floor(Math.random() * 5) } : s));
    setRunning(null);
  };

  const totalActive = sources.filter((s) => s.status === "active").length;
  const totalArticles = sources.reduce((a, s) => a + s.articlesFound, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Scraper Kaynakları</h1>
          <p className="text-slate-400 text-sm mt-1">Haber siteleri, bloglar, Twitter ve RSS beslemeleri</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Kaynak Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Toplam Kaynak", value: sources.length, icon: "📡" },
          { label: "Aktif", value: totalActive, icon: "🟢" },
          { label: "Toplam Makale", value: totalArticles.toLocaleString("tr"), icon: "📰" },
          { label: "Hata", value: sources.filter((s) => s.status === "error").length, icon: "⚠️" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <span>{stat.icon}</span>
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(["all", "news_site", "blog", "twitter", "rss", "youtube"] as const).map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === t ? "bg-amber-500 text-slate-900" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            }`}>
            {t === "all" ? "Tümü" : `${TYPE_ICONS[t]} ${TYPE_LABELS[t]}`}
          </button>
        ))}
      </div>

      {/* Source List */}
      <div className="space-y-3">
        {filtered.map((source) => (
          <div key={source.id} className="bg-slate-800 rounded-2xl border border-slate-700/50 p-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-xl flex-shrink-0">
                {TYPE_ICONS[source.type]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white">{source.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[source.status]}`}>
                    {source.status === "active" ? "Aktif" : source.status === "paused" ? "Duraklatıldı" : "Hata"}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">
                    {TYPE_LABELS[source.type]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{source.url}</p>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                  <span>⏱ {source.interval} dk&apos;da bir</span>
                  <span>🕐 {source.lastRun}</span>
                  <span>📝 {source.articlesFound} makale</span>
                  <span>🤖 {source.aiProvider} → {source.aiTask}</span>
                  <span>📂 {source.targetCategory}</span>
                  {source.autoPublish && <span className="text-emerald-400">✓ Otomatik yayın</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => runNow(source.id)} disabled={running === source.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-blue-500/20 hover:text-blue-400 text-slate-300 text-xs font-medium transition-colors disabled:opacity-50">
                  {running === source.id ? (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {running === source.id ? "Çalışıyor" : "Çalıştır"}
                </button>
                <button onClick={() => toggleStatus(source.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    source.status === "active"
                      ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  }`}>
                  {source.status === "active" ? "Duraklat" : "Başlat"}
                </button>
                <button onClick={() => openEdit(source)}
                  className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => deleteSource(source.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-4xl mb-3">📡</p>
            <p>Bu türde kaynak bulunamadı</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-lg shadow-2xl my-auto">
            <h3 className="text-lg font-bold text-white mb-5">
              {modal === "add" ? "Yeni Kaynak Ekle" : `Düzenle: ${(modal as ScraperSource).name}`}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Kaynak Adı</label>
                  <input value={form.name ?? ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="örn. TechCrunch" className="w-full bg-slate-700 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">URL</label>
                  <input value={form.url ?? ""} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                    placeholder="https://..." className="w-full bg-slate-700 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Tür</label>
                  <select value={form.type ?? "news_site"} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as SourceType }))}
                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                    {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Kontrol Aralığı (dk)</label>
                  <input type="number" value={form.interval ?? 60} onChange={(e) => setForm((p) => ({ ...p, interval: Number(e.target.value) }))}
                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">AI Sağlayıcı</label>
                  <select value={form.aiProvider ?? "Claude"} onChange={(e) => setForm((p) => ({ ...p, aiProvider: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                    {AI_PROVIDERS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">AI Görevi</label>
                  <select value={form.aiTask ?? "rewrite"} onChange={(e) => setForm((p) => ({ ...p, aiTask: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                    <option value="rewrite">Yeniden Yaz</option>
                    <option value="summary">Özetle</option>
                    <option value="seo">SEO Optimize Et</option>
                    <option value="categorize">Kategorize Et</option>
                    <option value="video_script">Video Senaryosu</option>
                    <option value="social_caption">Sosyal Medya Metni</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Hedef Kategori</label>
                  <select value={form.targetCategory ?? "Genel"} onChange={(e) => setForm((p) => ({ ...p, targetCategory: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${form.autoPublish ? "bg-amber-500 border-amber-500" : "border-slate-500"}`}
                      onClick={() => setForm((p) => ({ ...p, autoPublish: !p.autoPublish }))}>
                      {form.autoPublish && <svg className="w-2.5 h-2.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm text-slate-300">AI işledikten sonra otomatik yayımla</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:text-white text-sm font-medium transition-colors">İptal</button>
              <button onClick={saveForm} className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-semibold transition-colors">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
