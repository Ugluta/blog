"use client";

import { useState } from "react";

type JobStatus = "PENDING" | "QUEUED" | "PROCESSING" | "SUCCESS" | "FAILED" | "SCHEDULED" | "CANCELED";
type Platform = "TWITTER" | "INSTAGRAM" | "FACEBOOK_PAGE" | "TIKTOK" | "YOUTUBE" | "LINKEDIN" | "PINTEREST" | "REDDIT" | "MEDIUM";

interface PublishJob {
  id: string;
  title: string;
  platform: Platform;
  account: string;
  status: JobStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  caption: string;
  hashtags: string[];
  platformUrl: string | null;
  error: string | null;
  retryCount: number;
  thumbnail: string;
  createdAt: string;
}

const PLATFORM_ICONS: Record<Platform, string> = {
  TWITTER: "𝕏", INSTAGRAM: "📷", FACEBOOK_PAGE: "f",
  TIKTOK: "♪", YOUTUBE: "▶", LINKEDIN: "in",
  PINTEREST: "P", REDDIT: "R", MEDIUM: "M",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  TWITTER: "#000000", INSTAGRAM: "#E1306C", FACEBOOK_PAGE: "#1877F2",
  TIKTOK: "#010101", YOUTUBE: "#FF0000", LINKEDIN: "#0A66C2",
  PINTEREST: "#BD081C", REDDIT: "#FF4500", MEDIUM: "#00AB6C",
};

const STATUS_STYLES: Record<JobStatus, { label: string; cls: string }> = {
  PENDING:    { label: "Bekliyor",     cls: "text-slate-400 bg-slate-400/10 border-slate-400/20" },
  QUEUED:     { label: "Kuyrukta",     cls: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  PROCESSING: { label: "İşleniyor",   cls: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  SUCCESS:    { label: "Yayımlandı",  cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  FAILED:     { label: "Başarısız",   cls: "text-red-400 bg-red-400/10 border-red-400/20" },
  SCHEDULED:  { label: "Zamanlandı", cls: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  CANCELED:   { label: "İptal",       cls: "text-slate-500 bg-slate-500/10 border-slate-500/20" },
};

const mockJobs: PublishJob[] = [
  {
    id: "1", title: "Türkiye'nin Dijital Dönüşüm Stratejisi 2030",
    platform: "TWITTER", account: "@kurumsal_tr", status: "SUCCESS",
    scheduledAt: null, publishedAt: "17 Haz 09:32", caption: "Türkiye dijital dönüşümde büyük adım atıyor...",
    hashtags: ["#teknoloji", "#yapayZeka", "#Türkiye"], platformUrl: "https://twitter.com/i/web/status/1",
    error: null, retryCount: 0, thumbnail: "https://picsum.photos/60/60?random=1", createdAt: "17 Haz 09:30",
  },
  {
    id: "2", title: "Merkez Bankası Faiz Kararı",
    platform: "INSTAGRAM", account: "@kurumsal.haber", status: "SUCCESS",
    scheduledAt: null, publishedAt: "17 Haz 10:15", caption: "Faiz kararı açıklandı! 🏦",
    hashtags: ["#ekonomi", "#TCMB", "#faiz"], platformUrl: null,
    error: null, retryCount: 0, thumbnail: "https://picsum.photos/60/60?random=2", createdAt: "17 Haz 10:10",
  },
  {
    id: "3", title: "Galatasaray Şampiyonlar Ligi",
    platform: "FACEBOOK_PAGE", account: "Kurumsal Haber Sayfası", status: "PROCESSING",
    scheduledAt: null, publishedAt: null, caption: "Şampiyonlar Ligi'nde büyük başarı!",
    hashtags: ["#Galatasaray", "#UCL", "#spor"], platformUrl: null,
    error: null, retryCount: 0, thumbnail: "https://picsum.photos/60/60?random=3", createdAt: "17 Haz 11:00",
  },
  {
    id: "4", title: "React 19 Yeni Özellikler",
    platform: "LINKEDIN", account: "Kurumsal Şirketi", status: "SCHEDULED",
    scheduledAt: "17 Haz 14:00", publishedAt: null, caption: "React 19 ile gelen yenilikler hakkında kapsamlı bir yazı",
    hashtags: ["#react", "#javascript", "#frontend"], platformUrl: null,
    error: null, retryCount: 0, thumbnail: "https://picsum.photos/60/60?random=4", createdAt: "17 Haz 11:30",
  },
  {
    id: "5", title: "Yapay Zeka ile Video Oluşturma",
    platform: "TIKTOK", account: "@kurumsal.ai", status: "FAILED",
    scheduledAt: null, publishedAt: null, caption: "AI ile video oluşturmak artık çok kolay!",
    hashtags: ["#yapayZeka", "#video", "#teknoloji"], platformUrl: null,
    error: "TikTok API rate limit aşıldı. 60 dk sonra tekrar deneyiniz.", retryCount: 2,
    thumbnail: "https://picsum.photos/60/60?random=5", createdAt: "17 Haz 11:45",
  },
  {
    id: "6", title: "İstanbul Hava Durumu Tahmini",
    platform: "TWITTER", account: "@kurumsal_tr", status: "PENDING",
    scheduledAt: null, publishedAt: null, caption: "Bu hafta İstanbul'da hava nasıl olacak?",
    hashtags: ["#havaDurumu", "#İstanbul"], platformUrl: null,
    error: null, retryCount: 0, thumbnail: "https://picsum.photos/60/60?random=6", createdAt: "17 Haz 12:00",
  },
  {
    id: "7", title: "Ekonomi Analizi: Mayıs Verileri",
    platform: "MEDIUM", account: "@kurumsal", status: "QUEUED",
    scheduledAt: null, publishedAt: null, caption: "Mayıs ayı ekonomi verilerinin kapsamlı analizi",
    hashtags: ["#ekonomi", "#analiz"], platformUrl: null,
    error: null, retryCount: 0, thumbnail: "https://picsum.photos/60/60?random=7", createdAt: "17 Haz 12:10",
  },
];

export default function PublisherPage() {
  const [jobs, setJobs] = useState<PublishJob[]>(mockJobs);
  const [statusFilter, setStatusFilter] = useState<JobStatus | "ALL">("ALL");
  const [platformFilter, setPlatformFilter] = useState<Platform | "ALL">("ALL");
  const [retrying, setRetrying] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = jobs.filter((j) => {
    if (statusFilter !== "ALL" && j.status !== statusFilter) return false;
    if (platformFilter !== "ALL" && j.platform !== platformFilter) return false;
    return true;
  });

  const stats = {
    total: jobs.length,
    success: jobs.filter((j) => j.status === "SUCCESS").length,
    failed: jobs.filter((j) => j.status === "FAILED").length,
    pending: jobs.filter((j) => ["PENDING", "QUEUED", "PROCESSING"].includes(j.status)).length,
    scheduled: jobs.filter((j) => j.status === "SCHEDULED").length,
  };

  const retry = async (id: string) => {
    setRetrying(id);
    await new Promise((r) => setTimeout(r, 1500));
    setJobs((p) => p.map((j) => j.id === id ? { ...j, status: "QUEUED" as JobStatus, error: null, retryCount: j.retryCount + 1 } : j));
    setRetrying(null);
  };

  const cancelJob = (id: string) => setJobs((p) => p.map((j) => j.id === id ? { ...j, status: "CANCELED" as JobStatus } : j));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const bulkCancel = () => {
    setJobs((p) => p.map((j) => selected.has(j.id) && ["PENDING", "SCHEDULED"].includes(j.status) ? { ...j, status: "CANCELED" as JobStatus } : j));
    setSelected(new Set());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Yayın Kuyruğu</h1>
          <p className="text-slate-400 text-sm mt-1">Tüm sosyal medya yayın işlerini izleyin</p>
        </div>
        {selected.size > 0 && (
          <button onClick={bulkCancel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium transition-colors">
            {selected.size} işi iptal et
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Toplam", value: stats.total, color: "text-slate-200" },
          { label: "Başarılı", value: stats.success, color: "text-emerald-400" },
          { label: "Başarısız", value: stats.failed, color: "text-red-400" },
          { label: "Bekleyen", value: stats.pending, color: "text-amber-400" },
          { label: "Zamanlanmış", value: stats.scheduled, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="bg-slate-800 rounded-xl p-3 border border-slate-700/50 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as JobStatus | "ALL")}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500">
          <option value="ALL">Tüm Durumlar</option>
          {Object.entries(STATUS_STYLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value as Platform | "ALL")}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500">
          <option value="ALL">Tüm Platformlar</option>
          {Object.entries(PLATFORM_ICONS).map(([k, v]) => <option key={k} value={k}>{v} {k}</option>)}
        </select>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left w-8">
                  <input type="checkbox" className="rounded accent-amber-500"
                    onChange={(e) => setSelected(e.target.checked ? new Set(filtered.map((j) => j.id)) : new Set())} />
                </th>
                <th className="px-4 py-3 text-left">İçerik</th>
                <th className="px-4 py-3 text-left">Platform</th>
                <th className="px-4 py-3 text-left">Durum</th>
                <th className="px-4 py-3 text-left">Zaman</th>
                <th className="px-4 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.map((job) => (
                <tr key={job.id} className={`hover:bg-slate-700/20 transition-colors ${selected.has(job.id) ? "bg-amber-500/5" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(job.id)} onChange={() => toggleSelect(job.id)}
                      className="rounded accent-amber-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={job.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 truncate max-w-[200px]">{job.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{job.caption}</p>
                        {job.hashtags.length > 0 && (
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {job.hashtags.slice(0, 2).map((h) => (
                              <span key={h} className="text-[10px] text-amber-400/70">{h}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: PLATFORM_COLORS[job.platform] + "33", color: PLATFORM_COLORS[job.platform] }}>
                        {PLATFORM_ICONS[job.platform]}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-300">{job.platform.replace("_", " ")}</p>
                        <p className="text-[10px] text-slate-500">{job.account}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLES[job.status].cls}`}>
                        {STATUS_STYLES[job.status].label}
                        {job.status === "PROCESSING" && (
                          <span className="inline-block ml-1 w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        )}
                      </span>
                      {job.error && (
                        <p className="text-[10px] text-red-400 mt-0.5 max-w-[180px] truncate" title={job.error}>
                          {job.error}
                        </p>
                      )}
                      {job.retryCount > 0 && (
                        <p className="text-[10px] text-slate-500">{job.retryCount}× denendi</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {job.publishedAt ? (
                      <div>
                        <p className="text-emerald-400">{job.publishedAt}</p>
                        <p className="text-slate-500">yayımlandı</p>
                      </div>
                    ) : job.scheduledAt ? (
                      <div>
                        <p className="text-purple-400">{job.scheduledAt}</p>
                        <p className="text-slate-500">zamanlandı</p>
                      </div>
                    ) : (
                      <p>{job.createdAt}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {job.status === "FAILED" && (
                        <button onClick={() => retry(job.id)} disabled={retrying === job.id}
                          className="px-2.5 py-1.5 rounded-lg text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50">
                          {retrying === job.id ? "..." : "Tekrar"}
                        </button>
                      )}
                      {job.platformUrl && (
                        <a href={job.platformUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {["PENDING", "SCHEDULED"].includes(job.status) && (
                        <button onClick={() => cancelJob(job.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-4xl mb-3">📭</p>
            <p>Bu filtreyle eşleşen iş bulunamadı</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_STYLES).map(([k, v]) => (
          <span key={k} className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${v.cls}`}>
            {v.label}
          </span>
        ))}
      </div>
    </div>
  );
}
