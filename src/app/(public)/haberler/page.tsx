import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { formatDate, timeAgo } from '@/lib/utils';
import Link from 'next/link';
import { Eye, Calendar, Newspaper } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eğitim Haberleri',
  description: 'MEB ve eğitim sektöründen son dakika haberleri, duyurular.',
};

export default async function HaberlerPage() {
  const news = await db.news.findMany({
    where: { status: 'PUBLISHED', type: 'NEWS' },
    include: { author: { select: { name: true } } },
    orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
    take: 30,
  });

  const featured = news.filter((n) => n.isFeatured).slice(0, 3);
  const rest = news.filter((n) => !n.isFeatured || featured.indexOf(n) === -1);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container-custom py-8">
            <div className="flex items-center gap-3">
              <Newspaper className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Eğitim Haberleri</h1>
                <p className="text-gray-500 text-sm mt-0.5">MEB ve eğitim sektöründen son haberler</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Featured */}
          {featured.length > 0 && (
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {featured.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/haberler/${item.slug}`}
                  className={`group rounded-xl overflow-hidden bg-white border border-gray-100 hover:shadow-md transition-all ${
                    i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  {item.image && (
                    <div className={`bg-gray-200 ${i === 0 ? 'h-48 md:h-64' : 'h-32'}`}>
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className={`font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2 ${i === 0 ? 'text-lg' : 'text-sm'}`}>
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(item.publishedAt || item.createdAt)}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.viewCount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* News List */}
          <div className="space-y-3">
            {rest.map((item) => (
              <Link
                key={item.id}
                href={`/haberler/${item.slug}`}
                className="group flex gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
              >
                {item.image && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 text-sm">{item.title}</h3>
                  {item.excerpt && <p className="text-xs text-gray-500 line-clamp-1 mt-1">{item.excerpt}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{item.sourceName || item.author.name}</span>
                    <span>{timeAgo(item.publishedAt || item.createdAt)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.viewCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
