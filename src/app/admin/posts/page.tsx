"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Post = {
  id: string; title: string; slug: string; status: string;
  publishedAt?: string | null; createdAt: string; viewCount: number;
  author: { id: string; name?: string | null; email: string };
  category?: { name: string } | null;
  _count?: { comments: number };
};

const STATUS_OPTS = ["", "PUBLISHED", "DRAFT", "REVIEW"];
const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Yayında", DRAFT: "Taslak", REVIEW: "İnceleme",
};
const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "bg-green-500/20 text-green-400",
  DRAFT: "bg-slate-600/40 text-slate-400",
  REVIEW: "bg-amber-500/20 text-amber-400",
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("search", search);
    if (statusFilter) p.set("status", statusFilter);
    const res = await fetch(`/api/admin/posts?${p}`);
    const d = await res.json();
    setPosts(d.posts ?? []);
    setTotal(d.total ?? 0);
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Tüm Yazılar</h1>
          <p className="text-sm text-slate-400 mt-0.5">{total} yazı</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Başlık ara…"
            className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500">
          <option value="">Tüm Durumlar</option>
          {STATUS_OPTS.filter(Boolean).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-xl bg-slate-800/40 animate-pulse" />)}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-slate-400">Yazı bulunamadı</p>
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Başlık</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Yazar</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Durum</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Görüntülenme</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-sm font-medium text-white line-clamp-1">{post.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                      {post.category && ` · ${post.category.name}`}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-slate-400">{post.author.name ?? post.author.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[post.status] ?? STATUS_COLORS.DRAFT}`}>
                      {STATUS_LABELS[post.status] ?? post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className="text-xs text-slate-500">{post.viewCount.toLocaleString("tr-TR")}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/haber/${post.slug}`} target="_blank"
                      className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors">↗</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-40 transition-colors">← Önceki</button>
          <span className="text-xs text-slate-500">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-40 transition-colors">Sonraki →</button>
        </div>
      )}
    </div>
  );
}
