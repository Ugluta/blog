"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  image?: string | null;
  parentId?: string | null;
  order: number;
  isActive: boolean;
  categoryType: string;
  children?: Category[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, { label: string; icon: string; apiType: string }> = {
  haber:         { label: "Haber Kategorileri",           icon: "📰", apiType: "news" },
  blog:          { label: "Blog Kategorileri",            icon: "✍️", apiType: "blog" },
  "kod-ornekleri": { label: "Kod Örnekleri Kategorileri", icon: "💻", apiType: "code" },
  urunler:       { label: "Ürün & Hizmet Kategorileri",   icon: "🛍️", apiType: "product" },
  galeri:        { label: "Galeri Kategorileri",          icon: "🖼️", apiType: "gallery" },
};

const PRESET_ICONS = ["📰", "✍️", "💻", "🛍️", "🖼️", "📂", "🏷️", "⭐"];
const PRESET_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"];

const INPUT_CLS = "w-full bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]";

// ─── Slug helper ──────────────────────────────────────────────────────────────

function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ş/g, "s")
    .replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ─── Build tree ───────────────────────────────────────────────────────────────

function buildTree(flat: Category[]): Category[] {
  const map: Record<string, Category> = {};
  flat.forEach((c) => { map[c.id] = { ...c, children: [] }; });
  const roots: Category[] = [];
  flat.forEach((c) => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].children!.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
}

// ─── Empty form ───────────────────────────────────────────────────────────────

function emptyForm(defaultParentId?: string): Partial<Category> {
  return { name: "", slug: "", description: "", icon: "", color: "", image: "", parentId: defaultParentId || null, order: 0, isActive: true };
}

// ─── Row component ────────────────────────────────────────────────────────────

function CategoryRow({
  cat,
  depth,
  flatList,
  onEdit,
  onAddChild,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  cat: Category;
  depth: number;
  flatList: Category[];
  onEdit: (c: Category) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (c: Category) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (targetId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = (cat.children?.length ?? 0) > 0;

  return (
    <>
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[#EBF2FA] group"
        style={{ paddingLeft: `${12 + depth * 24}px` }}
        draggable
        onDragStart={() => onDragStart(cat.id)}
        onDragOver={onDragOver}
        onDrop={() => onDrop(cat.id)}
      >
        {/* Drag handle */}
        <span className="cursor-grab text-[#666666] select-none text-lg leading-none">⠿</span>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-5 h-5 flex items-center justify-center text-[#666666] hover:text-[#444444] text-xs flex-shrink-0"
        >
          {hasChildren ? (expanded ? "▼" : "▶") : <span className="w-3" />}
        </button>

        {/* Icon */}
        <span className="text-base w-6 text-center flex-shrink-0">{cat.icon || "📂"}</span>

        {/* Name + slug */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-[#111111] text-sm">{cat.name}</span>
          <span className="ml-2 text-[#666666] text-xs">{cat.slug}</span>
          {cat.description && (
            <span className="ml-2 text-[#666666] text-xs truncate hidden sm:inline">
              — {cat.description.substring(0, 60)}{cat.description.length > 60 ? "…" : ""}
            </span>
          )}
        </div>

        {/* Order badge */}
        <span className="text-xs bg-[#EBF2FA] text-[#666666] px-1.5 py-0.5 rounded font-mono">{cat.order}</span>

        {/* Color swatch */}
        {cat.color && (
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
        )}

        {/* Active badge */}
        <span className={`text-xs px-1.5 py-0.5 rounded ${cat.isActive ? "bg-green-100 text-green-700" : "bg-[#EBF2FA] text-[#666666]"}`}>
          {cat.isActive ? "Aktif" : "Pasif"}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(cat)}
            className="text-xs px-2 py-1 bg-[#EBF2FA] text-[#3A6EA8] hover:bg-[#EBF2FA] rounded"
          >
            Düzenle
          </button>
          <button
            onClick={() => onAddChild(cat.id)}
            className="text-xs px-2 py-1 bg-[#EBF2FA] text-[#444444] hover:bg-[#E7E2D8] rounded"
          >
            +Alt
          </button>
          <button
            onClick={() => onDelete(cat)}
            className="text-xs px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded"
          >
            Sil
          </button>
        </div>
      </div>

      {hasChildren && expanded &&
        cat.children!.map((child) => (
          <CategoryRow
            key={child.id}
            cat={child}
            depth={depth + 1}
            flatList={flatList}
            onEdit={onEdit}
            onAddChild={onAddChild}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))
      }
    </>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────────

function SidePanel({
  open,
  form,
  setForm,
  flatList,
  apiType,
  onSave,
  onClose,
  isSaving,
}: {
  open: boolean;
  form: Partial<Category>;
  setForm: (f: Partial<Category>) => void;
  flatList: Category[];
  apiType: string;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const isEdit = Boolean(form.id);

  function set(key: keyof Category, value: unknown) {
    setForm({ ...form, [key]: value });
  }

  function handleNameChange(name: string) {
    setForm({ ...form, name, slug: toSlug(name) });
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-96 bg-[#FFFFFF] border-l border-[#E7E2D8] flex flex-col shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E2D8]">
        <h3 className="font-bold text-[#111111]">{isEdit ? "Kategoriyi Düzenle" : "Yeni Kategori"}</h3>
        <button onClick={onClose} className="text-[#666666] hover:text-[#111111]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Ad *</label>
          <input
            type="text"
            value={form.name || ""}
            onChange={(e) => handleNameChange(e.target.value)}
            className={INPUT_CLS}
            placeholder="Kategori adı"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Slug</label>
          <input
            type="text"
            value={form.slug || ""}
            onChange={(e) => set("slug", e.target.value)}
            className={INPUT_CLS}
            placeholder="kategori-slug"
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">İkon (emoji)</label>
          <input
            type="text"
            value={form.icon || ""}
            onChange={(e) => set("icon", e.target.value)}
            className={INPUT_CLS}
            placeholder="📰"
          />
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {PRESET_ICONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => set("icon", emoji)}
                className={`w-8 h-8 rounded flex items-center justify-center text-lg transition-colors ${form.icon === emoji ? "bg-[#EBF2FA] ring-1 ring-[#3A6EA8]" : "bg-[#FFFFFF] hover:bg-[#EBF2FA]"}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Renk</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => set("color", c)}
                className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? "ring-2 ring-white scale-110" : "hover:scale-105"}`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
            <input
              type="text"
              value={form.color || ""}
              onChange={(e) => set("color", e.target.value)}
              className="flex-1 min-w-[80px] bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#3A6EA8]"
              placeholder="#hex"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Görsel URL</label>
          <input
            type="text"
            value={form.image || ""}
            onChange={(e) => set("image", e.target.value)}
            className={INPUT_CLS}
            placeholder="https://..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Açıklama</label>
          <textarea
            rows={3}
            value={form.description || ""}
            onChange={(e) => set("description", e.target.value)}
            className={INPUT_CLS}
            placeholder="Kategori açıklaması..."
          />
        </div>

        {/* Parent */}
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Üst Kategori</label>
          <select
            value={form.parentId || ""}
            onChange={(e) => set("parentId", e.target.value || null)}
            className={INPUT_CLS}
          >
            <option value="">— Kök Kategori —</option>
            {flatList
              .filter((c) => c.id !== form.id)
              .map((c) => (
                <option key={c.id} value={c.id}>{c.icon || "📂"} {c.name}</option>
              ))}
          </select>
        </div>

        {/* Order */}
        <div>
          <label className="block text-xs font-medium text-[#666666] mb-1.5">Sıra</label>
          <input
            type="number"
            value={form.order ?? 0}
            onChange={(e) => set("order", parseInt(e.target.value) || 0)}
            className={INPUT_CLS}
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#666666]">Aktif</label>
          <button
            onClick={() => set("isActive", !form.isActive)}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? "bg-[#3A6EA8]" : "bg-[#E7E2D8]"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>

        {/* Hidden apiType */}
        <input type="hidden" value={apiType} />
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#E7E2D8] flex gap-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 py-2 bg-[#3A6EA8] hover:bg-[#2D5A8E] disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors"
        >
          {isSaving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#111111] rounded-lg text-sm transition-colors"
        >
          İptal
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CategoryTypePage() {
  const params = useParams<{ type: string }>();
  const typeSlug = params.type;
  const meta = TYPE_LABELS[typeSlug] || { label: "Kategoriler", icon: "📂", apiType: typeSlug };

  const [flatList, setFlatList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState<Partial<Category>>(emptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const dragId = useRef<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories?type=${meta.apiType}`);
      const data = await res.json();
      setFlatList(data.categories || []);
    } catch {
      setFlatList([]);
    } finally {
      setLoading(false);
    }
  }, [meta.apiType]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const tree = buildTree(flatList);

  function openNew(parentId?: string) {
    setForm({ ...emptyForm(parentId), categoryType: meta.apiType });
    setPanelOpen(true);
  }

  function openEdit(cat: Category) {
    setForm({ ...cat });
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.name?.trim()) return;
    setIsSaving(true);
    try {
      const isEdit = Boolean(form.id);
      const url = isEdit ? `/api/admin/categories/${form.id}` : "/api/admin/categories";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, categoryType: meta.apiType }),
      });
      if (res.ok) {
        await fetchCategories();
        setPanelOpen(false);
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(cat: Category) {
    if (!window.confirm(`"${cat.name}" kategorisini silmek istediğinizden emin misiniz?`)) return;
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchCategories();
    } else {
      const data = await res.json();
      alert(data.error || "Silme işlemi başarısız.");
    }
  }

  function onDragStart(id: string) { dragId.current = id; }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); }
  async function onDrop(targetId: string) {
    if (!dragId.current || dragId.current === targetId) return;
    const dragged = flatList.find((c) => c.id === dragId.current);
    const target = flatList.find((c) => c.id === targetId);
    if (!dragged || !target) return;

    // Move dragged item to be a sibling of target (same parent level), swap orders
    const items = flatList
      .filter((c) => c.parentId === target.parentId)
      .sort((a, b) => a.order - b.order)
      .map((c, i) => ({ id: c.id, order: i, parentId: c.parentId }));

    // Re-assign dragged to target's parent
    const payload = [
      ...items,
      { id: dragged.id, order: target.order, parentId: target.parentId },
    ];

    await fetch("/api/admin/categories/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload }),
    });
    dragId.current = null;
    await fetchCategories();
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111111] flex items-center gap-2">
            <span>{meta.icon}</span>
            {meta.label}
            <span className="text-sm font-normal bg-[#EBF2FA] text-[#444444] px-2 py-0.5 rounded-full ml-1">
              {flatList.length}
            </span>
          </h1>
          <p className="text-sm text-[#666666] mt-0.5">Sürükleyerek yeniden sıralayın, düzenle/sil için satırın üzerine gelin.</p>
        </div>
        <button
          onClick={() => openNew()}
          className="px-4 py-2 bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-1.5"
        >
          <span className="text-base">+</span> Yeni Kök Kategori Ekle
        </button>
      </div>

      {/* Tree */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E7E2D8] overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-[#EBF2FA] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : flatList.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">{meta.icon}</div>
            <p className="text-[#666666] font-medium">Henüz kategori yok</p>
            <p className="text-[#666666] text-sm mt-1">Yukarıdaki butona tıklayarak ilk kategoriyi oluşturun.</p>
          </div>
        ) : (
          <div className="py-2">
            {tree.map((cat) => (
              <CategoryRow
                key={cat.id}
                cat={cat}
                depth={0}
                flatList={flatList}
                onEdit={openEdit}
                onAddChild={(parentId) => openNew(parentId)}
                onDelete={handleDelete}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
              />
            ))}
          </div>
        )}
      </div>

      {/* Side Panel */}
      <SidePanel
        open={panelOpen}
        form={form}
        setForm={setForm}
        flatList={flatList}
        apiType={meta.apiType}
        onSave={handleSave}
        onClose={() => setPanelOpen(false)}
        isSaving={isSaving}
      />

      {/* Overlay */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}
