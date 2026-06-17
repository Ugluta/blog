"use client";

import { useState } from "react";

interface Section {
  id: string;
  label: string;
  description: string;
  icon: string;
  active: boolean;
  order: number;
}

const defaultSections: Section[] = [
  { id: "breaking_ticker", label: "Son Dakika Bandı", description: "Kayan son dakika haberleri", icon: "📡", active: true, order: 0 },
  { id: "hero_slider", label: "Hero Haber Bloğu", description: "Ana manşet + yan haberler (2/3 + 1/3)", icon: "🗞️", active: true, order: 1 },
  { id: "stats_counter", label: "İstatistik Sayaçlar", description: "Makale, okuyucu, kategori, deneyim", icon: "📊", active: true, order: 2 },
  { id: "ad_leaderboard", label: "Üst Reklam Bandı", description: "728×90 leaderboard reklam alanı", icon: "📣", active: true, order: 3 },
  { id: "category_teknoloji", label: "Teknoloji Haberleri", description: "Teknoloji kategorisi haber bloğu", icon: "💻", active: true, order: 4 },
  { id: "category_ekonomi", label: "Ekonomi Haberleri", description: "Ekonomi kategorisi haber bloğu", icon: "📈", active: true, order: 5 },
  { id: "ad_mid", label: "Orta Reklam Bandı", description: "İçerik arası reklam alanı", icon: "📣", active: false, order: 6 },
  { id: "category_dunya", label: "Dünya Haberleri", description: "Dünya kategorisi haber bloğu", icon: "🌍", active: true, order: 7 },
  { id: "category_spor", label: "Spor Haberleri", description: "Spor kategorisi haber bloğu", icon: "⚽", active: true, order: 8 },
  { id: "blog_section", label: "Blog Yazıları", description: "En son blog gönderileri ızgarası", icon: "✍️", active: true, order: 9 },
  { id: "products_services", label: "Ürün & Hizmetler", description: "Kurumsal ürün ve hizmet kartları", icon: "🏢", active: true, order: 10 },
  { id: "code_examples", label: "Kod Örnekleri", description: "Geliştiricilere yönelik kod snippetleri", icon: "💾", active: false, order: 11 },
  { id: "newsletter", label: "Bülten Aboneliği", description: "E-posta bülteni kayıt formu", icon: "✉️", active: true, order: 12 },
];

const COLUMN_OPTIONS = [
  { value: "1", label: "Tek Sütun" },
  { value: "2", label: "2 Sütun" },
  { value: "3", label: "3 Sütun" },
  { value: "4", label: "4 Sütun" },
];

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [saved, setSaved] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState<Record<string, string>>({
    category_teknoloji: "4",
    category_ekonomi: "4",
    category_dunya: "4",
    category_spor: "4",
    blog_section: "4",
    products_services: "3",
  });

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
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    const from = sections.find((s) => s.id === dragId);
    const to = sections.find((s) => s.id === targetId);
    if (!from || !to) { setDragId(null); setDragOverId(null); return; }
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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              saved
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500 text-slate-900 hover:bg-amber-400"
            }`}
          >
            {saved ? "✓ Kaydedildi" : "Kaydet"}
          </button>
        </div>
      </div>

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
            {/* Drag Handle */}
            <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>

            {/* Order Badge */}
            <div className="w-7 h-7 rounded-lg bg-slate-700 text-slate-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </div>

            {/* Icon */}
            <span className="text-xl flex-shrink-0">{section.icon}</span>

            {/* Label + Description */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200">{section.label}</p>
              <p className="text-xs text-slate-500">{section.description}</p>
            </div>

            {/* Column Selector (only for grid sections) */}
            {gridCols[section.id] !== undefined && section.active && (
              <select
                value={gridCols[section.id]}
                onChange={(e) => setGridCols((prev) => ({ ...prev, [section.id]: e.target.value }))}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 flex-shrink-0"
              >
                {COLUMN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}

            {/* Move Buttons */}
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
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  section.active ? "translate-x-5.5" : "translate-x-0.5"
                }`}
                style={{ transform: section.active ? "translateX(22px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar Settings */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-6">
        <h2 className="text-lg font-bold text-white mb-1">Kenar Çubuğu Widget&apos;ları</h2>
        <p className="text-slate-400 text-sm mb-5">
          Sağ kenarda gösterilecek widget&apos;ları ve sıralarını seçin.
        </p>
        {[
          { id: "weather", label: "Hava Durumu", icon: "🌤️", active: true },
          { id: "currency", label: "Döviz Kurları", icon: "💱", active: true },
          { id: "stocks", label: "Borsa", icon: "📈", active: true },
          { id: "calendar", label: "Takvim", icon: "📅", active: true },
          { id: "events", label: "Etkinlik Takvimi", icon: "🎫", active: true },
          { id: "recent_posts", label: "Son Yazılar", icon: "📰", active: true },
          { id: "most_commented", label: "En Çok Yorumlanan", icon: "💬", active: true },
          { id: "on_this_day", label: "Tarihte Bugün", icon: "🕰️", active: true },
          { id: "ad_sidebar", label: "Sidebar Reklam", icon: "📣", active: true },
        ].map((widget) => (
          <div key={widget.id} className="flex items-center justify-between py-2.5 border-b border-slate-700/50 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-base">{widget.icon}</span>
              <span className="text-sm font-medium text-slate-200">{widget.label}</span>
            </div>
            <button
              className={`relative w-10 h-5 rounded-full transition-colors ${widget.active ? "bg-amber-500" : "bg-slate-600"}`}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                style={{ transform: widget.active ? "translateX(22px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
