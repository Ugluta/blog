import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';
import { formatBytes, formatDate, SCHOOL_TYPE_LABELS } from '@/lib/utils';
import Link from 'next/link';
import { Download, Eye, FileText, Filter } from 'lucide-react';
import type { Metadata } from 'next';
import type { SchoolType, FileType } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Dosyalar - Eğitim Materyalleri',
  description: 'Yıllık plan, ders planı, sınav sorusu ve eğitim materyallerini indirin.',
};

const FILE_TYPE_LABELS: Record<FileType, string> = {
  PDF: 'PDF', WORD: 'Word', EXCEL: 'Excel', POWERPOINT: 'PowerPoint',
  IMAGE: 'Görsel', VIDEO: 'Video', AUDIO: 'Ses', ZIP: 'Arşiv', OTHER: 'Diğer',
};

export default async function DosyalarPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.sayfa) || 1;
  const perPage = 24;
  const search = searchParams.ara as string;
  const okul = searchParams.okul as SchoolType;
  const kategori = searchParams.kategori as string;
  const ders = searchParams.ders as string;
  const tur = searchParams.tur as FileType;

  const where = {
    status: 'APPROVED' as const,
    isActive: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { tags: { has: search } },
      ],
    }),
    ...(okul && { schoolTypes: { has: okul } }),
    ...(kategori && { category: { slug: kategori } }),
    ...(ders && { subject: { slug: ders } }),
    ...(tur && { fileType: tur }),
  };

  const [files, total, categories, subjects] = await Promise.all([
    db.file.findMany({
      where,
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
        subject: { select: { name: true, color: true } },
        grade: { select: { name: true } },
      },
      orderBy: { downloadCount: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.file.count({ where }),
    db.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    db.subject.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-custom py-8">
            <h1 className="text-2xl font-bold text-gray-900">Eğitim Materyalleri</h1>
            <p className="text-gray-500 mt-1">{total.toLocaleString()} dosya bulundu</p>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-800 text-sm">Filtrele</span>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Okul Türü</p>
                    <div className="space-y-1">
                      {Object.entries(SCHOOL_TYPE_LABELS).map(([value, label]) => (
                        <Link
                          key={value}
                          href={`/dosyalar?okul=${value}`}
                          className={`block px-2 py-1.5 rounded text-sm transition-colors ${
                            okul === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Kategori</p>
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/dosyalar?kategori=${cat.slug}`}
                          className={`block px-2 py-1.5 rounded text-sm transition-colors ${
                            kategori === cat.slug ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ders</p>
                    <div className="space-y-1">
                      {subjects.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/dosyalar?ders=${sub.slug}`}
                          className={`block px-2 py-1.5 rounded text-sm transition-colors ${
                            ders === sub.slug ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Files Grid */}
            <div className="flex-1 min-w-0">
              {files.length === 0 ? (
                <div className="text-center py-20">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Dosya bulunamadı</p>
                  <Link href="/dosyalar" className="text-blue-600 text-sm hover:underline mt-2 inline-block">Tüm dosyaları görüntüle</Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {files.map((file) => (
                      <Link
                        key={file.id}
                        href={`/dosyalar/${file.slug}`}
                        className="group bg-white rounded-xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {file.isFeatured && <Badge variant="warning" className="text-xs">Öne Çıkan</Badge>}
                              {file.isPremium && <Badge variant="premium" className="text-xs">Premium</Badge>}
                            </div>
                          </div>

                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                            {file.title}
                          </h3>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {file.subject && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{file.subject.name}</span>
                            )}
                            {file.grade && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{file.grade.name}</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{file.viewCount}</span>
                              <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{file.downloadCount}</span>
                            </div>
                            <span>{formatBytes(file.fileSize)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                        <Link
                          key={p}
                          href={`/dosyalar?sayfa=${p}${okul ? `&okul=${okul}` : ''}${kategori ? `&kategori=${kategori}` : ''}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border transition-colors ${
                            p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
