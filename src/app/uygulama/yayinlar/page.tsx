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
  PENDING: "bg-yellow-500/20 text-yellow-600",
  PROCESSING: "bg-blue-500/20 text-blue-600",
  PUBLISHED: "bg-green-500/20 text-green-600",
  FAILED: "bg-red-500/20 text-red-600",
  CANCELED: "bg-[#E7E2D8] text-[#666666]",
  SCHEDULED: "bg-purple-500/20 text-purple-600",
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

type SocialAccount = { id: string; platform: string; displayName: string; username?: string | null };

export default function YayinlarPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [scheduleForm, setScheduleForm] = useState({ accountId: "", caption: "", hashtags: "", scheduledAt: "" });
  const [scheduling, setScheduling] = useState(false);

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

  useEffect(() => {
    fetch("/api/social/accounts")
      .then(r => r.json())
      .then(d => setAccounts(d.accounts ?? []))
      .catch(() => {});
  }, []);

  const schedulePost = async () => {
    if (!scheduleForm.accountId || !scheduleForm.caption || !scheduleForm.scheduledAt) return;
    setScheduling(true);
    try {
      const res = await fetch("/api/publisher/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialAccountId: scheduleForm.accountId,
          caption: scheduleForm.caption,
          hashtags: scheduleForm.hashtags.split(/[\s,]+/).filter(Boolean),
          scheduledAt: new Date(scheduleForm.scheduledAt).toISOString(),
          status: "SCHEDULED",
        }),
      });
      if (res.ok) { setShowSchedule(false); load(); setScheduleForm({ accountId: "", caption: "", hashtags: "", scheduledAt: "" }); }
    } finally { setScheduling(false); }
  };

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
          <h1 className="text-2xl font-bold text-[#111111]">Yayınlar</h1>
          <p className="text-sm text-[#666666] mt-1">Sosyal medya yayın geçmişi ve zamanlanmış paylaşımlar</p>
        </div>
        <button onClick={() => setShowSchedule(true)}
          className="px-4 py-2 text-sm font-semibold bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white rounded-lg transition-colors flex items-center gap-1.5">
          ⏰ Zamanla
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Toplam", value: stats.total, color: "text-[#111111]" },
          { label: "Yayınlandı", value: stats.published, color: "text-green-600" },
          { label: "Bekliyor", value: stats.pending, color: "text-yellow-600" },
          { label: "Başarısız", value: stats.failed, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E7E2D8] p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[#666666] mt-0.5">{s.label}</div>
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
                ? "bg-[#3A6EA8] text-white"
                : "bg-white text-[#666666] hover:text-[#111111] border border-[#E7E2D8]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-[#666666]">Yükleniyor…</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E2D8] border-dashed">
          <div className="text-4xl mb-3">📤</div>
          <p className="text-[#666666] font-medium">Henüz yayın yok</p>
          <p className="text-[#666666] text-sm mt-1">
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
                className="bg-white border border-[#E7E2D8] rounded-xl p-4 flex items-start gap-4"
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">{icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#111111] truncate">
                      {job.videoProject?.title ?? "Yayın"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[job.status] ?? "bg-[#EBF2FA] text-[#666666]"}`}>
                      {STATUS_LABEL[job.status] ?? job.status}
                    </span>
                  </div>
                  {job.socialAccount && (
                    <p className="text-xs text-[#666666] mt-0.5">
                      {job.socialAccount.displayName}
                      {job.socialAccount.username ? ` (@${job.socialAccount.username})` : ""}
                    </p>
                  )}
                  {job.caption && (
                    <p className="text-xs text-[#666666] mt-1 line-clamp-1">{job.caption}</p>
                  )}
                  {job.error && (
                    <p className="text-xs text-red-600 mt-1 line-clamp-2">⚠ {job.error}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#666666] flex-wrap">
                    {job.scheduledAt && <span>⏰ {formatTime(job.scheduledAt)}</span>}
                    {job.publishedAt && <span>✓ {formatTime(job.publishedAt)}</span>}
                    {!job.scheduledAt && !job.publishedAt && <span>Oluşturuldu: {formatTime(job.createdAt)}</span>}
                    {job.platformUrl && (
                      <a
                        href={job.platformUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3A6EA8] hover:text-[#2D5A8E]"
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
                      className="text-xs text-blue-600 hover:text-blue-700 border border-blue-500/30 px-2 py-1 rounded-lg"
                    >
                      ↺ Dene
                    </button>
                  )}
                  {(job.status === "PENDING" || job.status === "SCHEDULED") && (
                    <button
                      onClick={() => cancel(job.id)}
                      title="İptal Et"
                      className="text-xs text-[#666666] hover:text-red-600 border border-[#E7E2D8] px-2 py-1 rounded-lg"
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

      {/* Schedule modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowSchedule(false)} />
          <div className="relative bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E2D8]">
              <h3 className="font-bold text-[#111111]">Paylaşım Zamanla</h3>
              <button onClick={() => setShowSchedule(false)} className="text-[#666666] hover:text-[#111111] text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Hesap *</label>
                <select value={scheduleForm.accountId} onChange={e => setScheduleForm(p => ({ ...p, accountId: e.target.value }))}
                  className="w-full bg-white border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]">
                  <option value="">Hesap seçin</option>
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>
                      {PLATFORM_ICONS[a.platform] ?? "📤"} {a.displayName}{a.username ? ` (@${a.username})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Açıklama *</label>
                <textarea value={scheduleForm.caption} onChange={e => setScheduleForm(p => ({ ...p, caption: e.target.value }))}
                  rows={3} placeholder="Paylaşım metni…"
                  className="w-full bg-white border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Hashtagler</label>
                <input value={scheduleForm.hashtags} onChange={e => setScheduleForm(p => ({ ...p, hashtags: e.target.value }))}
                  placeholder="#teknoloji #haber …"
                  className="w-full bg-white border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Tarih & Saat *</label>
                <input type="datetime-local" value={scheduleForm.scheduledAt} onChange={e => setScheduleForm(p => ({ ...p, scheduledAt: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full bg-white border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]" />
              </div>
            </div>
            <div className="px-5 pb-5">
              <button onClick={schedulePost}
                disabled={scheduling || !scheduleForm.accountId || !scheduleForm.caption || !scheduleForm.scheduledAt}
                className="w-full py-2.5 rounded-lg bg-[#3A6EA8] hover:bg-[#2D5A8E] disabled:opacity-50 text-white font-bold text-sm transition-colors">
                {scheduling ? "Zamanlanıyor…" : "Zamanla"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
