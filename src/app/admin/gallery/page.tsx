"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Album = {
  id: string; title: string; slug: string;
  description?: string | null; coverImage?: string | null;
  isPublic: boolean; order: number;
  _count?: { images: number };
};

type PanelState = { open: boolean; mode: "create" | "edit"; album: Album | null };

const EMPTY: Omit<Album, "id" | "_count"> = {
  title: "", slug: "", description: "", coverImage: "", isPublic: true, order: 0,
};

function slugify(text: string) {
  const MAP: Record<string, string> = { ğ:"g",Ğ:"G",ü:"u",Ü:"U",ş:"s",Ş:"S",ı:"i",İ:"I",ö:"o",Ö:"O",ç:"c",Ç:"C" };
  return text.split("").map(c => MAP[c] ?? c).join("").toLowerCase()
    .replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-");
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<PanelState>({ open: false, mode: "create", album: null });
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetch("/api/gallery/albums?userId=me")
      .then(r => r.json())
      .then(d => setAlbums(d.albums ?? []))
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY });
    setPanel({ open: true, mode: "create", album: null });
  };

  const openEdit = (album: Album) => {
    setForm({ title: album.title, slug: album.slug, description: album.description ?? "", coverImage: album.coverImage ?? "", isPublic: album.isPublic, order: album.order });
    setPanel({ open: true, mode: "edit", album });
  };

  const closePanel = () => setPanel(p => ({ ...p, open: false }));

  const setField = (k: keyof typeof form, v: string | boolean) =>
    setForm(p => ({ ...p, [k]: v, ...(k === "title" && panel.mode === "create" ? { slug: slugify(v as string) } : {}) }));

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      const isEdit = panel.mode === "edit" && panel.album;
      const url = isEdit ? `/api/gallery/albums/${panel.album!.id}` : "/api/gallery/albums";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (isEdit) {
        setAlbums(prev => prev.map(a => a.id === panel.album!.id ? { ...a, ...data.album } : a));
        showToast("Albüm güncellendi");
      } else {
        setAlbums(prev => [data.album, ...prev]);
        showToast("Albüm oluşturuldu");
      }
      closePanel();
    } catch {
      showToast("Hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const deleteAlbum = async (album: Album) => {
    if (!window.confirm(`"${album.title}" albümü silinecek. Emin misiniz?`)) return;
    await fetch(`/api/gallery/albums/${album.id}`, { method: "DELETE" });
    setAlbums(prev => prev.filter(a => a.id !== album.id));
    showToast("Albüm silindi");
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-amber-500/40 text-amber-400 px-4 py-2.5 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Galeri Yönetimi</h1>
          <p className="text-sm text-slate-400 mt-0.5">{albums.length} albüm</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Yeni Albüm
        </button>
      </div>

      {/* Albums grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 rounded-2xl bg-slate-800/40 animate-pulse" />)}
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-slate-400 font-medium">Henüz albüm yok</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 text-sm text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-colors">
            İlk Albümü Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map(album => (
            <div key={album.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 transition-colors group">
              <div className="aspect-video bg-slate-700 relative overflow-hidden">
                {album.coverImage ? (
                  <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-slate-600">🖼️</div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${album.isPublic ? "bg-green-500/20 text-green-400" : "bg-slate-600/80 text-slate-300"}`}>
                    {album.isPublic ? "Yayında" : "Gizli"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-sm leading-tight">{album.title}</h3>
                  <span className="text-xs text-slate-500 flex-shrink-0">{album._count?.images ?? 0} foto</span>
                </div>
                {album.description && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{album.description}</p>}
                <div className="flex gap-2">
                  <Link href={`/admin/gallery/${album.id}`} className="flex-1 text-center text-xs px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors">
                    Fotoğraflar
                  </Link>
                  <button onClick={() => openEdit(album)} className="px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 text-xs transition-colors">
                    Düzenle
                  </button>
                  <button onClick={() => deleteAlbum(album)} className="px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs transition-colors">
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Right panel */}
      {panel.open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={closePanel} />
          <div className="relative w-96 bg-[#0F172A] border-l border-slate-700/50 h-full overflow-y-auto flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
              <h2 className="font-bold text-white text-sm">
                {panel.mode === "create" ? "Yeni Albüm" : "Albümü Düzenle"}
              </h2>
              <button onClick={closePanel} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="flex-1 px-5 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Başlık *</label>
                <input value={form.title} onChange={e => setField("title", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Slug</label>
                <input value={form.slug} onChange={e => setField("slug", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 text-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 font-mono" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Kapak Görseli URL</label>
                <input value={form.coverImage ?? ""} onChange={e => setField("coverImage", e.target.value)}
                  placeholder="https://..." className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Açıklama</label>
                <textarea value={form.description ?? ""} onChange={e => setField("description", e.target.value)}
                  rows={3} className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Sıra</label>
                <input type="number" value={form.order} onChange={e => setField("order", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setField("isPublic", !form.isPublic)}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${form.isPublic ? "bg-amber-500" : "bg-slate-600"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${form.isPublic ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-slate-300">Yayında (herkese görünür)</span>
              </label>
            </div>
            <div className="px-5 py-4 border-t border-slate-700/50">
              <button onClick={save} disabled={saving || !form.title}
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold text-sm transition-colors">
                {saving ? "Kaydediliyor…" : panel.mode === "create" ? "Albüm Oluştur" : "Değişiklikleri Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
