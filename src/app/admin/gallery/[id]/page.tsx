"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type GalleryImage = {
  id: string; url: string; thumbnailUrl?: string | null;
  title?: string | null; description?: string | null; order: number;
};

type Album = { id: string; title: string; slug: string };

export default function AdminAlbumPage() {
  const params = useParams();
  const id = params.id as string;

  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetch(`/api/gallery/albums/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.album) {
          setAlbum({ id: d.album.id, title: d.album.title, slug: d.album.slug });
          setImages(d.album.images ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Yükleme hatası");
      const { url } = await res.json();
      await addImage(url);
    } catch {
      showToast("Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  const addImage = async (url: string) => {
    const res = await fetch(`/api/gallery/albums/${id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, order: images.length }),
    });
    if (res.ok) {
      const data = await res.json();
      setImages(prev => [...prev, data.image]);
      showToast("Fotoğraf eklendi");
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(f => uploadFile(f));
  };

  const addByUrl = async () => {
    if (!urlInput.trim()) return;
    await addImage(urlInput.trim());
    setUrlInput("");
    setShowUrlInput(false);
  };

  const deleteImage = async (imgId: string) => {
    await fetch(`/api/gallery/images/${imgId}`, { method: "DELETE" });
    setImages(prev => prev.filter(i => i.id !== imgId));
    showToast("Fotoğraf silindi");
  };

  const saveTitle = async (imgId: string) => {
    await fetch(`/api/gallery/images/${imgId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });
    setImages(prev => prev.map(i => i.id === imgId ? { ...i, title: editTitle } : i));
    setEditingId(null);
    showToast("Başlık güncellendi");
  };

  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-5 max-w-5xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#FFFFFF] border border-[#3A6EA8]/40 text-[#3A6EA8] px-4 py-2.5 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery" className="text-[#666666] hover:text-[#3A6EA8] transition-colors text-sm flex items-center gap-1">
          ← Galeriye Dön
        </Link>
        {album && (
          <div>
            <h1 className="text-xl font-bold text-[#111111]">{album.title}</h1>
            <p className="text-xs text-[#666666]">{images.length} fotoğraf</p>
          </div>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${dragOver ? "border-[#3A6EA8] bg-[#EBF2FA]" : "border-[#E7E2D8] hover:border-[#E7E2D8]"}`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-3 text-[#3A6EA8]">
            <div className="w-5 h-5 border-2 border-[#3A6EA8]/30 border-t-[#3A6EA8] rounded-full animate-spin" />
            <span className="text-sm">Yükleniyor…</span>
          </div>
        ) : (
          <>
            <p className="text-3xl mb-2">📷</p>
            <p className="text-[#444444] font-medium text-sm">Dosyaları buraya sürükleyin</p>
            <p className="text-[#666666] text-xs mt-1">veya</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 text-xs font-semibold bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white rounded-lg transition-colors"
              >
                Dosya Seç
              </button>
              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-4 py-2 text-xs font-semibold bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#111111] rounded-lg transition-colors"
              >
                URL ile Ekle
              </button>
            </div>
            {showUrlInput && (
              <div className="flex gap-2 mt-3 max-w-md mx-auto">
                <input
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addByUrl()}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3A6EA8]"
                />
                <button onClick={addByUrl} className="px-3 py-2 text-xs bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white rounded-lg font-semibold">Ekle</button>
              </div>
            )}
          </>
        )}
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Images grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square rounded-xl bg-[#FFFFFF] animate-pulse" />)}
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-[#666666] py-8">Henüz fotoğraf yok. Yukarıdan ekleyin.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map(img => (
            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-[#FFFFFF] border border-[#E7E2D8]">
              <img src={img.thumbnailUrl ?? img.url} alt={img.title ?? ""} className="w-full h-full object-cover" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                {editingId === img.id ? (
                  <div className="w-full" onClick={e => e.stopPropagation()}>
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveTitle(img.id); if (e.key === "Escape") setEditingId(null); }}
                      className="w-full bg-[#FFFFFF] border border-[#3A6EA8] text-[#111111] text-xs rounded px-2 py-1 focus:outline-none"
                      autoFocus
                    />
                    <button onClick={() => saveTitle(img.id)} className="mt-1 w-full text-[10px] bg-[#3A6EA8] text-white rounded py-0.5 font-bold">Kaydet</button>
                  </div>
                ) : (
                  <>
                    {img.title && <p className="text-[#111111] text-xs text-center leading-tight">{img.title}</p>}
                    <button
                      onClick={() => { setEditingId(img.id); setEditTitle(img.title ?? ""); }}
                      className="text-xs px-2 py-1 bg-[#EBF2FA] hover:bg-[#EBF2FA] text-[#444444] hover:text-[#3A6EA8] rounded transition-colors"
                    >
                      ✏ Başlık
                    </button>
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="text-xs px-2 py-1 bg-[#EBF2FA] hover:bg-red-100 text-[#444444] hover:text-red-700 rounded transition-colors"
                    >
                      🗑 Sil
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
