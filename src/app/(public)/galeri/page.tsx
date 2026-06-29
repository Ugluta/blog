import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/public/PageHero';
import { Image as ImageIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Galeri' };
export const dynamic = 'force-dynamic';

export default async function GaleriPage() {
  let items: { id: string; title: string; imageUrl: string; description: string | null; category: string | null }[] = [];
  try {
    items = await db.galleryItem.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch { items = []; }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <PageHero eyebrow="Portföy" title="Galeri" subtitle="Görseller, tasarımlar ve çalışmalar." />

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
          {items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((it) => (
                <div key={it.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    {it.category && <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-300">{it.category}</span>}
                    <span className="text-white text-sm font-semibold">{it.title}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz görsel yok.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
