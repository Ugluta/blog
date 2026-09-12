"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type GalleryImage = {
  id: string; url: string; thumbnailUrl?: string | null;
  title?: string | null; order: number;
};

type Album = { id: string; title: string; slug: string };

export default function UserAlbumPage() {
  const params = useParams();
  const id = params.id as string;

  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetch(`/api/gallery/albums/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.album) { setAlbum(d.album); setImages(d.album.images ?? []); }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      await addImage(url);
    } catch { showToast("Yükleme başarısız"); } finally { setUploading(false); }
  };

  const addImage = async (url: string) => {
    const res = await fetch(`/api/gallery/albums/${id}/images`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, order: images.length }),
    });
    if (res.ok) { const d = await res.json(); setImages(p => [...p, d.image]); showToast("Fotoğraf eklendi"); }
  };

  const deleteImage = async (imgId: string) => {
    await fetch(`/api/gallery/images/${imgId}`, { method: "DELETE" });
    setImages(p => p.filter(i => i.id !== imgId));
    showToast("Silindi");
  };

  const saveOrder = useCallback(async (ordered: GalleryImage[]) => {
    await fetch(`/api/gallery/albums/${id}/reorder`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: ordered.map((img, idx) => ({ id: img.id, order: idx })) }),
    });
  }, [id]);

  const handleDragStart = (imgId: string) => setDragId(imgId);
  const handleDragEnter = (imgId: string) => setOverId(imgId);
  const handleDragEnd = () => {
    if (dragId && overId && dragId !== overId) {
      setImages(prev => {
        const arr = [...prev];
        const fromIdx = arr.findIndex(i => i.id === dragId);
        const toIdx = arr.findIndex(i => i.id === overId);
        const [moved] = arr.splice(fromIdx, 1);
        arr.splice(toIdx, 0, moved);
        saveOrder(arr);
        return arr;
      });
    }
    setDragId(null); setOverId(null);
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-[#3A6EA8]/40 text-[#3A6EA8] px-4 py-2.5 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link href="/uygulama/galeri" className="text-[#666666] hover:text-[#3A6EA8] text-sm">← Geri</Link>
        {album && (
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#111111]">{album.title}</h1>
              <p className="text-xs text-[#666666]">{images.length} fotoğraf</p>
            </div>
            <Link href={`/galeri/${album.slug}`} target="_blank" className="text-xs text-[#3A6EA8] hover:text-[#2D5A8E] border border-[#3A6EA8]/30 px-3 py-1.5 rounded-lg transition-colors">
              Önizle ↗
            </Link>
          </div>
        )}
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); Array.from(e.dataTransfer.files).forEach(uploadFile); }}
        className="border-2 border-dashed border-[#E7E2D8] hover:border-[#B5CDE8] rounded-2xl p-8 text-center transition-colors"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-3 text-[#3A6EA8]">
            <div className="w-5 h-5 border-2 border-[#3A6EA8]/30 border-t-[#3A6EA8] rounded-full animate-spin" />
            <span className="text-sm">Yükleniyor…</span>
          </div>
        ) : (
          <>
            <p className="text-2xl mb-2">📷</p>
            <p className="text-[#666666] text-sm">Sürükle bırak veya</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={() => fileRef.current?.click()} className="px-4 py-2 text-xs font-semibold bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white rounded-lg transition-colors">
                Dosya Seç
              </button>
              <button onClick={() => setShowUrl(!showUrl)} className="px-4 py-2 text-xs font-semibold bg-[#EBF2FA] hover:bg-[#B5CDE8] text-[#111111] rounded-lg transition-colors">
                URL Ekle
              </button>
            </div>
            {showUrl && (
              <div className="flex gap-2 mt-3 max-w-sm mx-auto">
                <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { addImage(urlInput); setUrlInput(""); setShowUrl(false); } }}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 bg-white border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3A6EA8]" />
                <button onClick={() => { addImage(urlInput); setUrlInput(""); setShowUrl(false); }}
                  className="px-3 py-2 text-xs bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white rounded-lg font-semibold">Ekle</button>
              </div>
            )}
          </>
        )}
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => Array.from(e.target.files ?? []).forEach(uploadFile)} />
      </div>

      {/* Images with drag-to-reorder */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square rounded-xl bg-white animate-pulse" />)}
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-[#666666] py-8">Henüz fotoğraf yok</p>
      ) : (
        <>
          <p className="text-xs text-[#666666]">Sıralamak için sürükleyin</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map(img => (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleDragStart(img.id)}
                onDragEnter={() => handleDragEnter(img.id)}
                onDragEnd={handleDragEnd}
                onDragOver={e => e.preventDefault()}
                className={`group relative aspect-square rounded-xl overflow-hidden bg-white cursor-grab active:cursor-grabbing transition-all ${
                  overId === img.id && dragId !== img.id ? "ring-2 ring-[#3A6EA8] scale-95" : ""
                } ${dragId === img.id ? "opacity-40" : ""}`}
              >
                <img src={img.thumbnailUrl ?? img.url} alt={img.title ?? ""} className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => deleteImage(img.id)} className="px-3 py-1.5 text-xs bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors">
                    Sil
                  </button>
                </div>
                <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-5 h-5 bg-black/50 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-16a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                  </div>
                </div>
                {img.title && <p className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-1 truncate">{img.title}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
