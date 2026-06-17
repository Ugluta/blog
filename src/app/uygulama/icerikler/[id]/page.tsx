"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/editor/RichEditor"), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-800/50 border border-slate-600 rounded-2xl h-80 flex items-center justify-center">
      <svg className="w-5 h-5 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  ),
});

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  parentId: string | null;
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

const AI_ACTIONS = [
  { id: "rewrite",   label: "Yeniden Yaz",    icon: "✍️",  desc: "AI ile yeniden kaleme al" },
  { id: "translate", label: "Türkçeye Çevir", icon: "🌍",  desc: "Türkçeye çevir" },
  { id: "summarize", label: "Özetle",         icon: "📋",  desc: "Kısa özet çıkar" },
  { id: "seo",       label: "SEO Optimize",   icon: "🔍",  desc: "SEO için optimize et" },
];

const AI_PROVIDERS = ["Claude", "GPT-4", "Gemini", "Grok", "DeepSeek"];

export default function ContentItemEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [item, setItem] = useState<ContentItem | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiProvider, setAiProvider] = useState("Claude");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/content-items/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([itemData, catData]) => {
      const it = itemData.item as ContentItem;
      setItem(it);
      setTitle(it?.title ?? "");
      setContent(it?.content ?? "");
      setCategoryId(it?.categoryId ?? "");
      setCategories(catData.categories ?? []);
    }).catch(() => null).finally(() => setLoading(false));
  }, [id]);

  const save = async (extra?: Partial<ContentItem>) => {
    setSaving(true);
    const res = await fetch(`/api/content-items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, categoryId: categoryId || null, ...extra }),
    }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setItem(data.item);
      setSaveMsg("Kaydedildi");
      setTimeout(() => setSaveMsg(""), 2000);
    }
    setSaving(false);
  };

  const runAi = async (taskId: string) => {
    setAiLoading(taskId);
    const res = await fetch("/api/ai/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: aiProvider,
        task: taskId,
        input: content || title,
        contentItemId: id,
      }),
    }).catch(() => null);

    if (res?.ok) {
      const data = await res.json();
      if (data.result) {
        setContent(data.result);
        setSaveMsg("AI işlemi tamamlandı");
        setTimeout(() => setSaveMsg(""), 3000);
      }
    }
    setAiLoading(null);
  };

  const approve = async () => {
    setActionLoading("approve");
    await save();
    const res = await fetch(`/api/content-items/${id}/approve`, { method: "POST" }).catch(() => null);
    if (res?.ok) { setItem((prev) => prev ? { ...prev, status: "published" } : prev); }
    setActionLoading(null);
  };

  const reject = async () => {
    setActionLoading("reject");
    const res = await fetch(`/api/content-items/${id}/reject`, { method: "POST" }).catch(() => null);
    if (res?.ok) { setItem((prev) => prev ? { ...prev, status: "rejected" } : prev); }
    setActionLoading(null);
  };

  const convertToPost = async () => {
    setActionLoading("convert");
    await save();
    const res = await fetch(`/api/content-items/${id}/convert`, { method: "POST" }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      router.push(`/uygulama/yazilar/${data.post.id}`);
    }
    setActionLoading(null);
  };

  // Build flat category list with depth
  const catOptions = (() => {
    const map = new Map<string, Category & { depth: number }>();
    categories.forEach((c) => map.set(c.id, { ...c, depth: 0 }));
    map.forEach((node) => {
      let pid = node.parentId;
      while (pid) { node.depth++; pid = map.get(pid)?.parentId ?? null; }
    });
    return [...map.values()].sort((a, b) => a.depth - b.depth || a.name.localeCompare(b.name, "tr"));
  })();

  const STATUS_BADGE: Record<string, string> = {
    draft:     "bg-slate-500/15 text-slate-400",
    published: "bg-emerald-500/15 text-emerald-400",
    rejected:  "bg-red-500/15 text-red-400",
  };
  const STATUS_LABEL: Record<string, string> = {
    draft: "Taslak", published: "Onaylandı", rejected: "Reddedildi",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <svg className="w-8 h-8 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400">İçerik bulunamadı.</p>
        <Link href="/uygulama/icerikler" className="text-amber-400 text-sm mt-2 inline-block hover:underline">← Geri dön</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/uygulama/icerikler" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>

          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[item.status] ?? ""}`}>
            {STATUS_LABEL[item.status] ?? item.status}
          </span>

          <h1 className="text-sm font-semibold text-white flex-1 truncate">{item.title}</h1>

          {saveMsg && <span className="text-xs text-emerald-400">{saveMsg}</span>}

          <div className="flex gap-2">
            <button
              onClick={() => save()}
              disabled={saving}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "..." : "Kaydet"}
            </button>

            {item.status === "draft" && (
              <>
                <button
                  onClick={reject}
                  disabled={!!actionLoading}
                  className="px-3 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {actionLoading === "reject" ? "..." : "Reddet"}
                </button>
                <button
                  onClick={approve}
                  disabled={!!actionLoading}
                  className="px-3 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {actionLoading === "approve" ? "..." : "✓ Onayla"}
                </button>
              </>
            )}
            <button
              onClick={convertToPost}
              disabled={!!actionLoading}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {actionLoading === "convert" ? "..." : "📝 Yazıya Dönüştür"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Source info */}
          {item.sourceUrl && (
            <div className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              <span className="text-slate-400">Kaynak:</span>
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="text-amber-400 hover:underline truncate flex-1">{item.sourceUrl}</a>
              <span className="text-slate-600 flex-shrink-0">
                {new Date(item.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white text-xl font-bold placeholder-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* AI Actions */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">🤖 AI İşlemleri</span>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
              >
                {AI_PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AI_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => runAi(action.id)}
                  disabled={!!aiLoading}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                    aiLoading === action.id
                      ? "border-amber-500/50 bg-amber-500/10"
                      : "border-slate-700 hover:border-amber-500/40 hover:bg-slate-700/40"
                  } disabled:opacity-50`}
                >
                  <span className="text-xl">
                    {aiLoading === action.id ? (
                      <svg className="w-5 h-5 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : action.icon}
                  </span>
                  <span className="text-xs font-medium text-slate-300">{action.label}</span>
                  <span className="text-[10px] text-slate-500">{action.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rich Editor */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">İçerik</label>
            <RichEditor
              key={item.id}
              content={content}
              onChange={setContent}
              placeholder="İçeriği düzenleyin..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-4">
          {/* Cover Image */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Görsel</label>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt="" className="w-full h-32 object-cover rounded-xl"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="w-full h-20 bg-slate-700/40 rounded-xl flex items-center justify-center text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="">— Seçin —</option>
              {catOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {"　".repeat(c.depth)}{c.depth > 0 ? "└ " : ""}{c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-4 space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Hızlı İşlemler</label>

            <button
              onClick={convertToPost}
              disabled={!!actionLoading}
              className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <span>📝</span>
              <span>Yazıya Dönüştür</span>
            </button>

            {item.status === "draft" && (
              <>
                <button
                  onClick={approve}
                  disabled={!!actionLoading}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <span>✓</span>
                  <span>Onayla</span>
                </button>
                <button
                  onClick={reject}
                  disabled={!!actionLoading}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <span>✕</span>
                  <span>Reddet</span>
                </button>
              </>
            )}

            {item.status !== "draft" && (
              <button
                onClick={() => save({ status: "draft" })}
                disabled={saving}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-700/40 transition-colors text-sm disabled:opacity-50"
              >
                <span>↩</span>
                <span>Taslağa Al</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
