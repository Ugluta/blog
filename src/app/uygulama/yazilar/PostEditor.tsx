"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

const RichEditor = dynamic(() => import("@/components/editor/RichEditor"), {
  ssr: false,
  loading: () => (
    <div className="bg-white border border-[#E7E2D8] rounded-2xl h-[460px] flex items-center justify-center">
      <svg className="w-6 h-6 animate-spin text-[#3A6EA8]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  ),
});

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  icon: string | null;
  parentId: string | null;
}

interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  tags: string[];
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
}

const EMPTY: PostData = {
  title: "", slug: "", excerpt: "", content: "",
  coverImage: "", status: "DRAFT", categoryId: "",
  tags: [], featured: false, metaTitle: "", metaDescription: "",
};

interface Props {
  initial?: Partial<PostData> & { id?: string };
}

const STATUS_OPTS = [
  { value: "DRAFT",     label: "Taslak",    color: "text-[#666666]" },
  { value: "REVIEW",    label: "İnceleme",  color: "text-[#3A6EA8]" },
  { value: "PUBLISHED", label: "Yayınla",   color: "text-emerald-600" },
  { value: "ARCHIVED",  label: "Arşiv",     color: "text-[#666666]" },
];

export default function PostEditor({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PostData>({ ...EMPTY, ...initial });
  const [slugLocked, setSlugLocked] = useState(!!initial?.slug);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "settings">("content");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEdit = !!initial?.id;

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => null);
  }, []);

  const updateTitle = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: slugLocked ? f.slug : slugify(title),
      metaTitle: f.metaTitle || title,
    }));
  };

  const scheduleAutoSave = useCallback((data: PostData) => {
    if (!isEdit) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      const res = await fetch(`/api/posts/${initial!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => null);
      setSaveStatus(res?.ok ? "saved" : "error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 2500);
  }, [isEdit, initial]);

  const setField = <K extends keyof PostData>(key: K, value: PostData[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      scheduleAutoSave(next);
      return next;
    });
  };

  const handleSave = async (statusOverride?: PostData["status"]) => {
    if (!form.title.trim()) { setError("Başlık zorunludur."); return; }
    setSaving(true);
    setError("");

    const body = { ...form, status: statusOverride ?? form.status };

    const url = isEdit ? `/api/posts/${initial!.id}` : "/api/posts";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);

    if (!res?.ok) {
      const data = await res?.json().catch(() => null);
      setError(data?.error ?? "Kaydedilemedi.");
      setSaving(false);
      return;
    }

    const data = await res.json();
    if (!isEdit) {
      router.push(`/uygulama/yazilar/${data.post.id}`);
    } else {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
    setSaving(false);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) { setTagInput(""); return; }
    setField("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setField("tags", form.tags.filter((t) => t !== tag));

  // Build category tree for select
  const catOptions = (() => {
    const map = new Map<string, Category & { depth: number }>();
    categories.forEach((c) => map.set(c.id, { ...c, depth: 0 }));
    map.forEach((node) => {
      let pid = node.parentId;
      while (pid) {
        node.depth++;
        pid = map.get(pid)?.parentId ?? null;
      }
    });
    return [...map.values()].sort((a, b) => {
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.name.localeCompare(b.name, "tr");
    });
  })();

  const selectedCat = catOptions.find((c) => c.id === form.categoryId);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E7E2D8]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/uygulama/yazilar" className="p-2 rounded-lg text-[#666666] hover:text-[#111111] hover:bg-[#EBF2FA] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="text-sm font-semibold text-[#111111] flex-1 truncate">
            {isEdit ? form.title || "Yazıyı Düzenle" : "Yeni Yazı"}
          </h1>

          {/* Auto-save status */}
          {isEdit && saveStatus !== "idle" && (
            <span className={`text-xs ${saveStatus === "saving" ? "text-[#666666]" : saveStatus === "saved" ? "text-emerald-600" : "text-red-600"}`}>
              {saveStatus === "saving" ? "Kaydediliyor..." : saveStatus === "saved" ? "✓ Otomatik kaydedildi" : "Kaydedilemedi"}
            </span>
          )}

          <div className="flex items-center gap-2">
            {/* Preview link (only for saved drafts) */}
            {isEdit && form.slug && form.status !== "PUBLISHED" && (
              <a
                href={`/preview/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-[#EBF2FA] hover:bg-[#B5CDE8] text-[#444444] rounded-xl text-xs font-medium transition-colors"
              >
                👁 Önizle
              </a>
            )}
            {/* Status selector */}
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value as PostData["status"])}
              className="bg-white border border-[#E7E2D8] text-[#444444] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#3A6EA8] transition-colors"
            >
              {STATUS_OPTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="px-4 py-2 bg-[#EBF2FA] hover:bg-[#B5CDE8] text-[#3A6EA8] rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "..." : "Kaydet"}
            </button>
            <button
              onClick={() => handleSave("PUBLISHED")}
              disabled={saving}
              className="px-4 py-2 bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {form.status === "PUBLISHED" ? "Güncelle" : "Yayınla"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          {/* Title */}
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="Yazı başlığı..."
            className="w-full bg-transparent border-0 text-[#111111] text-3xl font-bold placeholder:text-[#666666] focus:outline-none"
          />

          {/* Slug */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#666666] font-mono">kurumsal.com/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { setField("slug", slugify(e.target.value)); setSlugLocked(true); }}
              className="flex-1 bg-transparent text-[#666666] font-mono focus:outline-none focus:text-[#3A6EA8] border-b border-transparent focus:border-[#3A6EA8]/50 transition-colors"
              placeholder="url-slug"
            />
            {slugLocked && (
              <button
                onClick={() => { setSlugLocked(false); setField("slug", slugify(form.title)); }}
                title="Otomatik slug'a dön"
                className="text-[#666666] hover:text-[#3A6EA8] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#E7E2D8] mt-2">
            {(["content", "seo", "settings"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-[#3A6EA8] text-[#3A6EA8]"
                    : "border-transparent text-[#666666] hover:text-[#111111]"
                }`}
              >
                {tab === "content" ? "İçerik" : tab === "seo" ? "SEO" : "Ayarlar"}
              </button>
            ))}
          </div>

          {activeTab === "content" && (
            <div className="space-y-4">
              {/* Excerpt */}
              <textarea
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
                placeholder="Kısa özet (liste görünümünde ve sosyal medyada kullanılır)..."
                rows={2}
                className="w-full bg-white border border-[#E7E2D8] text-[#444444] placeholder:text-[#666666] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3A6EA8] transition-colors resize-none"
              />

              {/* Rich Editor */}
              <RichEditor
                content={form.content}
                onChange={(html) => setField("content", html)}
                placeholder="Yazınızı buraya yazın..."
              />
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-4">
              <div className="bg-white border border-[#E7E2D8] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#111111] mb-3">Arama Motoru Optimizasyonu</h3>

                {/* Preview */}
                <div className="p-4 bg-[#F8F6F1] rounded-xl border border-[#E7E2D8]">
                  <div className="text-xs text-[#666666] mb-2">Google Önizlemesi</div>
                  <div className="text-blue-600 text-base hover:underline cursor-pointer truncate">
                    {form.metaTitle || form.title || "Sayfa başlığı"}
                  </div>
                  <div className="text-green-600 text-xs mt-0.5">
                    kurumsal.com/{form.slug || "url-slug"}
                  </div>
                  <div className="text-[#666666] text-sm mt-1 line-clamp-2">
                    {form.metaDescription || form.excerpt || "Meta açıklama burada görünür..."}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1.5">
                    SEO Başlığı
                    <span className={`ml-2 font-normal ${(form.metaTitle || form.title).length > 60 ? "text-red-600" : "text-[#666666]"}`}>
                      {(form.metaTitle || form.title).length}/60
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => setField("metaTitle", e.target.value)}
                    placeholder={form.title || "SEO başlığı"}
                    maxLength={80}
                    className="w-full bg-white border border-[#E7E2D8] text-[#111111] placeholder:text-[#666666] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1.5">
                    Meta Açıklama
                    <span className={`ml-2 font-normal ${form.metaDescription.length > 160 ? "text-red-600" : "text-[#666666]"}`}>
                      {form.metaDescription.length}/160
                    </span>
                  </label>
                  <textarea
                    value={form.metaDescription}
                    onChange={(e) => setField("metaDescription", e.target.value)}
                    placeholder="Arama sonuçlarında görünecek açıklama..."
                    rows={3}
                    maxLength={200}
                    className="w-full bg-white border border-[#E7E2D8] text-[#111111] placeholder:text-[#666666] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="bg-white border border-[#E7E2D8] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#111111] mb-3">Yazı Ayarları</h3>

                {/* Featured */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm text-[#111111]">Öne Çıkan Yazı</div>
                    <div className="text-xs text-[#666666]">Ana sayfada öne çıkarılır</div>
                  </div>
                  <div
                    onClick={() => setField("featured", !form.featured)}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${form.featured ? "bg-[#3A6EA8]" : "bg-[#E7E2D8]"}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : ""}`} />
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Cover Image */}
          <div className="bg-white rounded-2xl border border-[#E7E2D8] p-4">
            <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3">Kapak Görseli</label>
            {form.coverImage ? (
              <div className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.coverImage}
                  alt="Kapak"
                  className="w-full h-36 object-cover rounded-xl"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <button
                  onClick={() => setField("coverImage", "")}
                  className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-full h-28 bg-[#EBF2FA] rounded-xl flex items-center justify-center border-2 border-dashed border-[#E7E2D8]">
                <svg className="w-6 h-6 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => setField("coverImage", e.target.value)}
              placeholder="https://..."
              className="w-full mt-3 bg-white border border-[#E7E2D8] text-[#444444] placeholder:text-[#666666] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#3A6EA8] transition-colors"
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-[#E7E2D8] p-4">
            <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3">Kategori</label>
            {selectedCat && (
              <div className="flex items-center gap-2 mb-2 p-2 bg-[#EBF2FA] rounded-xl">
                <span className="text-base">{selectedCat.icon ?? ""}</span>
                <span className="text-sm text-[#111111] font-medium">{selectedCat.name}</span>
              </div>
            )}
            <select
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              className="w-full bg-white border border-[#E7E2D8] text-[#444444] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8] transition-colors"
            >
              <option value="">— Kategori seçin —</option>
              {catOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {"　".repeat(c.depth)}{c.depth > 0 ? "└ " : ""}{c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-[#E7E2D8] p-4">
            <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3">Etiketler</label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-[#EBF2FA] text-[#444444] text-xs px-2.5 py-1 rounded-full"
                >
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="text-[#666666] hover:text-red-600 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Etiket ekle..."
                className="flex-1 bg-white border border-[#E7E2D8] text-[#111111] placeholder:text-[#666666] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#3A6EA8] transition-colors"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-[#EBF2FA] hover:bg-[#B5CDE8] text-[#444444] rounded-xl text-xs transition-colors"
              >
                Ekle
              </button>
            </div>
          </div>

          {/* Status info */}
          <div className="bg-white rounded-2xl border border-[#E7E2D8] p-4 space-y-2">
            <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3">Durum</label>
            {STATUS_OPTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setField("status", s.value as PostData["status"])}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors text-sm ${
                  form.status === s.value
                    ? "border-[#3A6EA8]/50 bg-[#EBF2FA]"
                    : "border-transparent hover:bg-[#EBF2FA]"
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  s.value === "DRAFT" ? "bg-[#E7E2D8]" :
                  s.value === "REVIEW" ? "bg-[#3A6EA8]" :
                  s.value === "PUBLISHED" ? "bg-emerald-400" : "bg-[#E7E2D8]"
                }`} />
                <span className={form.status === s.value ? "text-[#111111] font-medium" : "text-[#666666]"}>
                  {s.label}
                </span>
                {form.status === s.value && (
                  <svg className="w-3.5 h-3.5 text-[#3A6EA8] ml-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
