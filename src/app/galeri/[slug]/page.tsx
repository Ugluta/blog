"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type GalleryImage = {
  id: string; url: string; thumbnailUrl?: string | null;
  title?: string | null; description?: string | null; order: number;
};

type Album = {
  id: string; title: string; slug: string;
  description?: string | null; coverImage?: string | null;
  createdAt: string; images: GalleryImage[];
};

const MOCK_IMAGES: GalleryImage[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  url: `https://picsum.photos/seed/gallery${i + 1}/900/600`,
  thumbnailUrl: `https://picsum.photos/seed/gallery${i + 1}/400/280`,
  title: `Fotoğraf ${i + 1}`,
  description: null,
  order: i,
}));

export default function AlbumPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Try by id first then by slug
        const res = await fetch(`/api/gallery/albums/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.album) {
            setAlbum(data.album);
            setImages(data.album.images ?? []);
            return;
          }
        }
      } catch { /* fall through */ }
      // Mock fallback
      setAlbum({
        id: "mock", title: "Örnek Albüm", slug, description: "Galeri önizleme modu",
        coverImage: null, createdAt: new Date().toISOString(), images: MOCK_IMAGES,
      });
      setImages(MOCK_IMAGES);
    };
    load().finally(() => setLoading(false));
  }, [slug]);

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox((i) => (i !== null ? Math.max(0, i - 1) : null)), []);
  const next = useCallback(() => setLightbox((i) => (i !== null ? Math.min(images.length - 1, i + 1) : null)), [images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox, prev, next]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/galeri" className="hover:text-amber-400 transition-colors">Galeri</Link>
            <span>/</span>
            <span className="text-slate-300">{album?.title}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-black text-white">{album?.title}</h1>
          {album?.description && <p className="text-slate-400 mt-2 max-w-2xl">{album.description}</p>}
          <p className="text-xs text-slate-600 mt-3">{images.length} fotoğraf</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {images.length === 0 ? (
          <div className="text-center py-20 text-slate-500">Bu albümde henüz fotoğraf yok.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => openLightbox(idx)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-slate-800 hover:ring-2 hover:ring-amber-500/50 transition-all"
              >
                <img
                  src={img.thumbnailUrl ?? img.url}
                  alt={img.title ?? `Fotoğraf ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && images[lightbox] && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors z-10"
          >
            ×
          </button>

          {/* Counter */}
          <span className="absolute top-4 left-4 text-white/60 text-sm">
            {lightbox + 1} / {images.length}
          </span>

          {/* Prev */}
          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors z-10"
            >
              ‹
            </button>
          )}

          {/* Next */}
          {lightbox < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors z-10"
            >
              ›
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-5xl w-full px-20 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightbox].url}
              alt={images[lightbox].title ?? ""}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            {(images[lightbox].title || images[lightbox].description) && (
              <div className="mt-4 text-center">
                {images[lightbox].title && <p className="text-white font-semibold">{images[lightbox].title}</p>}
                {images[lightbox].description && <p className="text-slate-400 text-sm mt-1">{images[lightbox].description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
