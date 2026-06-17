import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { SCHOOL_TYPE_LABELS } from '@/lib/utils';
import Link from 'next/link';
import { Library, Download, Eye, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arşiv & Kütüphane',
  description: 'Müfredat, yıllık plan şablonları ve eğitim dokümanları arşivi.',
};

const ARCHIVE_TYPE_LABELS: Record<string, string> = {
  CURRICULUM: 'Müfredat',
  ANNUAL_PLAN: 'Yıllık Plan',
  UNIT_PLAN: 'Ünite Planı',
  LESSON_PLAN: 'Ders Planı',
  TEMPLATE: 'Şablon',
  GUIDE: 'Kılavuz',
};

export default async function ArsivPage() {
  const archives = await db.archive.findMany({
    where: { isActive: true },
    orderBy: [{ isTemplate: 'desc' }, { downloadCount: 'desc' }],
  });

  const grouped = archives.reduce((acc, item) => {
    const type = item.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, typeof archives>);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container-custom py-8">
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Arşiv & Kütüphane</h1>
                <p className="text-gray-500 text-sm mt-0.5">Müfredat, şablonlar ve resmi dokümanlar</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8 space-y-10">
          {Object.entries(grouped).map(([type, items]) => (
            <section key={type}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">{ARCHIVE_TYPE_LABELS[type] || type}</h2>
                <span className="text-sm text-gray-400">({items.length})</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
                    {item.isTemplate && (
                      <div className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full mb-2">
                        ⭐ Şablon
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.schoolTypes.map((s) => (
                        <span key={s} className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                          {SCHOOL_TYPE_LABELS[s]}
                        </span>
                      ))}
                      {item.year && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-50 rounded text-blue-600">{item.year}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.viewCount}</span>
                        <span className="flex items-center gap-1"><Download className="w-3 h-3" />{item.downloadCount}</span>
                      </div>
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" /> İndir
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
