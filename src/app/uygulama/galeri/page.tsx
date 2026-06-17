"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Album = {
  id: string; title: string; slug: string;
  description?: string | null; coverImage?: string | null;
  isPublic: boolean; _count?: { images: number };
};

function slugify(text: string) {
  const MAP: Record<string, string> = { ğ:"g",Ğ:"G",ü:"u",Ü:"U",ş:"s",Ş:"S",ı:"i",İ:"I",ö:"o",Ö:"O",ç:"c",Ç:"C" };
  return text.split("").map(c => MAP[c] ?? c).join("").toLowerCase()
    .replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-");
}

export default function UserGaleriPage() {
  const { data: session } = useSession();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", coverImage: "", isPublic: true });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/gallery/albums?userId=${session.user.id}`)
      .then(r => r.json())
      .then(d => setAlbums(d.albums ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const create = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      const res = await fetch("/api/gallery/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: slugify(form.title) }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAlbums(prev => [data.album, ...prev]);
      setShowModal(false);
      setForm({ title: "", description: "", coverImage: "", isPublic: true });
      showToast("Albüm oluşturuldu");
    } catch {
      showToast("Hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const deleteAlbum = async (album: Album) => {
    if (!window.confirm(`"${album.title}" silinsin mi?`)) return;
    await fetch(`/api/gallery/albums/${album.id}`, { method: "DELETE" });
    setAlbums(prev => prev.filter(a => a.id !== album.id));
    showToast("Albüm silindi");
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-amber-500/40 text-amber-400 px-4 py-2.5 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Galeri</h1>
          <p className="text-sm text-slate-400 mt-0.5">Fotoğraf albümleriniz</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Yeni Albüm
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-44 rounded-2xl bg-slate-800/40 animate-pulse" />)}
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <p className="text-5xl mb-3">🖼️</p>
          <p className="text-slate-300 font-semibold">Henüz albüm yok</p>
          <p className="text-slate-500 text-sm mt-1">İlk albümünüzü oluşturun</p>
          <button onClick={() => setShowModal(true)} className="mt-4 px-5 py-2 text-sm bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors">
            Albüm Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {albums.map(album => (
            <div key={album.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-colors">
              <div className="aspect-video bg-slate-700 relative">
                {album.coverImage ? (
                  <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-slate-600">🖼️</div>
                )}
                <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${album.isPublic ? "bg-green-500/20 text-green-400" : "bg-slate-600/80 text-slate-300"}`}>
                  {album.isPublic ? "Herkese Açık" : "Gizli"}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-white">{album.title}</h3>
                  <span className="text-xs text-slate-500">{album._count?.images ?? 0} foto</span>
                </div>
                {album.description && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{album.description}</p>}
                <div className="flex gap-2 mt-3">
                  <Link href={`/uygulama/galeri/${album.id}`} className="flex-1 text-center text-xs py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors">
                    Yönet
                  </Link>
                  <Link href={`/galeri/${album.slug}`} target="_blank" className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 transition-colors">
                    Görüntüle
                  </Link>
                  <button onClick={() => deleteAlbum(album)} className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-red-500/20 text-xs text-slate-400 hover:text-red-400 transition-colors">
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0F172A] border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
              <h3 className="font-bold text-white">Yeni Albüm</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Başlık *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Kapak Görseli URL</label>
                <input value={form.coverImage} onChange={e => setForm(p => ({ ...p, coverImage: e.target.value }))}
                  placeholder="https://..." className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Açıklama</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm(p => ({ ...p, isPublic: !p.isPublic }))}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.isPublic ? "bg-amber-500" : "bg-slate-600"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${form.isPublic ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-slate-300">Herkese açık</span>
              </label>
            </div>
            <div className="px-5 pb-5">
              <button onClick={create} disabled={saving || !form.title}
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold text-sm transition-colors">
                {saving ? "Oluşturuluyor…" : "Albüm Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
