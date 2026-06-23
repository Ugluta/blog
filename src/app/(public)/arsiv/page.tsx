import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { SCHOOL_TYPE_LABELS } from '@/lib/utils';
import { Pagination } from '@/components/ui/pagination';
import Link from 'next/link';
import { Library, Download, Eye, BookOpen, Filter } from 'lucide-react';
import type { Metadata } from 'next';
import type { ArchiveType } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Arşiv & Kütüphane',
  description: 'Müfredat, yıllık plan şablonları ve eğitim dokümanları arşivi.',
};

const ARCHIVE_TYPE_LABELS: Record<ArchiveType, string> = {
  CURRICULUM: 'Müfredat',
  ANNUAL_PLAN: 'Yıllık Plan',
  UNIT_PLAN: 'Ünite Planı',
  LESSON_PLAN: 'Ders Planı',
  TEMPLATE: 'Şablon',
  GUIDE: 'Kılavuz',
};

export default async function ArsivPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const page = Number(params.sayfa) || 1;
  const perPage = 24;
  const type = params.tur as ArchiveType | undefined;

  const where = {
    isActive: true,
    ...(type && { type }),
  };

  const [archives, total] = await Promise.all([
    db.archive.findMany({
      where,
      orderBy: [{ isTemplate: 'desc' }, { downloadCount: 'desc' }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.archive.count({ where }),
  ]);

  const activeFilter = params.tur || '';

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
                <p className="text-gray-500 text-sm mt-0.5">{total.toLocaleString('tr-TR')} belge</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="flex gap-6">
            <aside className="hidden lg:block w-48 shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4" />
                  <span className="font-semibold text-sm">Tür</span>
                </div>
                <Link href="/arsiv" className={`block py-1.5 px-2 text-sm rounded hover:bg-gray-50 ${
                  !activeFilter ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}>Tümü</Link>
                {Object.entries(ARCHIVE_TYPE_LABELS).map(([val, label]) => (
                  <Link key={val} href={`/arsiv?tur=${val}`}
                    className={`block py-1.5 px-2 text-sm rounded hover:bg-gray-50 ${
                      activeFilter === val ? 'text-blue-600 font-medium' : 'text-gray-600'
                    }`}>{label}</Link>
                ))}
              </div>
            </aside>

            <div className="flex-1">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {archives.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.isTemplate && (
                        <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                          ⭐ Şablon
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {ARCHIVE_TYPE_LABELS[item.type]}
                      </span>
                    </div>
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
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                          <Download className="w-3.5 h-3.5" /> İndir
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Pagination currentPage={page} totalPages={Math.ceil(total / perPage)} baseUrl="/arsiv"
                searchParams={activeFilter ? { tur: activeFilter } : {}} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
