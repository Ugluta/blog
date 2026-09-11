"use client";

import { useState } from "react";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  target: "_self" | "_blank";
  column: 1 | 2 | 3 | 4;
  order: number;
}

const COLUMN_LABELS: Record<number, string> = {
  1: "Hızlı Bağlantılar",
  2: "Kategoriler",
  3: "Kurumsal",
  4: "Yasal",
};

const defaultItems: MenuItem[] = [
  { id: "1", label: "Ana Sayfa", href: "/", target: "_self", column: 1, order: 0 },
  { id: "2", label: "Haberler", href: "/haberler", target: "_self", column: 1, order: 1 },
  { id: "3", label: "Blog", href: "/blog", target: "_self", column: 1, order: 2 },
  { id: "4", label: "Fiyatlandırma", href: "/fiyatlandirma", target: "_self", column: 1, order: 3 },
  { id: "5", label: "Teknoloji", href: "/kategori/teknoloji", target: "_self", column: 2, order: 0 },
  { id: "6", label: "Ekonomi", href: "/kategori/ekonomi", target: "_self", column: 2, order: 1 },
  { id: "7", label: "Spor", href: "/kategori/spor", target: "_self", column: 2, order: 2 },
  { id: "8", label: "Kültür", href: "/kategori/kultur", target: "_self", column: 2, order: 3 },
  { id: "9", label: "Hakkımızda", href: "/hakkimizda", target: "_self", column: 3, order: 0 },
  { id: "10", label: "İletişim", href: "/iletisim", target: "_self", column: 3, order: 1 },
  { id: "11", label: "Kariyer", href: "/kariyer", target: "_self", column: 3, order: 2 },
  { id: "12", label: "Reklam Ver", href: "/reklam", target: "_self", column: 3, order: 3 },
  { id: "13", label: "Gizlilik Politikası", href: "/gizlilik-politikasi", target: "_self", column: 4, order: 0 },
  { id: "14", label: "Kullanım Şartları", href: "/kullanim-sartlari", target: "_self", column: 4, order: 1 },
  { id: "15", label: "KVKK", href: "/kvkk", target: "_self", column: 4, order: 2 },
  { id: "16", label: "Çerez Politikası", href: "/cerez-politikasi", target: "_self", column: 4, order: 3 },
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function FooterMenuPage() {
  const [items, setItems] = useState<MenuItem[]>(defaultItems);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [adding, setAdding] = useState<Partial<MenuItem> | null>(null);
  const [saved, setSaved] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const byColumn = (col: 1 | 2 | 3 | 4) =>
    items.filter((i) => i.column === col).sort((a, b) => a.order - b.order);

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const saveEdit = () => {
    if (!editing) return;
    setItems((prev) => prev.map((i) => (i.id === editing.id ? editing : i)));
    setEditing(null);
  };

  const saveAdd = () => {
    if (!adding?.label || !adding?.href) return;
    const newItem: MenuItem = {
      id: genId(),
      label: adding.label,
      href: adding.href,
      target: adding.target ?? "_self",
      column: adding.column ?? 1,
      order: byColumn(adding.column ?? 1).length,
    };
    setItems((prev) => [...prev, newItem]);
    setAdding(null);
  };

  const moveUp = (item: MenuItem) => {
    const col = byColumn(item.column);
    const idx = col.findIndex((i) => i.id === item.id);
    if (idx === 0) return;
    const prev = col[idx - 1];
    setItems((all) =>
      all.map((i) => {
        if (i.id === item.id) return { ...i, order: prev.order };
        if (i.id === prev.id) return { ...i, order: item.order };
        return i;
      })
    );
  };

  const moveDown = (item: MenuItem) => {
    const col = byColumn(item.column);
    const idx = col.findIndex((i) => i.id === item.id);
    if (idx === col.length - 1) return;
    const next = col[idx + 1];
    setItems((all) =>
      all.map((i) => {
        if (i.id === item.id) return { ...i, order: next.order };
        if (i.id === next.id) return { ...i, order: item.order };
        return i;
      })
    );
  };

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };
  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    const from = items.find((i) => i.id === dragId);
    const to = items.find((i) => i.id === targetId);
    if (!from || !to || from.column !== to.column) { setDragId(null); setDragOverId(null); return; }
    setItems((all) =>
      all.map((i) => {
        if (i.id === dragId) return { ...i, order: to.order };
        if (i.id === targetId) return { ...i, order: from.order };
        return i;
      })
    );
    setDragId(null);
    setDragOverId(null);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Footer Menüsü</h1>
          <p className="text-[#666666] text-sm mt-1">4 sütunlu alt navigasyon bağlantılarını yönetin</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdding({ column: 1, target: "_self" })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#111111] text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Bağlantı
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              saved
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-[#3A6EA8] text-white hover:bg-[#2D5A8E]"
            }`}
          >
            {saved ? "✓ Kaydedildi" : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {([1, 2, 3, 4] as const).map((col) => (
          <div key={col} className="bg-[#FFFFFF] rounded-2xl border border-[#E7E2D8] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E7E2D8] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#3A6EA8]">Sütun {col}</p>
                <p className="text-sm font-semibold text-[#111111]">{COLUMN_LABELS[col]}</p>
              </div>
              <button
                onClick={() => setAdding({ column: col, target: "_self" })}
                className="w-7 h-7 rounded-lg bg-[#EBF2FA] hover:bg-[#3A6EA8] hover:text-white text-[#666666] flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="p-3 space-y-2 min-h-[160px]">
              {byColumn(col).map((item, idx, arr) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDrop={() => handleDrop(item.id)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EBF2FA] border transition-all cursor-grab active:cursor-grabbing ${
                    dragOverId === item.id ? "border-[#3A6EA8]/50 bg-[#EBF2FA]" : "border-transparent hover:border-[#E7E2D8]"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-[#666666] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111111] truncate">{item.label}</p>
                    <p className="text-[10px] text-[#666666] truncate font-mono">{item.href}</p>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveUp(item)}
                      disabled={idx === 0}
                      className="p-1 rounded text-[#666666] hover:text-[#3A6EA8] disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveDown(item)}
                      disabled={idx === arr.length - 1}
                      className="p-1 rounded text-[#666666] hover:text-[#3A6EA8] disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditing({ ...item })}
                      className="p-1 rounded text-[#666666] hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded text-[#666666] hover:text-red-700 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {byColumn(col).length === 0 && (
                <p className="text-center text-xs text-[#666666] py-4">Henüz bağlantı yok</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7E2D8] p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-[#111111] mb-5">Bağlantıyı Düzenle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Etiket</label>
                <input
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                  className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">URL</label>
                <input
                  value={editing.href}
                  onChange={(e) => setEditing({ ...editing, href: e.target.value })}
                  className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8] font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1.5">Sütun</label>
                  <select
                    value={editing.column}
                    onChange={(e) => setEditing({ ...editing, column: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                    className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8]"
                  >
                    {[1, 2, 3, 4].map((c) => <option key={c} value={c}>Sütun {c} – {COLUMN_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1.5">Açılış</label>
                  <select
                    value={editing.target}
                    onChange={(e) => setEditing({ ...editing, target: e.target.value as "_self" | "_blank" })}
                    className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8]"
                  >
                    <option value="_self">Aynı Sekme</option>
                    <option value="_blank">Yeni Sekme</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-[#E7E2D8] text-[#444444] hover:text-[#111111] text-sm font-medium transition-colors">İptal</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white text-sm font-semibold transition-colors">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {adding !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7E2D8] p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-[#111111] mb-5">Yeni Bağlantı Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Etiket</label>
                <input
                  value={adding.label ?? ""}
                  onChange={(e) => setAdding({ ...adding, label: e.target.value })}
                  placeholder="örn. Hakkımızda"
                  className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] placeholder-[#999999] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">URL</label>
                <input
                  value={adding.href ?? ""}
                  onChange={(e) => setAdding({ ...adding, href: e.target.value })}
                  placeholder="/hakkimizda"
                  className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] placeholder-[#999999] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8] font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1.5">Sütun</label>
                  <select
                    value={adding.column ?? 1}
                    onChange={(e) => setAdding({ ...adding, column: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                    className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8]"
                  >
                    {[1, 2, 3, 4].map((c) => <option key={c} value={c}>Sütun {c} – {COLUMN_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#666666] mb-1.5">Açılış</label>
                  <select
                    value={adding.target ?? "_self"}
                    onChange={(e) => setAdding({ ...adding, target: e.target.value as "_self" | "_blank" })}
                    className="w-full bg-[#EBF2FA] border border-[#E7E2D8] text-[#111111] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#3A6EA8]"
                  >
                    <option value="_self">Aynı Sekme</option>
                    <option value="_blank">Yeni Sekme</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAdding(null)} className="flex-1 py-2.5 rounded-xl border border-[#E7E2D8] text-[#444444] hover:text-[#111111] text-sm font-medium transition-colors">İptal</button>
              <button onClick={saveAdd} className="flex-1 py-2.5 rounded-xl bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white text-sm font-semibold transition-colors">Ekle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
