"use client";

import { useState, useEffect } from "react";

interface Section {
  id: string;
  label: string;
  description: string;
  icon: string;
  active: boolean;
  order: number;
}

const defaultSections: Section[] = [
  { id: "hero", label: "Hero / Öne Çıkan İçerik", description: "Ana öne çıkan + yan içerikler (2/3 + 1/3)", icon: "🎯", active: true, order: 0 },
  { id: "stats", label: "İstatistik Sayaçlar", description: "Makale, okuyucu, kategori, deneyim", icon: "📊", active: true, order: 1 },
  { id: "ad_top", label: "Üst Reklam Bandı", description: "728×90 leaderboard reklam alanı", icon: "📣", active: false, order: 2 },
  { id: "editor_pick", label: "Editörün Seçimi", description: "2×2 resimli öne çıkan içerik kartları", icon: "⭐", active: true, order: 3 },
  { id: "news", label: "İçerikler", description: "Kategori bazlı içerik satırları", icon: "📰", active: true, order: 4 },
  { id: "articles_grid", label: "Makaleler Gridi", description: "4 sütun kare görsellerle makaleler", icon: "🔲", active: true, order: 5 },
  { id: "blog", label: "Blog Yazıları", description: "En son blog gönderileri ızgarası", icon: "✍️", active: true, order: 6 },
  { id: "gallery", label: "Galeri Şeridi", description: "Yatay kaydırmalı galeri albümleri", icon: "🖼️", active: true, order: 7 },
  { id: "ad_mid", label: "Orta Reklam Bandı", description: "İçerik arası reklam alanı", icon: "📣", active: false, order: 8 },
  { id: "services", label: "Hizmetler / Ne Yapıyoruz", description: "Koyu arka plan, başlık + 2×2 hizmet grid", icon: "⚙️", active: true, order: 9 },
  { id: "faq", label: "SSS / Özellikler", description: "4 sorulu accordion soru-cevap bloku", icon: "❓", active: true, order: 10 },
  { id: "pricing", label: "Fiyatlandırma", description: "3 sütun fiyat kartları", icon: "💳", active: false, order: 11 },
  { id: "trending", label: "Popüler / Trending", description: "Son yazılar, en çok okunan, öne çıkanlar", icon: "🔥", active: true, order: 12 },
  { id: "contact_cta", label: "İletişim / Teklif Al", description: "Sol bilgi + sağ form iletişim bloku", icon: "📬", active: false, order: 13 },
  { id: "newsletter", label: "Bülten Aboneliği", description: "E-posta bülteni kayıt formu", icon: "✉️", active: true, order: 14 },
];

const COLUMN_OPTIONS = [
  { value: "1", label: "Tek Sütun" },
  { value: "2", label: "2 Sütun" },
  { value: "3", label: "3 Sütun" },
  { value: "4", label: "4 Sütun" },
];

const GRID_SECTIONS: Record<string, string> = {
  news: "4",
  blog: "4",
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState<Record<string, string>>(GRID_SECTIONS);

  // Load settings on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings?key=homepage_sections");
        if (!res.ok) return;
        const data = (await res.json()) as Record<string, string>;
        const raw = data["homepage_sections"];
        if (!raw) return;
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setSections((prev) =>
          prev.map((s) => ({
            ...s,
            active: s.id in parsed ? parsed[s.id] : s.active,
          }))
        );
      } catch {
        // keep defaults on error
      }
    };
    load();
  }, []);

  const ordered = [...sections].sort((a, b) => a.order - b.order);

  const toggle = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };
  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const from = sections.find((s) => s.id === dragId);
    const to = sections.find((s) => s.id === targetId);
    if (!from || !to) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === dragId) return { ...s, order: to.order };
        if (s.id === targetId) return { ...s, order: from.order };
        return s;
      })
    );
    setDragId(null);
    setDragOverId(null);
  };

  const moveUp = (section: Section) => {
    const idx = ordered.findIndex((s) => s.id === section.id);
    if (idx === 0) return;
    const prev = ordered[idx - 1];
    setSections((all) =>
      all.map((s) => {
        if (s.id === section.id) return { ...s, order: prev.order };
        if (s.id === prev.id) return { ...s, order: section.order };
        return s;
      })
    );
  };

  const moveDown = (section: Section) => {
    const idx = ordered.findIndex((s) => s.id === section.id);
    if (idx === ordered.length - 1) return;
    const next = ordered[idx + 1];
    setSections((all) =>
      all.map((s) => {
        if (s.id === section.id) return { ...s, order: next.order };
        if (s.id === next.id) return { ...s, order: section.order };
        return s;
      })
    );
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    setSaveError("");
    try {
      // Build map of id → active boolean
      const sectionsMap: Record<string, boolean> = {};
      for (const s of sections) {
        sectionsMap[s.id] = s.active;
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homepage_sections: JSON.stringify(sectionsMap),
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Kayıt başarısız");
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Bir hata oluştu");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  const activeCount = sections.filter((s) => s.active).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ana Sayfa Bölümleri</h1>
          <p className="text-slate-400 text-sm mt-1">
            Sürükle-bırak ile sıralayın, göster/gizle ile kontrol edin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            {activeCount} / {sections.length} aktif
          </span>
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 ${
              saveStatus === "saved"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : saveStatus === "error"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-amber-500 text-slate-900 hover:bg-amber-400"
            }`}
          >
            {saveStatus === "saving"
              ? "Kaydediliyor..."
              : saveStatus === "saved"
              ? "✓ Kaydedildi"
              : saveStatus === "error"
              ? "Hata"
              : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Error message */}
      {saveStatus === "error" && saveError && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-sm text-red-300">{saveError}</p>
        </div>
      )}

      {/* Tip */}
      <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <span className="text-blue-400 text-lg flex-shrink-0">💡</span>
        <p className="text-sm text-blue-300">
          Bölümleri sürükleyerek yeniden sıralayabilir, yanındaki oklar ile tek adım hareket ettirebilirsiniz.
          Aktif olmayan bölümler ana sayfada gösterilmez.
        </p>
      </div>

      {/* Sections List */}
      <div className="space-y-2">
        {ordered.map((section, idx) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(section.id)}
            onDragOver={(e) => handleDragOver(e, section.id)}
            onDrop={() => handleDrop(section.id)}
            className={`group flex items-center gap-4 px-4 py-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
              dragOverId === section.id
                ? "border-amber-500/50 bg-amber-500/5"
                : section.active
                ? "bg-slate-800 border-slate-700/50 hover:border-slate-600"
                : "bg-slate-800/40 border-slate-700/30 opacity-60 hover:opacity-80"
            }`}
          >
            {/* Drag handle */}
            <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>

            {/* Order badge */}
            <div className="w-7 h-7 rounded-lg bg-slate-700 text-slate-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </div>

            {/* Icon */}
            <span className="text-xl flex-shrink-0">{section.icon}</span>

            {/* Label + description */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200">{section.label}</p>
              <p className="text-xs text-slate-500">{section.description}</p>
            </div>

            {/* Column selector (only for grid sections) */}
            {gridCols[section.id] !== undefined && section.active && (
              <select
                value={gridCols[section.id]}
                onChange={(e) =>
                  setGridCols((prev) => ({ ...prev, [section.id]: e.target.value }))
                }
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 flex-shrink-0"
              >
                {COLUMN_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}

            {/* Move up/down */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => moveUp(section)}
                disabled={idx === 0}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 disabled:opacity-20 hover:bg-slate-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => moveDown(section)}
                disabled={idx === ordered.length - 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 disabled:opacity-20 hover:bg-slate-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggle(section.id)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                section.active ? "bg-amber-500" : "bg-slate-600"
              }`}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                style={{
                  transform: section.active ? "translateX(22px)" : "translateX(2px)",
                }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
