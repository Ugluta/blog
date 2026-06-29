import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Pagination } from '@/components/ui/pagination';
import { Scale, Calendar, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mevzuat',
  description: 'Eğitim ile ilgili kanun, yönetmelik ve genelgeler.',
};

export default async function MevzuatPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const page = Number(params.sayfa) || 1;
  const perPage = 20;

  const where = { status: 'PUBLISHED' as const, type: 'LEGISLATION' as const };
  const [legislations, total] = await Promise.all([
    db.news.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.news.count({ where }),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container-custom py-8">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mevzuat</h1>
                <p className="text-gray-500 text-sm">{total.toLocaleString('tr-TR')} belge</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-custom py-8">
          <div className="space-y-3 max-w-3xl">
            {legislations.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                {item.excerpt && <p className="text-sm text-gray-500 mt-1">{item.excerpt}</p>}
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />{formatDate(item.publishedAt || item.createdAt)}
                  </span>
                  {item.sourceUrl && (
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <ExternalLink className="w-3 h-3" /> Resmi Kaynak
                    </a>
                  )}
                </div>
              </div>
            ))}
            {legislations.length === 0 && (
              <div className="text-center py-16 text-gray-400">Henüz mevzuat eklenmemiş</div>
            )}
          </div>
          <Pagination currentPage={page} totalPages={Math.ceil(total / perPage)} baseUrl="/mevzuat" />
        </div>
      </main>
      <Footer />
    </>
  );
}
