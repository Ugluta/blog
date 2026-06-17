import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Scale, Calendar, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mevzuat',
  description: 'Eğitim ile ilgili kanun, yönetmelik ve genelgeler.',
};

export default async function MevzuatPage() {
  const legislations = await db.news.findMany({
    where: { status: 'PUBLISHED', type: 'LEGISLATION' },
    orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
    take: 50,
  });

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
                <p className="text-gray-500 text-sm">Kanun, yönetmelik, genelge ve tebliğler</p>
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
