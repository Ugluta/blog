"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Album {
  id: string | number;
  slug: string;
  title: string;
  coverImage?: string;
  imageCount?: number;
}

const placeholderAlbums: Album[] = [
  { id: 1, slug: "doga-fotograları", title: "Doğa Fotoğrafları", coverImage: "https://picsum.photos/208/160?random=201" },
  { id: 2, slug: "sehir-manzaralari", title: "Şehir Manzaraları", coverImage: "https://picsum.photos/208/160?random=202" },
  { id: 3, slug: "teknoloji-fuari", title: "Teknoloji Fuarı", coverImage: "https://picsum.photos/208/160?random=203" },
  { id: 4, slug: "spor-etkinlikleri", title: "Spor Etkinlikleri", coverImage: "https://picsum.photos/208/160?random=204" },
  { id: 5, slug: "kultur-sanat", title: "Kültür & Sanat", coverImage: "https://picsum.photos/208/160?random=205" },
  { id: 6, slug: "ekonomi-zirvesi", title: "Ekonomi Zirvesi", coverImage: "https://picsum.photos/208/160?random=206" },
];

export default function GalleryStrip() {
  const [albums, setAlbums] = useState<Album[]>(placeholderAlbums);

  useEffect(() => {
    fetch("/api/gallery/albums")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json() as Promise<{ albums?: Album[] } | Album[]>;
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.albums;
        if (list && list.length > 0) setAlbums(list);
      })
      .catch(() => {
        // keep placeholder albums
      });
  }, []);

  return (
    <section className="py-10" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div style={{ borderLeft: "3px solid #F59E0B", paddingLeft: "0.75rem" }}>
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Galeri
            </h2>
          </div>
          <Link
            href="/galeri"
            className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Tümünü Gör →
          </Link>
        </div>

        {/* Horizontal scroll strip */}
        <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/galeri/${album.slug}`}
                className="group cursor-pointer flex-shrink-0 relative overflow-hidden"
                style={{ width: 208, height: 160, borderRadius: "2px" }}
              >
                {/* Cover image */}
                {album.coverImage ? (
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="208px"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800" />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/60 transition-colors duration-300" />

                {/* Title overlay — appears on hover */}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-xs font-semibold text-white leading-snug line-clamp-2">
                    {album.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
