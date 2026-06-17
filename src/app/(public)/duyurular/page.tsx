import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Megaphone, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Duyurular',
  description: 'MEB ve eğitim kurumlarından resmi duyurular.',
};

export default async function DuyurularPage() {
  const announcements = await db.news.findMany({
    where: { status: 'PUBLISHED', type: 'ANNOUNCEMENT' },
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
              <Megaphone className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Duyurular</h1>
                <p className="text-gray-500 text-sm">Resmi duyurular ve bildirimler</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-custom py-8">
          <div className="space-y-3 max-w-3xl">
            {announcements.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  {item.isPinned && <span className="text-lg shrink-0">📌</span>}
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    {item.excerpt && <p className="text-sm text-gray-500 mt-1">{item.excerpt}</p>}
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.publishedAt || item.createdAt)}
                    </div>
                  </div>
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
