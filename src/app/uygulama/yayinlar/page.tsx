"use client";

import { useState, useEffect, useCallback } from "react";

type Job = {
  id: string;
  status: string;
  platform?: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  caption: string | null;
  hashtags: string[];
  platformUrl: string | null;
  error: string | null;
  retryCount: number;
  createdAt: string;
  socialAccount?: { platform: string; displayName: string; username: string | null; avatarUrl: string | null } | null;
  videoProject?: { title: string } | null;
};

const PLATFORM_ICONS: Record<string, string> = {
  TIKTOK: "🎵",
  INSTAGRAM: "📷",
  YOUTUBE: "▶️",
  TWITTER: "🐦",
  FACEBOOK_PAGE: "📘",
  FACEBOOK_GROUP: "👥",
  LINKEDIN: "💼",
  PINTEREST: "📌",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  PROCESSING: "bg-blue-500/20 text-blue-400",
  PUBLISHED: "bg-green-500/20 text-green-400",
  FAILED: "bg-red-500/20 text-red-400",
  CANCELED: "bg-slate-600/30 text-slate-400",
  SCHEDULED: "bg-purple-500/20 text-purple-400",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Bekliyor",
  PROCESSING: "İşleniyor",
  PUBLISHED: "Yayınlandı",
  FAILED: "Başarısız",
  CANCELED: "İptal",
  SCHEDULED: "Zamanlandı",
};

const STATUS_FILTERS = [
  { value: "", label: "Tümü" },
  { value: "SCHEDULED", label: "Zamanlandı" },
  { value: "PENDING", label: "Bekliyor" },
  { value: "PUBLISHED", label: "Yayınlandı" },
  { value: "FAILED", label: "Başarısız" },
];

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function YayinlarPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/publisher/jobs?${params}`).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setJobs(data.jobs ?? []);
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const retry = async (id: string) => {
    await fetch(`/api/publisher/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PENDING" }),
    });
    load();
  };

  const cancel = async (id: string) => {
    await fetch(`/api/publisher/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELED" }),
    });
    load();
  };

  const stats = {
    total: jobs.length,
    published: jobs.filter((j) => j.status === "PUBLISHED").length,
    pending: jobs.filter((j) => j.status === "PENDING" || j.status === "SCHEDULED").length,
    failed: jobs.filter((j) => j.status === "FAILED").length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Yayınlar</h1>
          <p className="text-sm text-slate-400 mt-1">Sosyal medya yayın geçmişi ve zamanlanmış paylaşımlar</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Toplam", value: stats.total, color: "text-white" },
          { label: "Yayınlandı", value: stats.published, color: "text-green-400" },
          { label: "Bekliyor", value: stats.pending, color: "text-yellow-400" },
          { label: "Başarısız", value: stats.failed, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === f.value
                ? "bg-amber-500 text-slate-900"
                : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">Yükleniyor…</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/50 border-dashed">
          <div className="text-4xl mb-3">📤</div>
          <p className="text-slate-400 font-medium">Henüz yayın yok</p>
          <p className="text-slate-500 text-sm mt-1">
            Video oluşturup sosyal hesabınıza bağladıktan sonra burada görünür.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => {
            const icon = PLATFORM_ICONS[job.socialAccount?.platform ?? job.platform ?? ""] ?? "📤";
            return (
              <div
                key={job.id}
                className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 flex items-start gap-4"
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">{icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-100 truncate">
                      {job.videoProject?.title ?? "Yayın"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[job.status] ?? "bg-slate-700 text-slate-400"}`}>
                      {STATUS_LABEL[job.status] ?? job.status}
                    </span>
                  </div>
                  {job.socialAccount && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.socialAccount.displayName}
                      {job.socialAccount.username ? ` (@${job.socialAccount.username})` : ""}
                    </p>
                  )}
                  {job.caption && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{job.caption}</p>
                  )}
                  {job.error && (
                    <p className="text-xs text-red-400 mt-1 line-clamp-2">⚠ {job.error}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-600 flex-wrap">
                    {job.scheduledAt && <span>⏰ {formatTime(job.scheduledAt)}</span>}
                    {job.publishedAt && <span>✓ {formatTime(job.publishedAt)}</span>}
                    {!job.scheduledAt && !job.publishedAt && <span>Oluşturuldu: {formatTime(job.createdAt)}</span>}
                    {job.platformUrl && (
                      <a
                        href={job.platformUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300"
                      >
                        Göster →
                      </a>
                    )}
                  </div>
                </div>
                {/* actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {job.status === "FAILED" && (
                    <button
                      onClick={() => retry(job.id)}
                      title="Tekrar Dene"
                      className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 px-2 py-1 rounded-lg"
                    >
                      ↺ Dene
                    </button>
                  )}
                  {(job.status === "PENDING" || job.status === "SCHEDULED") && (
                    <button
                      onClick={() => cancel(job.id)}
                      title="İptal Et"
                      className="text-xs text-slate-500 hover:text-red-400 border border-slate-700/50 px-2 py-1 rounded-lg"
                    >
                      ✕ İptal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
