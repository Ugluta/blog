"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Stats = {
  posts: { total: number; published: number; draft: number };
  categories: { total: number };
  contentItems: { total: number; pending: number };
  sources: { total: number; active: number };
  recentPosts: {
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: string;
    category: { name: string } | null;
  }[];
  recentContentItems: {
    id: string;
    title: string;
    status: string;
    sourceUrl: string | null;
    createdAt: string;
    category: { name: string } | null;
  }[];
};

const STATUS_LABEL: Record<string, string> = {
  PUBLISHED: "Yayında",
  DRAFT: "Taslak",
  REVIEW: "İncelemede",
  ARCHIVED: "Arşiv",
  published: "Onaylandı",
  draft: "Bekliyor",
  rejected: "Reddedildi",
};

const STATUS_COLOR: Record<string, string> = {
  PUBLISHED: "text-green-400",
  DRAFT: "text-slate-400",
  REVIEW: "text-yellow-400",
  ARCHIVED: "text-slate-500",
  published: "text-green-400",
  draft: "text-yellow-400",
  rejected: "text-red-400",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

export default function AppDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        {
          label: "Toplam Yazı",
          value: stats.posts.total,
          sub: `${stats.posts.published} yayında`,
          icon: "📝",
          href: "/uygulama/yazilar",
          color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
          iconBg: "bg-blue-500/20 text-blue-400",
        },
        {
          label: "İçerik Havuzu",
          value: stats.contentItems.total,
          sub: `${stats.contentItems.pending} onay bekliyor`,
          icon: "📥",
          href: "/uygulama/icerikler",
          color: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
          iconBg: "bg-amber-500/20 text-amber-400",
          alert: stats.contentItems.pending > 0,
        },
        {
          label: "Kategoriler",
          value: stats.categories.total,
          sub: "Aktif kategori",
          icon: "🗂️",
          href: "/uygulama/kategoriler",
          color: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
          iconBg: "bg-purple-500/20 text-purple-400",
        },
        {
          label: "Scraper Kaynağı",
          value: stats.sources.total,
          sub: `${stats.sources.active} aktif`,
          icon: "🤖",
          href: "/uygulama/scraper",
          color: "from-green-500/20 to-green-600/5 border-green-500/30",
          iconBg: "bg-green-500/20 text-green-400",
        },
      ]
    : [];

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">İçerik yönetim sisteminize hoş geldiniz</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/uygulama/icerikler"
            className="px-4 py-2 rounded-xl border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-sm font-medium transition-colors"
          >
            İçerik Havuzu
          </Link>
          <Link
            href="/uygulama/yazilar/yeni"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors"
          >
            + Yeni Yazı
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className={`bg-gradient-to-br ${card.color} border rounded-2xl p-5 hover:scale-[1.02] transition-transform relative`}
            >
              {card.alert && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center text-lg mb-3`}>
                {card.icon}
              </div>
              <div className="text-3xl font-black text-white">{card.value}</div>
              <div className="text-sm text-slate-300 font-medium mt-0.5">{card.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{card.sub}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Hızlı Eylemler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: "✍️", label: "Yazı Yaz", href: "/uygulama/yazilar/yeni" },
            { icon: "📂", label: "Kategori Ekle", href: "/uygulama/kategoriler" },
            { icon: "🤖", label: "Scraper Ekle", href: "/uygulama/scraper" },
            { icon: "🌐", label: "Siteyi Gör", href: "/", target: "_blank" },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              target={a.target}
              className="bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-colors group"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs text-slate-400 group-hover:text-slate-200 font-medium transition-colors">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent content — two columns */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/50">
              <h3 className="text-sm font-bold text-slate-200">Son Yazılar</h3>
              <Link href="/uygulama/yazilar" className="text-xs text-amber-400 hover:text-amber-300">
                Tümü →
              </Link>
            </div>
            {stats.recentPosts.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-slate-500 text-sm">Henüz yazı yok</p>
                <Link
                  href="/uygulama/yazilar/yeni"
                  className="mt-2 inline-block text-xs text-amber-400 hover:text-amber-300"
                >
                  İlk yazıyı oluştur →
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-700/30">
                {stats.recentPosts.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/uygulama/yazilar/${p.id}`}
                      className="flex items-start gap-3 px-5 py-3 hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 font-medium truncate">{p.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-medium ${STATUS_COLOR[p.status]}`}>
                            {STATUS_LABEL[p.status]}
                          </span>
                          {p.category && (
                            <span className="text-xs text-slate-500">• {p.category.name}</span>
                          )}
                          <span className="text-xs text-slate-600">{timeAgo(p.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Content Items */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/50">
              <h3 className="text-sm font-bold text-slate-200">İçerik Havuzu</h3>
              <Link href="/uygulama/icerikler" className="text-xs text-amber-400 hover:text-amber-300">
                Tümü →
              </Link>
            </div>
            {stats.recentContentItems.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-slate-500 text-sm">Henüz içerik yok</p>
                <Link
                  href="/uygulama/scraper"
                  className="mt-2 inline-block text-xs text-amber-400 hover:text-amber-300"
                >
                  Scraper ekle →
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-700/30">
                {stats.recentContentItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/uygulama/icerikler/${item.id}`}
                      className="flex items-start gap-3 px-5 py-3 hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 font-medium truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-medium ${STATUS_COLOR[item.status]}`}>
                            {STATUS_LABEL[item.status]}
                          </span>
                          {item.category && (
                            <span className="text-xs text-slate-500">• {item.category.name}</span>
                          )}
                          <span className="text-xs text-slate-600">{timeAgo(item.createdAt)}</span>
                        </div>
                        {item.sourceUrl && (
                          <p className="text-[10px] text-slate-600 truncate mt-0.5">
                            {new URL(item.sourceUrl).hostname}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Pending items alert */}
      {!loading && stats && stats.contentItems.pending > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-amber-400 font-bold text-sm">
              ⏳ {stats.contentItems.pending} içerik onay bekliyor
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Scraper&apos;dan gelen içerikleri inceleyin, onaylayın veya yazıya dönüştürün.
            </p>
          </div>
          <Link
            href="/uygulama/icerikler"
            className="flex-shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors"
          >
            İncele
          </Link>
        </div>
      )}
    </div>
  );
}
