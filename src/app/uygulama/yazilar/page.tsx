"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  icon: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  featured: boolean;
  tags: string[];
  createdAt: string;
  viewCount: number;
  author: { name: string | null; image: string | null };
  category: Category | null;
}

const STATUS_LABELS: Record<Post["status"], { label: string; color: string; dot: string }> = {
  DRAFT:     { label: "Taslak",    color: "bg-slate-500/20 text-slate-400",  dot: "bg-slate-400" },
  REVIEW:    { label: "İnceleme",  color: "bg-amber-500/20 text-amber-400",  dot: "bg-amber-400" },
  PUBLISHED: { label: "Yayında",   color: "bg-emerald-500/20 text-emerald-400", dot: "bg-emerald-400" },
  ARCHIVED:  { label: "Arşiv",     color: "bg-slate-600/20 text-slate-500",  dot: "bg-slate-500" },
};

export default function YazilarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [catFilter, setCatFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
      ...(q ? { q } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(catFilter ? { categoryId: catFilter } : {}),
    });
    const res = await fetch(`/api/posts?${params}`).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setPosts(data.posts ?? []);
      setTotal(data.total ?? 0);
    }
    setLoading(false);
  }, [page, q, statusFilter, catFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.categories ?? [])).catch(() => null);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    await load();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...(posts.find((p) => p.id === id) ?? {}), status }),
    });
    await load();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size === posts.length ? new Set() : new Set(posts.map((p) => p.id)));
  };

  const bulkDelete = async () => {
    if (!confirm(`${selected.size} yazı silinsin mi?`)) return;
    setBulkLoading(true);
    await Promise.all([...selected].map((id) => fetch(`/api/posts/${id}`, { method: "DELETE" })));
    setSelected(new Set());
    await load();
    setBulkLoading(false);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Yazılar</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {total > 0 ? `Toplam ${total} yazı` : "Henüz yazı yok"}
          </p>
        </div>
        <Link
          href="/uygulama/yazilar/yeni"
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Yazı
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Başlık ara..."
            className="w-full bg-[#1E293B] border border-slate-700 text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-[#1E293B] border border-slate-700 text-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
        >
          <option value="">Tüm Durumlar</option>
          <option value="DRAFT">Taslak</option>
          <option value="REVIEW">İnceleme</option>
          <option value="PUBLISHED">Yayında</option>
          <option value="ARCHIVED">Arşiv</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="bg-[#1E293B] border border-slate-700 text-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <span className="text-sm text-amber-400 font-medium">{selected.size} yazı seçildi</span>
          <button
            onClick={bulkDelete}
            disabled={bulkLoading}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 rounded-lg text-sm transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {bulkLoading ? "Siliniyor..." : "Seçilenleri Sil"}
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3 border-b border-slate-700/50 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <input
            type="checkbox"
            checked={posts.length > 0 && selected.size === posts.length}
            onChange={toggleAll}
            className="rounded border-slate-600 bg-slate-700 accent-amber-500"
          />
          <span>Başlık</span>
          <span className="hidden md:block">Kategori</span>
          <span>Durum</span>
          <span className="hidden sm:block">Tarih</span>
          <span>İşlem</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-6 h-6 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-slate-400 font-medium mb-1">Yazı bulunamadı</p>
            <p className="text-slate-500 text-sm mb-4">
              {q || statusFilter || catFilter ? "Filtreleri temizlemeyi deneyin" : "İlk yazınızı oluşturun"}
            </p>
            {!q && !statusFilter && !catFilter && (
              <Link
                href="/uygulama/yazilar/yeni"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 rounded-xl text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yeni Yazı Oluştur
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {posts.map((post) => {
              const st = STATUS_LABELS[post.status];
              return (
                <div
                  key={post.id}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3 hover:bg-slate-700/20 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(post.id)}
                    onChange={() => toggleSelect(post.id)}
                    className="rounded border-slate-600 bg-slate-700 accent-amber-500"
                  />

                  {/* Title + meta */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {post.featured && (
                        <span title="Öne çıkan" className="text-amber-400 flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </span>
                      )}
                      <Link
                        href={`/uygulama/yazilar/${post.id}`}
                        className="text-sm font-medium text-white hover:text-amber-400 transition-colors truncate"
                      >
                        {post.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 font-mono truncate">/{post.slug}</span>
                      {post.tags.length > 0 && (
                        <div className="hidden lg:flex gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] bg-slate-700/60 text-slate-400 px-1.5 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                    {post.category ? (
                      <>
                        <span className="text-base">{post.category.icon ?? ""}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: (post.category.color ?? "#6366f1") + "20",
                            color: post.category.color ?? "#6366f1",
                          }}
                        >
                          {post.category.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    <select
                      value={post.status}
                      onChange={(e) => handleStatusChange(post.id, e.target.value)}
                      className={`text-xs px-2.5 py-1 rounded-full border-0 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 ${st.color}`}
                      style={{ backgroundColor: "transparent" }}
                    >
                      <option value="DRAFT">Taslak</option>
                      <option value="REVIEW">İnceleme</option>
                      <option value="PUBLISHED">Yayında</option>
                      <option value="ARCHIVED">Arşiv</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="hidden sm:block text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                    {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {post.status === "PUBLISHED" && (
                      <Link
                        href={`/${post.slug}`}
                        target="_blank"
                        title="Yazıyı görüntüle"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                      </Link>
                    )}
                    <Link
                      href={`/uygulama/yazilar/${post.id}`}
                      title="Düzenle"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      title="Sil"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
            <span className="text-xs text-slate-500">
              Sayfa {page} / {totalPages} • {total} sonuç
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-40 transition-colors text-xs"
              >
                ← Önceki
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-40 transition-colors text-xs"
              >
                Sonraki →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
