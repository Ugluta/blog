"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Settings = Record<string, string>;

type Section =
  | "genel"
  | "duzen"
  | "baslik"
  | "altbilgi"
  | "arkaplan"
  | "renkler"
  | "tipografi"
  | "bloklar"
  | "anasayfa"
  | "kenarcubugu"
  | "sosyal"
  | "seo";

// ─── Visual selector card ─────────────────────────────────────────────────────

function LayoutCard({
  id,
  label,
  selected,
  onSelect,
  children,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${
        selected
          ? "border-amber-500 bg-amber-500/10"
          : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600"
      }`}
    >
      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">{children}</div>
      <span className={`text-xs font-medium ${selected ? "text-amber-400" : "text-slate-400"}`}>
        {label}
      </span>
    </button>
  );
}

// ─── Drag-and-drop list ───────────────────────────────────────────────────────

type DndItem = { id: string; label: string; icon: string; enabled: boolean };

function DraggableList({
  items,
  onChange,
}: {
  items: DndItem[];
  onChange: (items: DndItem[]) => void;
}) {
  const dragIdx = useRef<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragEnter = (i: number) => setOver(i);
  const onDragEnd = () => {
    if (dragIdx.current !== null && over !== null && dragIdx.current !== over) {
      const next = [...items];
      const [moved] = next.splice(dragIdx.current, 1);
      next.splice(over, 0, moved);
      onChange(next);
    }
    dragIdx.current = null;
    setOver(null);
  };

  const toggle = (id: string) =>
    onChange(items.map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it)));

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragEnter={() => onDragEnter(i)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnd={onDragEnd}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
            over === i
              ? "border-amber-500/60 bg-amber-500/10 scale-[1.01]"
              : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600"
          } ${!item.enabled ? "opacity-50" : ""}`}
        >
          {/* grip */}
          <svg className="w-4 h-4 text-slate-600 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5.5" cy="4" r="1.2" /><circle cx="10.5" cy="4" r="1.2" />
            <circle cx="5.5" cy="8" r="1.2" /><circle cx="10.5" cy="8" r="1.2" />
            <circle cx="5.5" cy="12" r="1.2" /><circle cx="10.5" cy="12" r="1.2" />
          </svg>
          <span className="text-lg">{item.icon}</span>
          <span className="flex-1 text-sm text-slate-200">{item.label}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={item.enabled}
              onChange={() => toggle(item.id)}
            />
            <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
          </label>
        </div>
      ))}
    </div>
  );
}

// ─── Color picker field ───────────────────────────────────────────────────────

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-slate-300">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#f59e0b"}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-slate-700/50 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 bg-slate-900/50 border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        />
      </div>
    </div>
  );
}

// ─── Text field ───────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-slate-600 mt-1">{hint}</p>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-slate-500"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Textarea({
  value,
  onChange,
  rows = 4,
  placeholder,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none placeholder:text-slate-500 ${mono ? "font-mono" : ""}`}
    />
  );
}

// ─── SVG layout thumbnails ────────────────────────────────────────────────────

const LayoutThumbs: Record<string, React.ReactNode> = {
  // Site-wide layout
  full: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect width="80" height="60" rx="4" fill="#1e293b" />
      <rect x="0" y="0" width="80" height="10" rx="2" fill="#334155" />
      <rect x="4" y="14" width="72" height="40" rx="2" fill="#2d3f55" />
    </svg>
  ),
  boxed: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect width="80" height="60" rx="4" fill="#0f172a" />
      <rect x="8" y="0" width="64" height="60" rx="2" fill="#1e293b" />
      <rect x="8" y="0" width="64" height="10" rx="2" fill="#334155" />
      <rect x="12" y="14" width="56" height="40" rx="2" fill="#2d3f55" />
    </svg>
  ),
  framed: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect width="80" height="60" rx="4" fill="#0f172a" />
      <rect x="4" y="4" width="72" height="52" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="4" y="4" width="72" height="11" rx="2" fill="#334155" />
      <rect x="8" y="18" width="64" height="34" rx="2" fill="#2d3f55" />
    </svg>
  ),
  bordered: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect width="80" height="60" rx="4" fill="#1e293b" />
      <rect x="0" y="0" width="80" height="3" fill="#f59e0b" />
      <rect x="0" y="57" width="80" height="3" fill="#f59e0b" />
      <rect x="0" y="3" width="80" height="8" rx="0" fill="#334155" />
      <rect x="4" y="15" width="72" height="38" rx="2" fill="#2d3f55" />
    </svg>
  ),

  // Header layouts
  header_standard: (
    <svg viewBox="0 0 80 32" className="w-full h-full" fill="none">
      <rect width="80" height="32" rx="4" fill="#1e293b" />
      <rect x="4" y="6" width="16" height="6" rx="2" fill="#f59e0b" />
      <rect x="36" y="7" width="8" height="3" rx="1" fill="#475569" />
      <rect x="46" y="7" width="8" height="3" rx="1" fill="#475569" />
      <rect x="56" y="7" width="8" height="3" rx="1" fill="#475569" />
      <rect x="60" y="20" width="16" height="5" rx="2" fill="#334155" />
    </svg>
  ),
  header_centered: (
    <svg viewBox="0 0 80 32" className="w-full h-full" fill="none">
      <rect width="80" height="32" rx="4" fill="#1e293b" />
      <rect x="28" y="4" width="24" height="8" rx="2" fill="#f59e0b" />
      <rect x="12" y="20" width="8" height="3" rx="1" fill="#475569" />
      <rect x="22" y="20" width="8" height="3" rx="1" fill="#475569" />
      <rect x="36" y="20" width="8" height="3" rx="1" fill="#475569" />
      <rect x="46" y="20" width="8" height="3" rx="1" fill="#475569" />
      <rect x="58" y="20" width="8" height="3" rx="1" fill="#475569" />
    </svg>
  ),
  header_topbar: (
    <svg viewBox="0 0 80 36" className="w-full h-full" fill="none">
      <rect width="80" height="36" rx="4" fill="#1e293b" />
      <rect x="0" y="0" width="80" height="8" fill="#0f172a" />
      <rect x="4" y="2" width="20" height="4" rx="1" fill="#334155" />
      <rect x="55" y="2" width="8" height="4" rx="1" fill="#334155" />
      <rect x="65" y="2" width="8" height="4" rx="1" fill="#334155" />
      <rect x="4" y="14" width="16" height="6" rx="2" fill="#f59e0b" />
      <rect x="36" y="15" width="8" height="3" rx="1" fill="#475569" />
      <rect x="46" y="15" width="8" height="3" rx="1" fill="#475569" />
      <rect x="56" y="15" width="8" height="3" rx="1" fill="#475569" />
    </svg>
  ),
  header_split: (
    <svg viewBox="0 0 80 32" className="w-full h-full" fill="none">
      <rect width="80" height="32" rx="4" fill="#1e293b" />
      <rect x="4" y="6" width="16" height="6" rx="2" fill="#f59e0b" />
      <rect x="22" y="7" width="6" height="3" rx="1" fill="#475569" />
      <rect x="30" y="7" width="6" height="3" rx="1" fill="#475569" />
      <rect x="38" y="7" width="6" height="3" rx="1" fill="#475569" />
      <rect x="52" y="7" width="6" height="3" rx="1" fill="#475569" />
      <rect x="60" y="7" width="6" height="3" rx="1" fill="#475569" />
      <rect x="46" y="7" width="4" height="3" rx="1" fill="#334155" />
    </svg>
  ),

  // Post layouts
  content_sidebar: (
    <svg viewBox="0 0 80 50" className="w-full h-full" fill="none">
      <rect width="80" height="50" rx="4" fill="#1e293b" />
      <rect x="0" y="0" width="80" height="8" rx="2" fill="#334155" />
      <rect x="4" y="12" width="50" height="34" rx="2" fill="#2d3f55" />
      <rect x="58" y="12" width="18" height="34" rx="2" fill="#263249" />
    </svg>
  ),
  sidebar_content: (
    <svg viewBox="0 0 80 50" className="w-full h-full" fill="none">
      <rect width="80" height="50" rx="4" fill="#1e293b" />
      <rect x="0" y="0" width="80" height="8" rx="2" fill="#334155" />
      <rect x="4" y="12" width="18" height="34" rx="2" fill="#263249" />
      <rect x="26" y="12" width="50" height="34" rx="2" fill="#2d3f55" />
    </svg>
  ),
  fullwidth_content: (
    <svg viewBox="0 0 80 50" className="w-full h-full" fill="none">
      <rect width="80" height="50" rx="4" fill="#1e293b" />
      <rect x="0" y="0" width="80" height="8" rx="2" fill="#334155" />
      <rect x="4" y="12" width="72" height="34" rx="2" fill="#2d3f55" />
    </svg>
  ),

  // Block head styles
  block_line: (
    <svg viewBox="0 0 80 30" className="w-full h-full" fill="none">
      <rect width="80" height="30" rx="4" fill="#1e293b" />
      <rect x="4" y="10" width="30" height="4" rx="1" fill="#f59e0b" />
      <rect x="34" y="12" width="42" height="1" fill="#334155" />
    </svg>
  ),
  block_left_border: (
    <svg viewBox="0 0 80 30" className="w-full h-full" fill="none">
      <rect width="80" height="30" rx="4" fill="#1e293b" />
      <rect x="4" y="8" width="3" height="14" rx="1" fill="#f59e0b" />
      <rect x="11" y="12" width="30" height="5" rx="1" fill="#e2e8f0" />
    </svg>
  ),
  block_bg: (
    <svg viewBox="0 0 80 30" className="w-full h-full" fill="none">
      <rect width="80" height="30" rx="4" fill="#1e293b" />
      <rect x="4" y="8" width="40" height="14" rx="2" fill="#f59e0b" />
      <rect x="9" y="13" width="24" height="5" rx="1" fill="#0f172a" />
    </svg>
  ),
  block_double: (
    <svg viewBox="0 0 80 30" className="w-full h-full" fill="none">
      <rect width="80" height="30" rx="4" fill="#1e293b" />
      <rect x="4" y="9" width="30" height="2" rx="1" fill="#f59e0b" />
      <rect x="4" y="13" width="30" height="5" rx="1" fill="#e2e8f0" />
      <rect x="4" y="19" width="30" height="2" rx="1" fill="#f59e0b" />
    </svg>
  ),
  block_slash: (
    <svg viewBox="0 0 80 30" className="w-full h-full" fill="none">
      <rect width="80" height="30" rx="4" fill="#1e293b" />
      <rect x="4" y="8" width="4" height="14" rx="1" fill="#f59e0b" transform="skewX(-10)" />
      <rect x="11" y="8" width="4" height="14" rx="1" fill="#f59e0b" transform="skewX(-10)" />
      <rect x="19" y="12" width="24" height="5" rx="1" fill="#e2e8f0" />
    </svg>
  ),
  block_dot: (
    <svg viewBox="0 0 80 30" className="w-full h-full" fill="none">
      <rect width="80" height="30" rx="4" fill="#1e293b" />
      <circle cx="10" cy="15" r="4" fill="#f59e0b" />
      <rect x="18" y="12" width="28" height="5" rx="1" fill="#e2e8f0" />
    </svg>
  ),
  block_icon: (
    <svg viewBox="0 0 80 30" className="w-full h-full" fill="none">
      <rect width="80" height="30" rx="4" fill="#1e293b" />
      <rect x="4" y="9" width="10" height="12" rx="2" fill="#334155" />
      <text x="6" y="19" fontSize="7" fill="#f59e0b">★</text>
      <rect x="17" y="12" width="28" height="5" rx="1" fill="#e2e8f0" />
    </svg>
  ),
  block_center: (
    <svg viewBox="0 0 80 30" className="w-full h-full" fill="none">
      <rect width="80" height="30" rx="4" fill="#1e293b" />
      <rect x="20" y="8" width="40" height="2" rx="1" fill="#f59e0b" />
      <rect x="15" y="13" width="50" height="5" rx="1" fill="#e2e8f0" />
      <rect x="20" y="20" width="40" height="2" rx="1" fill="#f59e0b" />
    </svg>
  ),
};

// ─── Default settings ─────────────────────────────────────────────────────────

const DEFAULTS: Settings = {
  site_title: "",
  site_tagline: "",
  site_logo: "",
  site_favicon: "",
  date_format: "DD MMMM YYYY",
  posts_per_page: "12",
  breadcrumbs: "true",
  custom_css: "",
  custom_js: "",
  layout_type: "full",
  site_width: "1280",
  header_layout: "header_standard",
  header_sticky: "true",
  header_transparent: "false",
  logo_text: "",
  footer_layout: "footer_3col",
  footer_copyright: "",
  bg_type: "color",
  bg_color: "#0a0f1e",
  bg_gradient_from: "#0a0f1e",
  bg_gradient_to: "#0f2040",
  bg_pattern: "none",
  bg_image: "",
  primary_color: "#f59e0b",
  secondary_color: "#3b82f6",
  text_color: "#f1f5f9",
  link_color: "#f59e0b",
  border_color: "#334155",
  card_bg: "#1e293b",
  font_body: "Inter",
  font_heading: "Inter",
  font_size_base: "16",
  font_weight_heading: "700",
  line_height: "1.7",
  block_style: "standard",
  block_head_style: "block_line",
  post_layout: "content_sidebar",
  homepage_sections: JSON.stringify([
    { id: "hero", label: "Hero / Slider", icon: "🖼️", enabled: true },
    { id: "featured", label: "Öne Çıkan Haberler", icon: "⭐", enabled: true },
    { id: "categories", label: "Kategori Vitrin", icon: "📂", enabled: true },
    { id: "latest", label: "Son Haberler", icon: "🕐", enabled: true },
    { id: "trending", label: "Trend İçerikler", icon: "🔥", enabled: true },
    { id: "video", label: "Video Bölümü", icon: "🎬", enabled: false },
    { id: "newsletter", label: "Bülten Kaydı", icon: "📧", enabled: true },
    { id: "banner_ad", label: "Reklam Alanı", icon: "📣", enabled: false },
  ]),
  sidebar_widgets: JSON.stringify([
    { id: "search", label: "Arama", icon: "🔍", enabled: true },
    { id: "recent_posts", label: "Son Yazılar", icon: "📰", enabled: true },
    { id: "categories", label: "Kategoriler", icon: "📂", enabled: true },
    { id: "tags", label: "Etiketler", icon: "🏷️", enabled: true },
    { id: "popular", label: "Popüler Yazılar", icon: "📈", enabled: true },
    { id: "ad_sidebar", label: "Reklam", icon: "📣", enabled: false },
    { id: "social_follow", label: "Sosyal Takip", icon: "👥", enabled: true },
  ]),
  social_twitter: "",
  social_facebook: "",
  social_instagram: "",
  social_youtube: "",
  social_linkedin: "",
  social_pinterest: "",
  social_tiktok: "",
  seo_meta_title: "",
  seo_meta_description: "",
  seo_og_image: "",
  seo_google_tag: "",
  seo_canonical_self: "true",
  seo_noindex_archives: "false",
};

// ─── Nav sections ─────────────────────────────────────────────────────────────

const NAV: { key: Section; label: string; icon: string }[] = [
  { key: "genel", label: "Genel", icon: "⚙️" },
  { key: "duzen", label: "Düzen", icon: "📐" },
  { key: "baslik", label: "Başlık", icon: "🔝" },
  { key: "altbilgi", label: "Alt Bilgi", icon: "🔚" },
  { key: "arkaplan", label: "Arkaplan", icon: "🖼️" },
  { key: "renkler", label: "Renkler", icon: "🎨" },
  { key: "tipografi", label: "Tipografi", icon: "🔤" },
  { key: "bloklar", label: "Bloklar", icon: "🧩" },
  { key: "anasayfa", label: "Anasayfa", icon: "🏠" },
  { key: "kenarcubugu", label: "Kenar Çubuğu", icon: "📋" },
  { key: "sosyal", label: "Sosyal", icon: "🌐" },
  { key: "seo", label: "SEO", icon: "📊" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function TemaAyarlariPage() {
  const [section, setSection] = useState<Section>("genel");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // DnD lists parsed from JSON settings
  const [homeSections, setHomeSections] = useState<DndItem[]>([]);
  const [sidebarWidgets, setSidebarWidgets] = useState<DndItem[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings").catch(() => null);
      if (res?.ok) {
        const data: Settings = await res.json();
        setSettings({ ...DEFAULTS, ...data });
        if (data.homepage_sections) {
          try { setHomeSections(JSON.parse(data.homepage_sections)); } catch {}
        }
        if (data.sidebar_widgets) {
          try { setSidebarWidgets(JSON.parse(data.sidebar_widgets)); } catch {}
        }
      } else {
        try { setHomeSections(JSON.parse(DEFAULTS.homepage_sections)); } catch {}
        try { setSidebarWidgets(JSON.parse(DEFAULTS.sidebar_widgets)); } catch {}
      }
      setLoading(false);
    })();
  }, []);

  const set = useCallback((key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const payload: Settings = {
      ...settings,
      homepage_sections: JSON.stringify(homeSections),
      sidebar_widgets: JSON.stringify(sidebarWidgets),
    };
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    setSaving(false);
    if (res?.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400 text-sm">Yükleniyor…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0f1e]">
      {/* ── Sidebar nav ── */}
      <aside className="w-52 flex-shrink-0 border-r border-slate-700/50 py-6 px-3 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold px-3 mb-3">
          Tema Ayarları
        </p>
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => setSection(n.key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              section === n.key
                ? "bg-amber-500/15 text-amber-400 font-medium"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <span className="text-base">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </aside>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-900/30 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-white">
              {NAV.find((n) => n.key === section)?.icon}{" "}
              {NAV.find((n) => n.key === section)?.label} Ayarları
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <span>✓</span> Kaydedildi
              </span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm disabled:opacity-50 transition-colors"
            >
              {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>

        {/* Section panels */}
        <div className="flex-1 p-6 space-y-6 max-w-3xl">

          {/* ── GENEL ── */}
          {section === "genel" && (
            <>
              <Card title="Site Kimliği">
                <Field label="Site Başlığı">
                  <Input value={settings.site_title} onChange={(v) => set("site_title", v)} placeholder="Sitenizin adı" />
                </Field>
                <Field label="Kısa Açıklama (Tagline)">
                  <Input value={settings.site_tagline} onChange={(v) => set("site_tagline", v)} placeholder="Sitenizi özetleyen bir cümle" />
                </Field>
                <Field label="Logo URL">
                  <Input value={settings.site_logo} onChange={(v) => set("site_logo", v)} placeholder="https://…/logo.png" />
                </Field>
                <Field label="Favicon URL">
                  <Input value={settings.site_favicon} onChange={(v) => set("site_favicon", v)} placeholder="https://…/favicon.ico" />
                </Field>
              </Card>

              <Card title="İçerik">
                <Field label="Sayfa Başına Post">
                  <Select
                    value={settings.posts_per_page}
                    onChange={(v) => set("posts_per_page", v)}
                    options={["6","8","10","12","16","20","24"].map((v) => ({ value: v, label: v }))}
                  />
                </Field>
                <Field label="Tarih Formatı">
                  <Select
                    value={settings.date_format}
                    onChange={(v) => set("date_format", v)}
                    options={[
                      { value: "DD MMMM YYYY", label: "01 Ocak 2025" },
                      { value: "DD.MM.YYYY", label: "01.01.2025" },
                      { value: "YYYY-MM-DD", label: "2025-01-01" },
                      { value: "relative", label: "3 gün önce" },
                    ]}
                  />
                </Field>
                <ToggleRow
                  label="Breadcrumbs göster"
                  value={settings.breadcrumbs === "true"}
                  onChange={(v) => set("breadcrumbs", v ? "true" : "false")}
                />
              </Card>

              <Card title="Özel Kod">
                <Field label="Özel CSS" hint="<head> içine eklenir">
                  <Textarea value={settings.custom_css} onChange={(v) => set("custom_css", v)} rows={5} placeholder="/* CSS kurallarınız */" mono />
                </Field>
                <Field label="Özel JavaScript" hint="</body> kapanmadan önce eklenir">
                  <Textarea value={settings.custom_js} onChange={(v) => set("custom_js", v)} rows={5} placeholder="// JavaScript kodunuz" mono />
                </Field>
              </Card>
            </>
          )}

          {/* ── DÜZEN ── */}
          {section === "duzen" && (
            <>
              <Card title="Site Düzeni">
                <p className="text-xs text-slate-500 mb-4">Sitenin genel görünüm tipini seçin</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(["full","boxed","framed","bordered"] as const).map((l) => (
                    <LayoutCard key={l} id={l} label={{ full: "Tam", boxed: "Kutulu", framed: "Çerçeveli", bordered: "Kenarlıklı" }[l]} selected={settings.layout_type === l} onSelect={(v) => set("layout_type", v)}>
                      {LayoutThumbs[l]}
                    </LayoutCard>
                  ))}
                </div>
              </Card>

              <Card title="Site Genişliği">
                <Field label="Maksimum Genişlik (px)" hint="Önerilen: 1280">
                  <div className="flex items-center gap-4">
                    <input
                      type="range" min="960" max="1920" step="40"
                      value={settings.site_width}
                      onChange={(e) => set("site_width", e.target.value)}
                      className="flex-1 accent-amber-500"
                    />
                    <span className="text-sm text-white w-16 text-right">{settings.site_width}px</span>
                  </div>
                </Field>
              </Card>

              <Card title="Yazı Sayfası Düzeni">
                <p className="text-xs text-slate-500 mb-4">Yazı içerik sayfasının yerleşimi</p>
                <div className="grid grid-cols-3 gap-3">
                  {(["content_sidebar","sidebar_content","fullwidth_content"] as const).map((l) => (
                    <LayoutCard key={l} id={l} label={{ content_sidebar: "İçerik + Kenar", sidebar_content: "Kenar + İçerik", fullwidth_content: "Tam Genişlik" }[l]} selected={settings.post_layout === l} onSelect={(v) => set("post_layout", v)}>
                      {LayoutThumbs[l]}
                    </LayoutCard>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* ── BAŞLIK ── */}
          {section === "baslik" && (
            <>
              <Card title="Başlık Düzeni">
                <p className="text-xs text-slate-500 mb-4">Header bölümünün görünümünü seçin</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["header_standard","header_centered","header_topbar","header_split"] as const).map((l) => (
                    <LayoutCard key={l} id={l} label={{ header_standard: "Standart", header_centered: "Ortalı Logo", header_topbar: "Üst Bar + Header", header_split: "Bölünmüş" }[l]} selected={settings.header_layout === l} onSelect={(v) => set("header_layout", v)}>
                      {LayoutThumbs[l]}
                    </LayoutCard>
                  ))}
                </div>
              </Card>

              <Card title="Başlık Seçenekleri">
                <ToggleRow label="Yapışkan başlık (sticky)" value={settings.header_sticky === "true"} onChange={(v) => set("header_sticky", v ? "true" : "false")} />
                <ToggleRow label="Şeffaf başlık (hero üzerinde)" value={settings.header_transparent === "true"} onChange={(v) => set("header_transparent", v ? "true" : "false")} />
                <Field label="Logo Metni" hint="Logo görseli yoksa bu metin görünür">
                  <Input value={settings.logo_text} onChange={(v) => set("logo_text", v)} placeholder="Site Adı" />
                </Field>
              </Card>
            </>
          )}

          {/* ── ALT BİLGİ ── */}
          {section === "altbilgi" && (
            <Card title="Alt Bilgi">
              <Field label="Alt Bilgi Düzeni">
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { id: "footer_1col", label: "Tek Sütun" },
                    { id: "footer_2col", label: "2 Sütun" },
                    { id: "footer_3col", label: "3 Sütun" },
                    { id: "footer_4col", label: "4 Sütun" },
                  ].map((f) => (
                    <LayoutCard key={f.id} id={f.id} label={f.label} selected={settings.footer_layout === f.id} onSelect={(v) => set("footer_layout", v)}>
                      <svg viewBox="0 0 80 40" className="w-full h-full" fill="none">
                        <rect width="80" height="40" rx="4" fill="#1e293b" />
                        {f.id === "footer_1col" && <rect x="8" y="10" width="64" height="20" rx="2" fill="#2d3f55" />}
                        {f.id === "footer_2col" && <>
                          <rect x="4" y="10" width="34" height="20" rx="2" fill="#2d3f55" />
                          <rect x="42" y="10" width="34" height="20" rx="2" fill="#2d3f55" />
                        </>}
                        {f.id === "footer_3col" && <>
                          <rect x="4" y="10" width="22" height="20" rx="2" fill="#2d3f55" />
                          <rect x="29" y="10" width="22" height="20" rx="2" fill="#2d3f55" />
                          <rect x="54" y="10" width="22" height="20" rx="2" fill="#2d3f55" />
                        </>}
                        {f.id === "footer_4col" && <>
                          <rect x="4" y="10" width="16" height="20" rx="2" fill="#2d3f55" />
                          <rect x="22" y="10" width="16" height="20" rx="2" fill="#2d3f55" />
                          <rect x="40" y="10" width="16" height="20" rx="2" fill="#2d3f55" />
                          <rect x="58" y="10" width="18" height="20" rx="2" fill="#2d3f55" />
                        </>}
                      </svg>
                    </LayoutCard>
                  ))}
                </div>
              </Field>
              <Field label="Telif Hakkı Metni" hint="Örn: © 2025 Şirket Adı. Tüm hakları saklıdır.">
                <Input value={settings.footer_copyright} onChange={(v) => set("footer_copyright", v)} placeholder="© 2025 Site Adı" />
              </Field>
            </Card>
          )}

          {/* ── ARKAPLAN ── */}
          {section === "arkaplan" && (
            <>
              <Card title="Arkaplan Tipi">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "color", label: "Düz Renk" },
                    { id: "gradient", label: "Gradient" },
                    { id: "pattern", label: "Desen" },
                    { id: "image", label: "Görsel" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => set("bg_type", b.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        settings.bg_type === b.id
                          ? "bg-amber-500/20 border-amber-500/60 text-amber-400"
                          : "border-slate-700/50 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </Card>

              {settings.bg_type === "color" && (
                <Card title="Renk Ayarları">
                  <ColorField label="Arkaplan Rengi" value={settings.bg_color} onChange={(v) => set("bg_color", v)} />
                </Card>
              )}

              {settings.bg_type === "gradient" && (
                <Card title="Gradient Ayarları">
                  <ColorField label="Başlangıç Rengi" value={settings.bg_gradient_from} onChange={(v) => set("bg_gradient_from", v)} />
                  <ColorField label="Bitiş Rengi" value={settings.bg_gradient_to} onChange={(v) => set("bg_gradient_to", v)} />
                  <div
                    className="h-12 rounded-xl mt-2"
                    style={{ background: `linear-gradient(135deg, ${settings.bg_gradient_from}, ${settings.bg_gradient_to})` }}
                  />
                </Card>
              )}

              {settings.bg_type === "pattern" && (
                <Card title="Desen Seçimi">
                  <div className="grid grid-cols-4 gap-3">
                    {["none","dots","grid","diagonal","waves","hexagon"].map((p) => (
                      <button
                        key={p}
                        onClick={() => set("bg_pattern", p)}
                        className={`aspect-square rounded-xl border-2 transition-colors flex items-center justify-center text-xs ${
                          settings.bg_pattern === p
                            ? "border-amber-500 bg-amber-500/10 text-amber-400"
                            : "border-slate-700/50 text-slate-500 hover:border-slate-600"
                        }`}
                        style={{
                          backgroundImage:
                            p === "dots" ? "radial-gradient(circle, #334155 1px, transparent 1px)" :
                            p === "grid" ? "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)" :
                            p === "diagonal" ? "repeating-linear-gradient(45deg, #334155 0, #334155 1px, transparent 0, transparent 50%)" :
                            "none",
                          backgroundSize:
                            p === "dots" ? "16px 16px" :
                            p === "grid" ? "16px 16px" :
                            p === "diagonal" ? "10px 10px" :
                            "auto",
                        }}
                      >
                        {p === "none" ? "Yok" : ""}
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {settings.bg_type === "image" && (
                <Card title="Görsel Ayarları">
                  <Field label="Arkaplan Görsel URL">
                    <Input value={settings.bg_image} onChange={(v) => set("bg_image", v)} placeholder="https://…/background.jpg" />
                  </Field>
                </Card>
              )}
            </>
          )}

          {/* ── RENKLER ── */}
          {section === "renkler" && (
            <>
              <Card title="Hazır Renk Şemaları">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: "amber", label: "Amber (Varsayılan)", primary: "#f59e0b", secondary: "#3b82f6" },
                    { id: "blue", label: "Mavi", primary: "#3b82f6", secondary: "#8b5cf6" },
                    { id: "green", label: "Yeşil", primary: "#10b981", secondary: "#0ea5e9" },
                    { id: "red", label: "Kırmızı", primary: "#ef4444", secondary: "#f97316" },
                    { id: "purple", label: "Mor", primary: "#8b5cf6", secondary: "#ec4899" },
                    { id: "teal", label: "Teal", primary: "#14b8a6", secondary: "#3b82f6" },
                    { id: "rose", label: "Gül", primary: "#f43f5e", secondary: "#fb923c" },
                    { id: "custom", label: "Özel", primary: settings.primary_color, secondary: settings.secondary_color },
                  ].map((skin) => (
                    <button
                      key={skin.id}
                      onClick={() => {
                        if (skin.id !== "custom") {
                          set("primary_color", skin.primary);
                          set("secondary_color", skin.secondary);
                        }
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                        settings.primary_color === skin.primary && settings.secondary_color === skin.secondary
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex gap-1.5">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: skin.primary }} />
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: skin.secondary }} />
                      </div>
                      <span className="text-[10px] text-slate-400 text-center leading-tight">{skin.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              <Card title="Özel Renkler">
                <div className="space-y-4">
                  <ColorField label="Ana Renk (Primary)" value={settings.primary_color} onChange={(v) => set("primary_color", v)} />
                  <ColorField label="İkincil Renk" value={settings.secondary_color} onChange={(v) => set("secondary_color", v)} />
                  <ColorField label="Metin Rengi" value={settings.text_color} onChange={(v) => set("text_color", v)} />
                  <ColorField label="Link Rengi" value={settings.link_color} onChange={(v) => set("link_color", v)} />
                  <ColorField label="Kenarlık Rengi" value={settings.border_color} onChange={(v) => set("border_color", v)} />
                  <ColorField label="Kart Arkaplanı" value={settings.card_bg} onChange={(v) => set("card_bg", v)} />
                </div>
              </Card>
            </>
          )}

          {/* ── TİPOGRAFİ ── */}
          {section === "tipografi" && (
            <Card title="Yazı Tipi Ayarları">
              <Field label="Gövde Fontu">
                <Select
                  value={settings.font_body}
                  onChange={(v) => set("font_body", v)}
                  options={[
                    { value: "Inter", label: "Inter (Varsayılan)" },
                    { value: "Roboto", label: "Roboto" },
                    { value: "Open Sans", label: "Open Sans" },
                    { value: "Lato", label: "Lato" },
                    { value: "Montserrat", label: "Montserrat" },
                    { value: "Source Sans 3", label: "Source Sans 3" },
                    { value: "Nunito", label: "Nunito" },
                    { value: "Noto Sans", label: "Noto Sans" },
                  ]}
                />
              </Field>
              <Field label="Başlık Fontu">
                <Select
                  value={settings.font_heading}
                  onChange={(v) => set("font_heading", v)}
                  options={[
                    { value: "Inter", label: "Inter (Varsayılan)" },
                    { value: "Roboto", label: "Roboto" },
                    { value: "Playfair Display", label: "Playfair Display" },
                    { value: "Merriweather", label: "Merriweather" },
                    { value: "Montserrat", label: "Montserrat" },
                    { value: "Oswald", label: "Oswald" },
                    { value: "Raleway", label: "Raleway" },
                    { value: "Poppins", label: "Poppins" },
                  ]}
                />
              </Field>
              <Field label="Temel Font Boyutu">
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="12" max="20" step="1"
                    value={settings.font_size_base}
                    onChange={(e) => set("font_size_base", e.target.value)}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-sm text-white w-16 text-right">{settings.font_size_base}px</span>
                </div>
              </Field>
              <Field label="Satır Yüksekliği">
                <Select
                  value={settings.line_height}
                  onChange={(v) => set("line_height", v)}
                  options={["1.4","1.5","1.6","1.7","1.8","2.0"].map((v) => ({ value: v, label: v }))}
                />
              </Field>
              <Field label="Başlık Font Kalınlığı">
                <Select
                  value={settings.font_weight_heading}
                  onChange={(v) => set("font_weight_heading", v)}
                  options={[
                    { value: "400", label: "Normal (400)" },
                    { value: "500", label: "Medium (500)" },
                    { value: "600", label: "SemiBold (600)" },
                    { value: "700", label: "Bold (700)" },
                    { value: "800", label: "ExtraBold (800)" },
                    { value: "900", label: "Black (900)" },
                  ]}
                />
              </Field>

              {/* Preview */}
              <div className="mt-4 p-4 rounded-xl border border-slate-700/50 bg-slate-900/30">
                <p className="text-[10px] text-slate-600 mb-2 uppercase tracking-widest">Önizleme</p>
                <h3 style={{ fontFamily: settings.font_heading, fontWeight: settings.font_weight_heading, fontSize: "20px" }} className="text-white mb-1">
                  Örnek Başlık Metni
                </h3>
                <p style={{ fontFamily: settings.font_body, fontSize: `${settings.font_size_base}px`, lineHeight: settings.line_height }} className="text-slate-300 text-sm">
                  Burası gövde metni örneğidir. Seçilen font ayarları bu alanda görüntülenmektedir.
                </p>
              </div>
            </Card>
          )}

          {/* ── BLOKLAR ── */}
          {section === "bloklar" && (
            <>
              <Card title="Blok Başlık Stili">
                <p className="text-xs text-slate-500 mb-4">Haber listesi bölümlerinin başlık görünümünü seçin</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(["block_line","block_left_border","block_bg","block_double","block_slash","block_dot","block_icon","block_center"] as const).map((s) => (
                    <LayoutCard
                      key={s}
                      id={s}
                      label={{
                        block_line: "Çizgi",
                        block_left_border: "Sol Çizgi",
                        block_bg: "Dolgulu",
                        block_double: "Çift Çizgi",
                        block_slash: "Eğik",
                        block_dot: "Nokta",
                        block_icon: "İkon",
                        block_center: "Ortalı",
                      }[s]}
                      selected={settings.block_head_style === s}
                      onSelect={(v) => set("block_head_style", v)}
                    >
                      {LayoutThumbs[s]}
                    </LayoutCard>
                  ))}
                </div>
              </Card>

              <Card title="Blok Kart Stili">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "standard", label: "Standart" },
                    { id: "minimal", label: "Minimal" },
                    { id: "overlay", label: "Üst Bindirme" },
                    { id: "bordered", label: "Kenarlıklı" },
                    { id: "compact", label: "Sıkışık" },
                    { id: "magazine", label: "Dergi" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => set("block_style", s.id)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                        settings.block_style === s.id
                          ? "border-amber-500 bg-amber-500/10 text-amber-400"
                          : "border-slate-700/50 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* ── ANASAYFA ── */}
          {section === "anasayfa" && (
            <Card title="Anasayfa Bölüm Sıralaması">
              <p className="text-xs text-slate-500 mb-4">
                Bölümleri sürükleyerek sıralayın. Göstermek istemediklerinizi kapatın.
              </p>
              <DraggableList items={homeSections} onChange={setHomeSections} />
            </Card>
          )}

          {/* ── KENAR ÇUBUĞU ── */}
          {section === "kenarcubugu" && (
            <Card title="Kenar Çubuğu Widget Sıralaması">
              <p className="text-xs text-slate-500 mb-4">
                Widget&apos;ları sürükleyerek sıralayın. Göstermek istemediklerinizi kapatın.
              </p>
              <DraggableList items={sidebarWidgets} onChange={setSidebarWidgets} />
            </Card>
          )}

          {/* ── SOSYAL ── */}
          {section === "sosyal" && (
            <Card title="Sosyal Medya Linkleri">
              {[
                { key: "social_twitter", label: "Twitter / X", placeholder: "https://twitter.com/kullanici" },
                { key: "social_facebook", label: "Facebook", placeholder: "https://facebook.com/sayfa" },
                { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/kullanici" },
                { key: "social_youtube", label: "YouTube", placeholder: "https://youtube.com/@kanal" },
                { key: "social_linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/profil" },
                { key: "social_pinterest", label: "Pinterest", placeholder: "https://pinterest.com/kullanici" },
                { key: "social_tiktok", label: "TikTok", placeholder: "https://tiktok.com/@kullanici" },
              ].map((s) => (
                <Field key={s.key} label={s.label}>
                  <Input value={settings[s.key] ?? ""} onChange={(v) => set(s.key, v)} placeholder={s.placeholder} />
                </Field>
              ))}
            </Card>
          )}

          {/* ── SEO ── */}
          {section === "seo" && (
            <>
              <Card title="Temel SEO">
                <Field label="Varsayılan Meta Başlık" hint="Sayfa başlığı yoksa kullanılır">
                  <Input value={settings.seo_meta_title} onChange={(v) => set("seo_meta_title", v)} placeholder="Site Adı - Açıklama" />
                </Field>
                <Field label="Varsayılan Meta Açıklama">
                  <Textarea value={settings.seo_meta_description} onChange={(v) => set("seo_meta_description", v)} rows={3} placeholder="Siteniz hakkında 155 karakteri geçmeyen bir açıklama" />
                </Field>
                <Field label="OG Görsel URL" hint="Sosyal medya paylaşımlarında kullanılır">
                  <Input value={settings.seo_og_image} onChange={(v) => set("seo_og_image", v)} placeholder="https://…/og-image.jpg" />
                </Field>
              </Card>

              <Card title="Analitik">
                <Field label="Google Tag Manager ID" hint="GTM-XXXXXXX formatında">
                  <Input value={settings.seo_google_tag} onChange={(v) => set("seo_google_tag", v)} placeholder="GTM-XXXXXXX" />
                </Field>
              </Card>

              <Card title="Gelişmiş SEO">
                <ToggleRow
                  label="Canonical URL ekle (self-referencing)"
                  value={settings.seo_canonical_self === "true"}
                  onChange={(v) => set("seo_canonical_self", v ? "true" : "false")}
                />
                <ToggleRow
                  label="Arşiv sayfalarını no-index yap"
                  value={settings.seo_noindex_archives === "true"}
                  onChange={(v) => set("seo_noindex_archives", v ? "true" : "false")}
                />
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 space-y-4">
      <h2 className="text-sm font-semibold text-white border-b border-slate-700/50 pb-3">{title}</h2>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-300">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-10 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
      </label>
    </div>
  );
}
