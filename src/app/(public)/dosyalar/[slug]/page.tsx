import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';
import { formatBytes, formatDate, SCHOOL_TYPE_LABELS } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download, Eye, Calendar, User, FileText, Tag, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const file = await db.file.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true, metaTitle: true, metaDesc: true },
  });
  if (!file) return { title: 'Dosya Bulunamadı' };
  return {
    title: file.metaTitle || file.title,
    description: file.metaDesc || file.description || undefined,
  };
}

export default async function DosyaDetailPage({ params }: Props) {
  const file = await db.file.findUnique({
    where: { slug: params.slug, status: 'APPROVED', isActive: true },
    include: {
      author: { select: { name: true, image: true, username: true } },
      category: true,
      subject: true,
      grade: true,
    },
  });

  if (!file) notFound();

  // Increment view count
  await db.file.update({ where: { id: file.id }, data: { viewCount: { increment: 1 } } });

  // Related files
  const related = await db.file.findMany({
    where: {
      status: 'APPROVED',
      isActive: true,
      id: { not: file.id },
      OR: [
        { subjectId: file.subjectId || undefined },
        { categoryId: file.categoryId || undefined },
      ],
    },
    include: { subject: { select: { name: true } } },
    take: 6,
    orderBy: { downloadCount: 'desc' },
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <Link href="/dosyalar" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6">
            <ArrowLeft className="w-4 h-4" /> Dosyalara Dön
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {file.isFeatured && <Badge variant="warning">Öne Çıkan</Badge>}
                      {file.isPremium && <Badge variant="premium">Premium</Badge>}
                      <Badge variant="outline">{file.fileType}</Badge>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">{file.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{file.author.name}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(file.createdAt)}</span>
                      <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{file.viewCount} görüntüleme</span>
                      <span className="flex items-center gap-1.5"><Download className="w-4 h-4" />{file.downloadCount} indirme</span>
                    </div>
                  </div>
                </div>

                {file.description && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{file.description}</p>
                  </div>
                )}

                {file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {file.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/dosyalar?ara=${tag}`}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Tag className="w-3 h-3" />{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Dosya Bilgileri</h2>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Dosya Adı', value: file.fileName },
                    { label: 'Dosya Boyutu', value: formatBytes(file.fileSize) },
                    { label: 'Dosya Türü', value: file.fileType },
                    { label: 'Kategori', value: file.category?.name || '-' },
                    { label: 'Ders', value: file.subject?.name || '-' },
                    { label: 'Sınıf', value: file.grade?.name || '-' },
                    { label: 'Yükleme Tarihi', value: formatDate(file.createdAt) },
                    {
                      label: 'Okul Türleri',
                      value: file.schoolTypes.map((s) => SCHOOL_TYPE_LABELS[s]).join(', ') || '-',
                    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-gray-500 font-medium">{label}</dt>
                      <dd className="text-gray-800 mt-0.5">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <a
                  href={`/api/files/${file.id}/download`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                >
                  <Download className="w-5 h-5" />
                  İndir ({formatBytes(file.fileSize)})
                </a>
                <p className="text-xs text-gray-400 text-center mt-3">PDF formatında, ücret yok</p>
              </div>

              {related.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Benzer Dosyalar</h3>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={`/dosyalar/${r.slug}`}
                        className="flex items-center gap-3 text-sm hover:text-blue-600 group"
                      >
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <span className="line-clamp-2 text-gray-700 group-hover:text-blue-600">{r.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
