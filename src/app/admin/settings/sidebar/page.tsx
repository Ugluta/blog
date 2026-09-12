"use client";

import { useState, useRef } from "react";

type Widget = { id: string; label: string; icon: string; enabled: boolean };

const DEFAULT_WIDGETS: Widget[] = [
  { id: "search", label: "Arama", icon: "🔍", enabled: true },
  { id: "recent_posts", label: "Son Yazılar", icon: "📰", enabled: true },
  { id: "categories", label: "Kategoriler", icon: "📂", enabled: true },
  { id: "tags", label: "Etiket Bulutu", icon: "🏷️", enabled: true },
  { id: "popular", label: "Popüler Yazılar", icon: "📈", enabled: true },
  { id: "social_follow", label: "Sosyal Takip", icon: "👥", enabled: true },
  { id: "ad_sidebar", label: "Reklam (300×250)", icon: "📣", enabled: false },
  { id: "newsletter", label: "Bülten Kaydı", icon: "📧", enabled: false },
  { id: "weather", label: "Hava Durumu", icon: "🌤️", enabled: false },
  { id: "currency", label: "Döviz Kurları", icon: "💱", enabled: false },
  { id: "stocks", label: "Borsa", icon: "📊", enabled: false },
];

export default function SidebarPage() {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [saved, setSaved] = useState(false);
  const dragIdx = useRef<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragEnter = (i: number) => setOver(i);
  const onDragEnd = () => {
    if (dragIdx.current !== null && over !== null && dragIdx.current !== over) {
      const next = [...widgets];
      const [moved] = next.splice(dragIdx.current, 1);
      next.splice(over, 0, moved);
      setWidgets(next);
    }
    dragIdx.current = null;
    setOver(null);
  };

  const toggle = (id: string) =>
    setWidgets((prev) => prev.map((w) => w.id === id ? { ...w, enabled: !w.enabled } : w));

  const save = async () => {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sidebar_widgets: JSON.stringify(widgets) }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-[#111111]">Sidebar Widget&apos;ları</h1>
        <p className="text-sm text-[#666666] mt-1">Sürükleyerek sıralayın, toggle ile göster/gizle</p>
      </div>

      <div className="space-y-2">
        {widgets.map((w, i) => (
          <div
            key={w.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragEnter={() => onDragEnter(i)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
              over === i
                ? "border-[#3A6EA8]/60 bg-[#EBF2FA] scale-[1.01]"
                : "border-[#E7E2D8] bg-[#FFFFFF] hover:border-[#E7E2D8]"
            } ${!w.enabled ? "opacity-50" : ""}`}
          >
            <svg className="w-4 h-4 text-[#666666] flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="5.5" cy="4" r="1.2" /><circle cx="10.5" cy="4" r="1.2" />
              <circle cx="5.5" cy="8" r="1.2" /><circle cx="10.5" cy="8" r="1.2" />
              <circle cx="5.5" cy="12" r="1.2" /><circle cx="10.5" cy="12" r="1.2" />
            </svg>
            <span className="text-lg">{w.icon}</span>
            <span className="flex-1 text-sm text-[#111111]">{w.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={w.enabled} onChange={() => toggle(w.id)} />
              <div className="w-9 h-5 bg-[#EBF2FA] rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3A6EA8]" />
            </label>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} className="px-5 py-2 rounded-lg bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm transition-colors">
          Kaydet
        </button>
        {saved && <span className="text-xs text-green-700">✓ Kaydedildi</span>}
      </div>
    </div>
  );
}
