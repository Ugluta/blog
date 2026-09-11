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
  PUBLISHED: "text-green-600",
  DRAFT: "text-[#666666]",
  REVIEW: "text-yellow-600",
  ARCHIVED: "text-[#666666]",
  published: "text-green-600",
  draft: "text-yellow-600",
  rejected: "text-red-600",
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
          iconBg: "bg-blue-500/20 text-blue-600",
        },
        {
          label: "İçerik Havuzu",
          value: stats.contentItems.total,
          sub: `${stats.contentItems.pending} onay bekliyor`,
          icon: "📥",
          href: "/uygulama/icerikler",
          color: "from-[#EBF2FA] to-[#F8F6F1] border-[#3A6EA8]/30",
          iconBg: "bg-[#EBF2FA] text-[#3A6EA8]",
          alert: stats.contentItems.pending > 0,
        },
        {
          label: "Kategoriler",
          value: stats.categories.total,
          sub: "Aktif kategori",
          icon: "🗂️",
          href: "/uygulama/kategoriler",
          color: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
          iconBg: "bg-purple-500/20 text-purple-600",
        },
        {
          label: "Scraper Kaynağı",
          value: stats.sources.total,
          sub: `${stats.sources.active} aktif`,
          icon: "🤖",
          href: "/uygulama/scraper",
          color: "from-green-500/20 to-green-600/5 border-green-500/30",
          iconBg: "bg-green-500/20 text-green-600",
        },
      ]
    : [];

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Dashboard</h1>
          <p className="text-sm text-[#666666] mt-0.5">İçerik yönetim sisteminize hoş geldiniz</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/uygulama/icerikler"
            className="px-4 py-2 rounded-xl border border-[#3A6EA8]/40 text-[#3A6EA8] hover:bg-[#EBF2FA] text-sm font-medium transition-colors"
          >
            İçerik Havuzu
          </Link>
          <Link
            href="/uygulama/yazilar/yeni"
            className="px-5 py-2 rounded-xl bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm transition-colors"
          >
            + Yeni Yazı
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E7E2D8] p-5 animate-pulse h-28" />
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
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#3A6EA8] animate-pulse" />
              )}
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center text-lg mb-3`}>
                {card.icon}
              </div>
              <div className="text-3xl font-black text-[#111111]">{card.value}</div>
              <div className="text-sm text-[#444444] font-medium mt-0.5">{card.label}</div>
              <div className="text-xs text-[#666666] mt-0.5">{card.sub}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#666666] mb-3">Hızlı Eylemler</h2>
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
              className="bg-white hover:bg-[#EBF2FA] border border-[#E7E2D8] hover:border-[#B5CDE8] rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-colors group"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs text-[#666666] group-hover:text-[#111111] font-medium transition-colors">
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
          <div className="bg-white rounded-2xl border border-[#E7E2D8] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E7E2D8]">
              <h3 className="text-sm font-bold text-[#111111]">Son Yazılar</h3>
              <Link href="/uygulama/yazilar" className="text-xs text-[#3A6EA8] hover:text-[#2D5A8E]">
                Tümü →
              </Link>
            </div>
            {stats.recentPosts.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-[#666666] text-sm">Henüz yazı yok</p>
                <Link
                  href="/uygulama/yazilar/yeni"
                  className="mt-2 inline-block text-xs text-[#3A6EA8] hover:text-[#2D5A8E]"
                >
                  İlk yazıyı oluştur →
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-[#E7E2D8]">
                {stats.recentPosts.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/uygulama/yazilar/${p.id}`}
                      className="flex items-start gap-3 px-5 py-3 hover:bg-[#EBF2FA] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#111111] font-medium truncate">{p.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-medium ${STATUS_COLOR[p.status]}`}>
                            {STATUS_LABEL[p.status]}
                          </span>
                          {p.category && (
                            <span className="text-xs text-[#666666]">• {p.category.name}</span>
                          )}
                          <span className="text-xs text-[#666666]">{timeAgo(p.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Content Items */}
          <div className="bg-white rounded-2xl border border-[#E7E2D8] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E7E2D8]">
              <h3 className="text-sm font-bold text-[#111111]">İçerik Havuzu</h3>
              <Link href="/uygulama/icerikler" className="text-xs text-[#3A6EA8] hover:text-[#2D5A8E]">
                Tümü →
              </Link>
            </div>
            {stats.recentContentItems.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-[#666666] text-sm">Henüz içerik yok</p>
                <Link
                  href="/uygulama/scraper"
                  className="mt-2 inline-block text-xs text-[#3A6EA8] hover:text-[#2D5A8E]"
                >
                  Scraper ekle →
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-[#E7E2D8]">
                {stats.recentContentItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/uygulama/icerikler/${item.id}`}
                      className="flex items-start gap-3 px-5 py-3 hover:bg-[#EBF2FA] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#111111] font-medium truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-medium ${STATUS_COLOR[item.status]}`}>
                            {STATUS_LABEL[item.status]}
                          </span>
                          {item.category && (
                            <span className="text-xs text-[#666666]">• {item.category.name}</span>
                          )}
                          <span className="text-xs text-[#666666]">{timeAgo(item.createdAt)}</span>
                        </div>
                        {item.sourceUrl && (
                          <p className="text-[10px] text-[#666666] truncate mt-0.5">
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
        <div className="bg-[#EBF2FA] border border-[#3A6EA8]/30 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[#3A6EA8] font-bold text-sm">
              ⏳ {stats.contentItems.pending} içerik onay bekliyor
            </p>
            <p className="text-[#666666] text-xs mt-0.5">
              Scraper&apos;dan gelen içerikleri inceleyin, onaylayın veya yazıya dönüştürün.
            </p>
          </div>
          <Link
            href="/uygulama/icerikler"
            className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm transition-colors"
          >
            İncele
          </Link>
        </div>
      )}
    </div>
  );
}
