"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScraperSource = {
  id: string;
  name: string;
  url: string;
  type: string;
  status: string;
  interval: number;
  aiProvider: string;
  aiTask: string;
  autoPublish: boolean;
  categoryId: string | null;
  selectors: string | null;
  lastRunAt: string | null;
  articlesFound: number;
  errorMessage: string | null;
  createdAt: string;
};

type Category = { id: string; name: string; parentId: string | null };

const SOURCE_TYPES = [
  { value: "rss", label: "RSS Feed" },
  { value: "news_site", label: "Haber Sitesi" },
  { value: "blog", label: "Blog" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
];

const AI_PROVIDERS = ["Claude", "GPT-4", "Gemini", "Grok", "DeepSeek"];
const AI_TASKS = [
  { value: "rewrite", label: "Yeniden Yaz" },
  { value: "translate", label: "Türkçeye Çevir" },
  { value: "summarize", label: "Özetle" },
  { value: "none", label: "Ham İçerik" },
];

const INTERVAL_PRESETS = [
  { value: 15, label: "15 dk" },
  { value: 30, label: "30 dk" },
  { value: 60, label: "1 saat" },
  { value: 180, label: "3 saat" },
  { value: 360, label: "6 saat" },
  { value: 720, label: "12 saat" },
  { value: 1440, label: "1 gün" },
];

const STATUS_STYLE: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
};
const STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  paused: "Duraklatıldı",
  error: "Hata",
};

// ─── Default form ─────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  url: "",
  type: "rss",
  interval: 60,
  aiProvider: "Claude",
  aiTask: "rewrite",
  autoPublish: false,
  categoryId: "",
  selectors: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScraperPage() {
  const [sources, setSources] = useState<ScraperSource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // running
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<{ id: string; count?: number; error?: string } | null>(null);

  // ── fetch ──
  const loadSources = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/scraper/sources").catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setSources(data.sources ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSources();
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, [loadSources]);

  // ── helpers ──
  const openNew = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (s: ScraperSource) => {
    setEditId(s.id);
    setForm({
      name: s.name,
      url: s.url,
      type: s.type,
      interval: s.interval,
      aiProvider: s.aiProvider,
      aiTask: s.aiTask,
      autoPublish: s.autoPublish,
      categoryId: s.categoryId ?? "",
      selectors: s.selectors ?? "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
  };

  const saveForm = async () => {
    if (!form.name.trim() || !form.url.trim()) return;
    setSaving(true);
    const body = {
      ...form,
      categoryId: form.categoryId || null,
      selectors: form.selectors || null,
      interval: Number(form.interval),
    };
    if (editId) {
      await fetch(`/api/scraper/sources/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/scraper/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setSaving(false);
    closeForm();
    loadSources();
  };

  const toggleStatus = async (s: ScraperSource) => {
    const newStatus = s.status === "active" ? "paused" : "active";
    await fetch(`/api/scraper/sources/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSources((prev) => prev.map((x) => (x.id === s.id ? { ...x, status: newStatus } : x)));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/scraper/sources/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    setSources((prev) => prev.filter((x) => x.id !== deleteId));
  };

  const runNow = async (id: string) => {
    setRunningId(id);
    setRunResult(null);
    const res = await fetch(`/api/scraper/sources/${id}/run`, { method: "POST" }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setRunResult({ id, count: data.count });
    } else {
      setRunResult({ id, error: "Çalıştırılamadı" });
    }
    setRunningId(null);
    loadSources();
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const categoryName = (id: string | null) =>
    id ? (categories.find((c) => c.id === id)?.name ?? "—") : "—";

  // ── render ──
  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scraper Kaynakları</h1>
          <p className="text-sm text-gray-500 mt-1">
            Web siteleri, RSS feed&apos;leri ve sosyal medya kanallarından otomatik içerik toplayın.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <span>+</span> Yeni Kaynak
        </button>
      </div>

      {/* stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Toplam Kaynak", value: sources.length },
          { label: "Aktif", value: sources.filter((s) => s.status === "active").length },
          { label: "Toplam Makale", value: sources.reduce((a, s) => a + s.articlesFound, 0) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* source list */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Yükleniyor…</div>
      ) : sources.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-16">
          <div className="text-4xl mb-3">🕷️</div>
          <p className="text-gray-600 font-medium">Henüz kaynak eklenmemiş</p>
          <p className="text-gray-400 text-sm mt-1">
            İlk kaynağı ekleyerek otomatik içerik toplamaya başlayın.
          </p>
          <button
            onClick={openNew}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Kaynak Ekle
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
            >
              {/* type icon */}
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                {s.type === "rss" ? "📡" : s.type === "youtube" ? "▶️" : s.type === "twitter" ? "🐦" : "📰"}
              </div>

              {/* main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 truncate">{s.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[s.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {STATUS_LABEL[s.status] ?? s.status}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {SOURCE_TYPES.find((t) => t.value === s.type)?.label ?? s.type}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">{s.url}</div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 flex-wrap">
                  <span>⏱ {INTERVAL_PRESETS.find((p) => p.value === s.interval)?.label ?? `${s.interval} dk`}</span>
                  <span>🤖 {s.aiProvider} / {AI_TASKS.find((t) => t.value === s.aiTask)?.label}</span>
                  <span>📂 {categoryName(s.categoryId)}</span>
                  <span>📄 {s.articlesFound} makale</span>
                  <span>🕒 Son çalışma: {formatTime(s.lastRunAt)}</span>
                </div>
                {s.status === "error" && s.errorMessage && (
                  <div className="mt-1 text-xs text-red-500 truncate">⚠ {s.errorMessage}</div>
                )}
                {runResult?.id === s.id && (
                  <div
                    className={`mt-1 text-xs font-medium ${runResult.error ? "text-red-500" : "text-green-600"}`}
                  >
                    {runResult.error ? `Hata: ${runResult.error}` : `✓ ${runResult.count} yeni içerik eklendi`}
                  </div>
                )}
              </div>

              {/* actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => runNow(s.id)}
                  disabled={runningId === s.id}
                  title="Şimdi Çalıştır"
                  className="p-2 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-40 text-sm"
                >
                  {runningId === s.id ? "⏳" : "▶"}
                </button>
                <button
                  onClick={() => toggleStatus(s)}
                  title={s.status === "active" ? "Duraklat" : "Devam Et"}
                  className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 text-sm"
                >
                  {s.status === "active" ? "⏸" : "⏵"}
                </button>
                <button
                  onClick={() => openEdit(s)}
                  title="Düzenle"
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setDeleteId(s.id)}
                  title="Sil"
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editId ? "Kaynağı Düzenle" : "Yeni Kaynak Ekle"}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak Adı *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="ör. TechCrunch TR"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* url */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* type + interval */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak Tipi *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SOURCE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kontrol Sıklığı</label>
                  <select
                    value={form.interval}
                    onChange={(e) => setForm((f) => ({ ...f, interval: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {INTERVAL_PRESETS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AI provider + task */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AI Sağlayıcı</label>
                  <select
                    value={form.aiProvider}
                    onChange={(e) => setForm((f) => ({ ...f, aiProvider: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {AI_PROVIDERS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AI Görevi</label>
                  <select
                    value={form.aiTask}
                    onChange={(e) => setForm((f) => ({ ...f, aiTask: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {AI_TASKS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçilmedi</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.parentId ? "  └ " : ""}{c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CSS selectors (advanced, shown only for news_site/blog) */}
              {(form.type === "news_site" || form.type === "blog") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CSS Seçiciler{" "}
                    <span className="text-gray-400 font-normal">(isteğe bağlı, JSON)</span>
                  </label>
                  <textarea
                    value={form.selectors}
                    onChange={(e) => setForm((f) => ({ ...f, selectors: e.target.value }))}
                    rows={3}
                    placeholder={'{"title": "h1.post-title", "content": "div.post-body", "image": "img.cover"}'}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}

              {/* auto publish */}
              <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-3">
                <input
                  type="checkbox"
                  id="autoPublish"
                  checked={form.autoPublish}
                  onChange={(e) => setForm((f) => ({ ...f, autoPublish: e.target.checked }))}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <label htmlFor="autoPublish" className="text-sm text-gray-700 cursor-pointer">
                  <span className="font-medium">Otomatik yayınla</span>
                  <span className="text-gray-500 ml-1">— İçerikleri onay beklemeden doğrudan yayınla</span>
                </label>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={closeForm}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                İptal
              </button>
              <button
                onClick={saveForm}
                disabled={saving || !form.name.trim() || !form.url.trim()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Kaydediliyor…" : editId ? "Kaydet" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Kaynağı Sil?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Bu kaynak silinecek. Daha önce toplanmış içerikler korunur.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Siliniyor…" : "Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
