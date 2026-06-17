"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type AnalyticsData = {
  posts: { total: number; published: number; draft: number };
  views: { total: number };
  topPosts: { id: string; title: string; slug: string; viewCount: number; publishedAt?: string | null }[];
  recentPosts: { id: string; title: string; slug: string; status: string; createdAt: string }[];
  publishStats: Record<string, number>;
  range: string;
};

const RANGES = [
  { key: "7d", label: "7 Gün" },
  { key: "30d", label: "30 Gün" },
  { key: "90d", label: "90 Gün" },
];

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: "text-green-400",
  FAILED: "text-red-400",
  PENDING: "text-amber-400",
  PROCESSING: "text-blue-400",
  QUEUED: "text-slate-400",
};

const STATUS_LABELS: Record<string, string> = {
  SUCCESS: "Başarılı", FAILED: "Başarısız", PENDING: "Bekliyor",
  PROCESSING: "İşleniyor", QUEUED: "Kuyrukta",
};

function StatCard({ label, value, sub, icon }: { label: string; value: number | string; sub?: string; icon: string }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-black text-white">{value.toLocaleString("tr-TR")}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function AnalitikPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?range=${range}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="p-4 lg:p-6 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Analitik</h1>
          <p className="text-sm text-slate-400 mt-0.5">İçerik ve yayın performansı</p>
        </div>
        <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1 border border-slate-700/50">
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                range === r.key ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-slate-800/40 animate-pulse" />)}
        </div>
      ) : data ? (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Toplam Yazı" value={data.posts.total} icon="📝" />
            <StatCard label="Yayında" value={data.posts.published} sub={`${data.posts.draft} taslak`} icon="✅" />
            <StatCard label="Toplam Görüntülenme" value={data.views.total} icon="👁️" />
            <StatCard
              label="Başarılı Paylaşım"
              value={data.publishStats.SUCCESS ?? 0}
              sub={data.publishStats.FAILED ? `${data.publishStats.FAILED} başarısız` : undefined}
              icon="📤"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Posts */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="font-bold text-white mb-4">En Çok Okunan</h2>
              {data.topPosts.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Henüz veri yok</p>
              ) : (
                <div className="space-y-3">
                  {data.topPosts.map((post, idx) => (
                    <div key={post.id} className="flex items-center gap-3">
                      <span className="text-slate-600 font-bold text-sm w-5 flex-shrink-0">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <Link href={`/haberler/${post.slug}`} target="_blank"
                          className="text-sm text-slate-200 hover:text-amber-400 transition-colors line-clamp-1">
                          {post.title}
                        </Link>
                      </div>
                      <span className="text-xs text-amber-400 font-semibold flex-shrink-0">
                        {post.viewCount.toLocaleString("tr-TR")} görüntülenme
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Posts */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="font-bold text-white mb-4">Son Yazılar</h2>
              {data.recentPosts.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Henüz yazı yok</p>
              ) : (
                <div className="space-y-3">
                  {data.recentPosts.map(post => (
                    <div key={post.id} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${post.status === "PUBLISHED" ? "bg-green-500" : "bg-slate-600"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <span className={`text-xs flex-shrink-0 ${post.status === "PUBLISHED" ? "text-green-400" : "text-slate-500"}`}>
                        {post.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Publish Stats */}
          {Object.keys(data.publishStats).length > 0 && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="font-bold text-white mb-4">Paylaşım Durumu</h2>
              <div className="flex flex-wrap gap-6">
                {Object.entries(data.publishStats).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <p className={`text-2xl font-black ${STATUS_COLORS[status] ?? "text-slate-400"}`}>{count}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{STATUS_LABELS[status] ?? status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
