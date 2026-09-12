"use client";

import { useState } from "react";
import { defaultSettings, type NavMenuItem } from "@/lib/siteSettings";

let nextId = 100;

export default function HeaderMenuManager() {
  const [items, setItems] = useState<NavMenuItem[]>(defaultSettings.navigation.headerMenu);
  const [saved, setSaved] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const addItem = () => {
    setItems((prev) => [...prev, { id: `item-${nextId++}`, label: "Yeni Menü", href: "/" }]);
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const update = (id: string, field: keyof NavMenuItem, value: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, [field]: value } : i));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setItems(next);
  };

  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setItems(next);
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111111]">Header Menü Yönetimi</h1>
          <p className="text-sm text-[#666666] mt-0.5">Sürükle-bırak ile sıralayın, düzenleyin veya silin</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={addItem} className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#111111] transition-colors">
            + Öğe Ekle
          </button>
          <button onClick={save} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-500 text-white" : "bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white"}`}>
            {saved ? "✓ Kaydedildi" : "Kaydet"}
          </button>
        </div>
      </div>

      <section className="bg-[#FFFFFF] rounded-xl border border-[#E7E2D8] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E7E2D8] bg-[#FFFFFF]">
          <div className="grid grid-cols-[32px_1fr_1fr_100px_80px] gap-3 text-[10px] font-bold uppercase tracking-wider text-[#666666]">
            <span></span>
            <span>Başlık</span>
            <span>URL / Hedef</span>
            <span>Hedef</span>
            <span className="text-right">İşlem</span>
          </div>
        </div>
        <div className="divide-y divide-[#E7E2D8]">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIdx === null || dragIdx === idx) return;
                const next = [...items];
                const [moved] = next.splice(dragIdx, 1);
                next.splice(idx, 0, moved);
                setItems(next);
                setDragIdx(null);
              }}
              className="grid grid-cols-[32px_1fr_1fr_100px_80px] gap-3 items-center px-5 py-3 hover:bg-[#EBF2FA] transition-colors"
            >
              {/* Drag handle */}
              <div className="flex flex-col gap-0.5 cursor-grab active:cursor-grabbing items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-4 h-0.5 bg-[#E7E2D8] rounded" />
                ))}
              </div>

              {/* Label */}
              <input
                value={item.label}
                onChange={(e) => update(item.id, "label", e.target.value)}
                className="bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#3A6EA8]"
              />

              {/* Href */}
              <input
                value={item.href}
                onChange={(e) => update(item.id, "href", e.target.value)}
                className="bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-[#3A6EA8]"
              />

              {/* Target */}
              <select
                value={item.target || "_self"}
                onChange={(e) => update(item.id, "target", e.target.value)}
                className="bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#3A6EA8]"
              >
                <option value="_self">Aynı Sayfa</option>
                <option value="_blank">Yeni Sekme</option>
              </select>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => moveUp(idx)} disabled={idx === 0} className="w-6 h-6 rounded hover:bg-[#E7E2D8] disabled:opacity-30 text-[#666666] flex items-center justify-center text-xs">↑</button>
                <button onClick={() => moveDown(idx)} disabled={idx === items.length - 1} className="w-6 h-6 rounded hover:bg-[#E7E2D8] disabled:opacity-30 text-[#666666] flex items-center justify-center text-xs">↓</button>
                <button onClick={() => remove(item.id)} className="w-6 h-6 rounded hover:bg-red-100 text-[#666666] hover:text-red-700 flex items-center justify-center text-xs">✕</button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="py-12 text-center text-[#666666] text-sm">
            Menü öğesi yok. &quot;+ Öğe Ekle&quot; ile başlayın.
          </div>
        )}
      </section>

      <div className="bg-[#FFFFFF] rounded-xl border border-[#E7E2D8] p-4">
        <p className="text-xs text-[#666666]">
          <span className="text-[#3A6EA8] font-semibold">İpucu:</span> Satırları sürükleyerek sıralayabilirsiniz. Mega menü (dropdown) özelliği için kod düzenleyicide <code className="text-[#3A6EA8] bg-[#FFFFFF] px-1 rounded">megaColumns</code> alanını kullanın.
        </p>
      </div>
    </div>
  );
}
