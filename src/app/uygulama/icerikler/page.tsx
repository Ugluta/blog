"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

interface ContentItem {
  id: string;
  title: string;
  content: string;
  sourceUrl: string | null;
  image: string | null;
  status: "draft" | "published" | "rejected";
  categoryId: string | null;
  sourceId: string | null;
  createdAt: string;
  category: Category | null;
}

interface ScraperSource {
  id: string;
  name: string;
}

const STATUS_MAP = {
  draft:     { label: "Taslak",   bg: "bg-slate-500/15 text-slate-400",   dot: "bg-slate-400" },
  published: { label: "Onaylandı", bg: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-400" },
  rejected:  { label: "Reddedildi", bg: "bg-red-500/15 text-red-400",      dot: "bg-red-400" },
};

export default function IceriklerPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("draft");
  const [catFilter, setCatFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<ScraperSource[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), limit: "20",
      ...(q ? { q } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(catFilter ? { categoryId: catFilter } : {}),
      ...(sourceFilter ? { sourceId: sourceFilter } : {}),
    });
    const res = await fetch(`/api/content-items?${params}`).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    }
    setLoading(false);
  }, [page, q, statusFilter, catFilter, sourceFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.categories ?? [])).catch(() => null);
    fetch("/api/scraper/sources").then((r) => r.json()).then((d) => setSources(d.sources ?? [])).catch(() => null);
  }, []);

  const action = async (url: string, method = "POST") => {
    const res = await fetch(url, { method }).catch(() => null);
    return res?.ok ?? false;
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id + "-approve");
    await action(`/api/content-items/${id}/approve`);
    await load();
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + "-reject");
    await action(`/api/content-items/${id}/reject`);
    await load();
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu içeriği silmek istediğinizden emin misiniz?")) return;
    setActionLoading(id + "-delete");
    await action(`/api/content-items/${id}`, "DELETE");
    await load();
    setActionLoading(null);
  };

  const handleConvert = async (id: string) => {
    setActionLoading(id + "-convert");
    const res = await fetch(`/api/content-items/${id}/convert`, { method: "POST" }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      router.push(`/uygulama/yazilar/${data.post.id}`);
    }
    setActionLoading(null);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () =>
    setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i.id)));

  const bulkAction = async (type: "approve" | "reject" | "delete") => {
    if (type === "delete" && !confirm(`${selected.size} içerik silinsin mi?`)) return;
    setActionLoading("bulk");
    const ids = [...selected];
    await Promise.all(
      ids.map((id) =>
        type === "delete"
          ? action(`/api/content-items/${id}`, "DELETE")
          : action(`/api/content-items/${id}/${type}`)
      )
    );
    setSelected(new Set());
    await load();
    setActionLoading(null);
  };

  const totalPages = Math.ceil(total / 20);

  const statusCounts = { draft: 0, published: 0, rejected: 0 };
  items.forEach((i) => { statusCounts[i.status] = (statusCounts[i.status] ?? 0) + 1; });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">İçerik Havuzu</h1>
          <p className="text-slate-400 text-sm mt-0.5">Scraper tarafından toplanan içerikler — onaylayın veya yazıya dönüştürün</p>
        </div>
        <Link
          href="/uygulama/scraper"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm transition-colors"
        >
          <span>🤖</span> Scraper'ı Yönet
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-800/60 rounded-xl p-1 w-fit">
        {(["", "draft", "published", "rejected"] as const).map((s) => {
          const labels: Record<string, string> = { "": "Tümü", draft: "Taslak", published: "Onaylandı", rejected: "Reddedildi" };
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-amber-500 text-slate-900"
                  : "text-slate-400 hover:text-white border border-slate-700/50"
              }`}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text" value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Başlıkta ara..."
            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 focus:outline-none transition-colors"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="bg-slate-900/50 border border-slate-700/50 text-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
          className="bg-slate-900/50 border border-slate-700/50 text-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
        >
          <option value="">Tüm Kaynaklar</option>
          {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <span className="text-sm text-amber-400 font-medium">{selected.size} içerik seçildi</span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => bulkAction("approve")}
              disabled={actionLoading === "bulk"}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 rounded-lg text-xs transition-colors"
            >
              ✓ Onayla
            </button>
            <button
              onClick={() => bulkAction("reject")}
              disabled={actionLoading === "bulk"}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 rounded-lg text-xs transition-colors"
            >
              ✕ Reddet
            </button>
            <button
              onClick={() => bulkAction("delete")}
              disabled={actionLoading === "bulk"}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 rounded-lg text-xs transition-colors"
            >
              🗑 Sil
            </button>
          </div>
          <button onClick={() => setSelected(new Set())} className="p-1 text-slate-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      {/* List */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-3 border-b border-slate-700/50 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <input
            type="checkbox"
            checked={items.length > 0 && selected.size === items.length}
            onChange={toggleAll}
            className="rounded border-slate-600 bg-slate-700 accent-amber-500"
          />
          <span className="w-12">Görsel</span>
          <span>Başlık</span>
          <span className="hidden md:block">Kategori</span>
          <span>Durum</span>
          <span>İşlem</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-6 h-6 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📥</div>
            <p className="text-slate-400 font-medium mb-1">
              {statusFilter === "draft" ? "Bekleyen içerik yok" : "İçerik bulunamadı"}
            </p>
            <p className="text-slate-500 text-sm">
              {statusFilter === "draft"
                ? "Scraper yeni içerik topladığında burada görünecek"
                : "Filtreleri temizlemeyi deneyin"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {items.map((item) => {
              const st = STATUS_MAP[item.status] ?? STATUS_MAP.draft;
              const isConverting = actionLoading === item.id + "-convert";
              const isApproving = actionLoading === item.id + "-approve";
              const isRejecting = actionLoading === item.id + "-reject";

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-3 hover:bg-slate-700/30 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="rounded border-slate-600 bg-slate-700 accent-amber-500"
                  />

                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700/60 flex-shrink-0">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Title + meta */}
                  <div className="min-w-0">
                    <Link
                      href={`/uygulama/icerikler/${item.id}`}
                      className="text-sm font-medium text-white hover:text-amber-400 transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      {item.sourceUrl && (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-500 hover:text-amber-400 transition-colors truncate max-w-[200px]"
                        >
                          ↗ {new URL(item.sourceUrl).hostname}
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.content.slice(0, 120)}</p>
                  </div>

                  {/* Category */}
                  <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                    {item.category ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: (item.category.color ?? "#6366f1") + "20",
                          color: item.category.color ?? "#6366f1",
                        }}
                      >
                        {item.category.icon} {item.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </div>

                  {/* Status */}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${st.bg}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${st.dot}`} />
                    {st.label}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {item.status === "draft" && (
                      <>
                        <button
                          onClick={() => handleApprove(item.id)}
                          disabled={!!actionLoading}
                          title="Onayla"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors disabled:opacity-40"
                        >
                          {isApproving ? (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          disabled={!!actionLoading}
                          title="Reddet"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
                        >
                          {isRejecting ? (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                    {/* Convert to Post */}
                    <button
                      onClick={() => handleConvert(item.id)}
                      disabled={!!actionLoading}
                      title="Yazıya Dönüştür"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors disabled:opacity-40"
                    >
                      {isConverting ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      )}
                    </button>
                    <Link
                      href={`/uygulama/icerikler/${item.id}`}
                      title="Düzenle"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={!!actionLoading}
                      title="Sil"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
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
            <span className="text-xs text-slate-500">Sayfa {page} / {totalPages} • {total} içerik</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-40 transition-colors text-xs">
                ← Önceki
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-40 transition-colors text-xs">
                Sonraki →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
