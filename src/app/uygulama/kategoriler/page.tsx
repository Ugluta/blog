"use client";

import { useState, useEffect, useCallback } from "react";
import { slugify } from "@/lib/slugify";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  image: string | null;
  parentId: string | null;
  order: number;
  isActive: boolean;
  _count: { children: number; posts: number; contentItems: number };
}

interface TreeNode extends Category {
  depth: number;
  children: TreeNode[];
}

function buildTree(flat: Category[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  flat.forEach((c) => map.set(c.id, { ...c, depth: 0, children: [] }));
  const roots: TreeNode[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      const parent = map.get(node.parentId)!;
      node.depth = parent.depth + 1;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });
  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "tr"));
    nodes.forEach((n) => sort(n.children));
  };
  sort(roots);
  return roots;
}

function flattenTree(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  const walk = (list: TreeNode[]) => list.forEach((n) => { result.push(n); walk(n.children); });
  walk(nodes);
  return result;
}

interface FormState {
  name: string;
  slug: string;
  slugLocked: boolean;
  description: string;
  icon: string;
  color: string;
  image: string;
  parentId: string;
  order: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  name: "", slug: "", slugLocked: false, description: "",
  icon: "", color: "#6366f1", image: "",
  parentId: "", order: "0", isActive: true,
};

const PRESET_ICONS = [
  "📰","💼","🌐","📊","🏆","💡","🔬","🎨","🎬","🎵",
  "🏥","📱","💻","🤖","🌍","⚽","🚀","🏛️","📚","🛒",
  "🌿","🍽️","✈️","🏠","💰","🎓","🔒","📷","🎮","⚡",
];

const PRESET_COLORS = [
  "#f59e0b","#ef4444","#3b82f6","#10b981","#8b5cf6",
  "#ec4899","#f97316","#14b8a6","#6366f1","#84cc16",
  "#06b6d4","#a855f7","#e11d48","#0ea5e9","#64748b",
];

export default function KategorilerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "add" | "edit">(null);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/categories").catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setCategories(data.categories ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const tree = buildTree(categories);
  const flat = flattenTree(tree);
  const rootCats = categories.filter((c) => !c.parentId);

  const openAdd = (parentId?: string) => {
    setForm({ ...EMPTY_FORM, parentId: parentId ?? "" });
    setEditTarget(null);
    setError("");
    setModal("add");
  };

  const openEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      slugLocked: true,
      description: cat.description ?? "",
      icon: cat.icon ?? "",
      color: cat.color ?? "#6366f1",
      image: cat.image ?? "",
      parentId: cat.parentId ?? "",
      order: String(cat.order),
      isActive: cat.isActive,
    });
    setEditTarget(cat);
    setError("");
    setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditTarget(null); setError(""); };

  const updateName = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: f.slugLocked ? f.slug : slugify(name),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Kategori adı zorunludur."); return; }
    setSaving(true);
    setError("");

    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
      color: form.color || null,
      image: form.image.trim() || null,
      parentId: form.parentId || null,
      order: Number(form.order) || 0,
      isActive: form.isActive,
    };

    let res: Response | null = null;
    if (modal === "add") {
      res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(() => null);
    } else if (modal === "edit" && editTarget) {
      res = await fetch(`/api/categories/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(() => null);
    }

    if (!res?.ok) {
      const data = await res?.json().catch(() => null);
      setError(data?.error ?? "Bir hata oluştu.");
    } else {
      closeModal();
      await load();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/categories/${deleteConfirm.id}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) {
      const data = await res?.json().catch(() => null);
      alert(data?.error ?? "Silinemedi.");
    } else {
      setDeleteConfirm(null);
      await load();
    }
    setDeleteLoading(false);
  };

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isHidden = (node: TreeNode) => {
    let pid = node.parentId;
    while (pid) {
      if (collapsed.has(pid)) return true;
      pid = categories.find((c) => c.id === pid)?.parentId ?? null;
    }
    return false;
  };

  const CategoryIcon = ({ cat, size = "md" }: { cat: Pick<Category, "icon" | "color" | "name">; size?: "sm" | "md" | "lg" }) => {
    const sz = size === "sm" ? "w-6 h-6 text-xs" : size === "lg" ? "w-10 h-10 text-xl" : "w-8 h-8 text-sm";
    return (
      <div
        className={`${sz} rounded-lg flex items-center justify-center flex-shrink-0 font-medium`}
        style={{ backgroundColor: (cat.color ?? "#6366f1") + "20", color: cat.color ?? "#6366f1" }}
      >
        {cat.icon || cat.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Kategoriler</h1>
          <p className="text-slate-400 text-sm mt-0.5">Sonsuz alt kategori destekli içerik sınıflandırması</p>
        </div>
        <button
          onClick={() => openAdd()}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kategori
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Toplam", value: categories.length, icon: "🗂️" },
          { label: "Ana Kategori", value: rootCats.length, icon: "📁" },
          { label: "Alt Kategori", value: categories.length - rootCats.length, icon: "📂" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tree */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Kategori Ağacı</span>
          {flat.some((n) => n.children.length > 0) && (
            <div className="flex gap-2">
              <button
                onClick={() => setCollapsed(new Set())}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                Tümünü Aç
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={() => setCollapsed(new Set(flat.filter((n) => n.children.length > 0).map((n) => n.id)))}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                Tümünü Kapat
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-6 h-6 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : flat.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🗂️</div>
            <p className="text-slate-400 text-sm font-medium mb-1">Henüz kategori eklenmedi</p>
            <p className="text-slate-500 text-xs mb-4">İçeriklerinizi organize etmek için kategori oluşturun</p>
            <button
              onClick={() => openAdd()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 rounded-xl text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              İlk kategoriyi ekle
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {flat.map((node) => {
              if (isHidden(node)) return null;
              const isCollapsed = collapsed.has(node.id);
              const hasChildren = node.children.length > 0;
              const totalContent = node._count.posts + node._count.contentItems;

              return (
                <div
                  key={node.id}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-700/20 transition-colors group"
                  style={{ paddingLeft: `${16 + node.depth * 24}px` }}
                >
                  {/* Collapse toggle */}
                  <button
                    onClick={() => hasChildren && toggleCollapse(node.id)}
                    className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded transition-colors ${
                      hasChildren
                        ? "text-slate-500 hover:text-amber-400 hover:bg-amber-400/10"
                        : "invisible"
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 transition-transform duration-150 ${isCollapsed ? "-rotate-90" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Tree indent line */}
                  {node.depth > 0 && (
                    <div className="w-4 flex-shrink-0 flex items-center justify-end">
                      <div className="w-3 h-px bg-slate-600/50" />
                    </div>
                  )}

                  {/* Icon */}
                  <CategoryIcon cat={node} size="sm" />

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className={`text-sm font-medium truncate ${node.isActive ? "text-white" : "text-slate-500"}`}>
                      {node.name}
                    </span>
                    {!node.isActive && (
                      <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-md flex-shrink-0">Pasif</span>
                    )}
                    <span className="text-xs text-slate-600 font-mono hidden sm:block truncate">/{node.slug}</span>
                  </div>

                  {/* Counts */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    {hasChildren && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-700/40 px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        {node._count.children}
                      </span>
                    )}
                    {totalContent > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-700/40 px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {totalContent}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => openAdd(node.id)}
                      title="Alt kategori ekle"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openEdit(node)}
                      title="Düzenle"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(node)}
                      title="Sil"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50 flex-shrink-0">
              <h2 className="font-bold text-white">
                {modal === "add"
                  ? form.parentId
                    ? `Alt Kategori Ekle — ${categories.find((c) => c.id === form.parentId)?.name}`
                    : "Yeni Kategori"
                  : "Kategoriyi Düzenle"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
              )}

              {/* Icon + Color + Preview */}
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="flex-shrink-0">
                  <div className="text-xs font-medium text-slate-400 mb-2">Önizleme</div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
                    style={{
                      backgroundColor: (form.color || "#6366f1") + "25",
                      border: `2px solid ${form.color || "#6366f1"}40`,
                      color: form.color || "#6366f1",
                    }}
                  >
                    {form.icon || form.name.charAt(0).toUpperCase() || "?"}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {/* Icon input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Simge (Emoji)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={form.icon}
                        onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                        placeholder="Emoji veya harf"
                        maxLength={4}
                        className="w-24 bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <div className="flex flex-wrap gap-1">
                        {PRESET_ICONS.slice(0, 12).map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, icon: emoji }))}
                            className={`w-7 h-7 rounded-lg text-base hover:bg-slate-600 transition-colors flex items-center justify-center ${form.icon === emoji ? "bg-amber-500/20 ring-1 ring-amber-500/50" : "bg-slate-700/50"}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* More icons */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {PRESET_ICONS.slice(12).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, icon: emoji }))}
                          className={`w-7 h-7 rounded-lg text-base hover:bg-slate-600 transition-colors flex items-center justify-center ${form.icon === emoji ? "bg-amber-500/20 ring-1 ring-amber-500/50" : "bg-slate-700/50"}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Renk</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                        className="w-8 h-8 rounded-lg border border-slate-600 bg-slate-800 cursor-pointer p-0.5"
                      />
                      <div className="flex gap-1.5 flex-wrap">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, color: c }))}
                            className={`w-5 h-5 rounded-full transition-transform hover:scale-125 ${form.color === c ? "ring-2 ring-offset-1 ring-offset-slate-800 ring-white" : ""}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Kategori Adı *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateName(e.target.value)}
                  placeholder="örn. Yapay Zeka"
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  URL Slug
                  <span className="ml-1 text-slate-600 font-normal">(otomatik oluşturulur)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm select-none">/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value), slugLocked: true }))}
                    placeholder="kategori-slug"
                    className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl pl-6 pr-10 py-2.5 text-sm font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                  />
                  <button
                    type="button"
                    title={form.slugLocked ? "Otomatik slug'a dön" : "Slug kilitli"}
                    onClick={() => {
                      if (form.slugLocked) {
                        setForm((f) => ({ ...f, slug: slugify(f.name), slugLocked: false }));
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
                  >
                    {form.slugLocked ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Bu kategorinin içeriğini kısaca açıklayın..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Kapak Görseli URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                />
                {form.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image}
                    alt="Önizleme"
                    className="mt-2 w-full h-28 object-cover rounded-xl border border-slate-700"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>

              {/* Parent + Order + Active */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Üst Kategori</label>
                  <select
                    value={form.parentId}
                    onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="">— Kök —</option>
                    {flat
                      .filter((c) => modal !== "edit" || c.id !== editTarget?.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {"　".repeat(c.depth)}{c.depth > 0 ? "└ " : ""}{c.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Sıra No</label>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? "bg-amber-500" : "bg-slate-600"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isActive ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm text-slate-300">Aktif kategori</span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-5 border-t border-slate-700/50 flex-shrink-0">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors text-sm disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : modal === "add" ? "Kategori Ekle" : "Değişiklikleri Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1E293B] rounded-2xl border border-red-500/30 shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-white">Kategori Silinsin mi?</div>
                <div className="text-sm text-slate-400">{deleteConfirm.name}</div>
              </div>
            </div>

            {(deleteConfirm._count.children > 0 || deleteConfirm._count.posts + deleteConfirm._count.contentItems > 0) ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm mb-4">
                {deleteConfirm._count.children > 0
                  ? `Bu kategorinin ${deleteConfirm._count.children} alt kategorisi var. Önce alt kategorileri silin.`
                  : `Bu kategoride ${deleteConfirm._count.posts + deleteConfirm._count.contentItems} içerik var. Önce içerikleri taşıyın veya silin.`}
              </div>
            ) : (
              <p className="text-slate-400 text-sm mb-4">Bu işlem geri alınamaz. Devam etmek istiyor musunuz?</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                disabled={
                  deleteLoading ||
                  deleteConfirm._count.children > 0 ||
                  deleteConfirm._count.posts + deleteConfirm._count.contentItems > 0
                }
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-40 text-white font-semibold transition-colors text-sm"
              >
                {deleteLoading ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
