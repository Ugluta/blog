import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Galeri | KURUMSAL" };

const MOCK_ALBUMS = [
  { id: "1", slug: "doga-fotograflari",      title: "Doğa Fotoğrafları",    description: "Türkiye'nin dört bir yanından doğa manzaraları", coverImage: "https://picsum.photos/seed/nature1/600/400",  _count: { images: 24 } },
  { id: "2", slug: "sehir-manzaralari",      title: "Şehir Manzaraları",    description: "Büyükşehirlerin panoramik görünümleri",          coverImage: "https://picsum.photos/seed/city2/600/400",   _count: { images: 18 } },
  { id: "3", slug: "teknoloji-etkinlikleri", title: "Teknoloji Etkinlikleri",description: "Konferans ve fuar kareleri",                    coverImage: "https://picsum.photos/seed/tech3/600/400",   _count: { images: 31 } },
  { id: "4", slug: "ofis-ve-ekip",           title: "Ofis & Ekip",          description: "Arkasındaki insanlar",                           coverImage: "https://picsum.photos/seed/office4/600/400", _count: { images: 12 } },
  { id: "5", slug: "urun-gorselleri",        title: "Ürün Görselleri",      description: "Hizmet ve ürün tanıtım fotoğrafları",            coverImage: "https://picsum.photos/seed/product5/600/400",_count: { images: 9  } },
  { id: "6", slug: "etkinlik-arsivi",        title: "Etkinlik Arşivi",      description: "Geçmiş yıllara ait etkinlik kareleri",           coverImage: "https://picsum.photos/seed/event6/600/400",  _count: { images: 47 } },
];

async function fetchAlbums() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/gallery/albums`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.albums?.length > 0) return data.albums;
    }
  } catch { /* fall through */ }
  return MOCK_ALBUMS;
}

export default async function GaleriPage() {
  const albums = await fetchAlbums();

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Hero */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-[#0a0f1e]">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Medya Arşivi</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Galeri</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Fotoğraf albümleri, etkinlik kareleri ve kurumsal görsel arşiv
          </p>
        </div>
      </section>

      {/* Albums grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {albums.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🖼️</p>
            <p className="text-slate-400">Henüz albüm eklenmemiş</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album: {
              id: string; slug: string; title: string;
              description?: string; coverImage?: string;
              _count?: { images: number };
            }) => (
              <Link
                key={album.id}
                href={`/galeri/${album.slug}`}
                className="group block bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-700">
                  {album.coverImage ? (
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-slate-600">🖼️</div>
                  )}
                  {album._count && (
                    <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {album._count.images} fotoğraf
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-bold text-white group-hover:text-amber-400 transition-colors">{album.title}</h2>
                  {album.description && (
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">{album.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
