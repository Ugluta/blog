"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type SearchResult = {
  id: string; type: string; title: string; slug: string;
  excerpt?: string | null; coverImage?: string | null;
  publishedAt?: string | null; createdAt: string;
  category?: { name: string; slug: string } | null;
};

const TABS = [
  { key: "all", label: "Tümü" },
  { key: "post", label: "Yazılar" },
  { key: "album", label: "Galeri" },
];

function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialType = searchParams.get("type") ?? "all";

  const [query, setQuery] = useState(initialQ);
  const [activeType, setActiveType] = useState(initialType);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string, type: string) => {
    if (!q || q.trim().length < 2) { setResults([]); setTotal(0); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${type}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQ) doSearch(initialQ, initialType);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/arama?q=${encodeURIComponent(query)}&type=${activeType}`);
    doSearch(query, activeType);
  };

  const handleTab = (type: string) => {
    setActiveType(type);
    router.replace(`/arama?q=${encodeURIComponent(query)}&type=${type}`);
    doSearch(query, type);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Search header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-6">Arama</h1>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ne aramak istersiniz?"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                autoFocus
              />
            </div>
            <button type="submit" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-colors whitespace-nowrap">
              Ara
            </button>
          </form>

          {/* Tabs */}
          {searched && (
            <div className="flex gap-1 mt-5">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleTab(tab.key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeType === tab.key
                      ? "bg-amber-500 text-slate-900"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex gap-4 bg-slate-800/40 rounded-2xl p-4 animate-pulse">
                <div className="w-20 h-20 bg-slate-700 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                  <div className="h-3 bg-slate-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : !searched ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-400">Aramak istediğiniz kelimeyi yazın</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-white font-semibold">Sonuç bulunamadı</p>
            <p className="text-slate-400 text-sm mt-1">
              &ldquo;{query}&rdquo; için eşleşme yok. Farklı anahtar kelimeler deneyin.
            </p>
          </div>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-5">
              <span className="text-white font-semibold">&ldquo;{query}&rdquo;</span> için{" "}
              <span className="text-amber-400 font-semibold">{total}</span> sonuç
            </p>
            <div className="space-y-3">
              {results.map(item => (
                <ResultCard key={`${item.type}-${item.id}`} item={item} query={query} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ResultCard({ item, query }: { item: SearchResult; query: string }) {
  const href = item.type === "album" ? `/galeri/${item.slug}` : `/${item.type === "post" ? "haberler" : item.type}/${item.slug}`;
  const typeLabel = item.type === "album" ? "Galeri" : item.category?.name ?? "Yazı";
  const date = item.publishedAt ?? item.createdAt;

  function highlight(text: string, q: string) {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-amber-500/20 text-amber-300 rounded">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  }

  return (
    <Link href={href} className="flex gap-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 hover:border-amber-500/30 transition-colors group">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0">
        {item.coverImage ? (
          <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-slate-600">
            {item.type === "album" ? "🖼️" : "📄"}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">{typeLabel}</span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-slate-500 text-xs">
            {new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-amber-400 transition-colors">
          {highlight(item.title, query)}
        </h3>
        {item.excerpt && (
          <p className="text-slate-400 text-xs mt-1 line-clamp-2">
            {highlight(item.excerpt.replace(/<[^>]+>/g, ""), query)}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function AramaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    }>
      <SearchPage />
    </Suspense>
  );
}
