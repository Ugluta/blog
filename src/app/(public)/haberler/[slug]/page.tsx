import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = await db.news.findUnique({
    where: { slug, status: 'PUBLISHED' },
    select: { title: true, excerpt: true, coverImage: true },
  })
  if (!news) return { title: 'Haber Bulunamadı' }
  return {
    title: `${news.title} | Öğretmen Evrak`,
    description: news.excerpt ?? undefined,
    openGraph: {
      title: news.title,
      description: news.excerpt ?? undefined,
      images: news.coverImage ? [news.coverImage] : [],
    },
  }
}

export default async function HaberDetayPage({ params }: Props) {
  const { slug } = await params

  const news = await db.news.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: { author: { select: { name: true } } },
  })

  if (!news) notFound()

  await db.news.update({
    where: { id: news.id },
    data: { viewCount: { increment: 1 } },
  })

  const related = await db.news.findMany({
    where: { type: news.type, status: 'PUBLISHED', id: { not: news.id } },
    orderBy: { publishedAt: 'desc' },
    take: 4,
    select: { id: true, title: true, slug: true, publishedAt: true, coverImage: true },
  })

  const typeLabel: Record<string, string> = {
    NEWS: 'Haber',
    ANNOUNCEMENT: 'Duyuru',
    LEGISLATION: 'Mevzuat',
    BLOG: 'Blog',
  }

  const typePath: Record<string, string> = {
    NEWS: '/haberler',
    ANNOUNCEMENT: '/duyurular',
    LEGISLATION: '/mevzuat',
    BLOG: '/haberler',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
          <span>/</span>
          <Link href={typePath[news.type] ?? '/haberler'} className="hover:text-blue-600">
            {typeLabel[news.type] ?? 'Haber'}
          </Link>
          <span>/</span>
          <span className="text-gray-800 truncate max-w-xs">{news.title}</span>
        </nav>

        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {news.coverImage && (
            <img
              src={news.coverImage}
              alt={news.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}

          <div className="p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                {typeLabel[news.type] ?? 'Haber'}
              </span>
              {news.isAiGenerated && (
                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                  AI ile oluşturuldu
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              {news.author && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {news.author.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(news.publishedAt ?? news.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {news.viewCount} görüntüleme
              </span>
              {news.sourceName && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.1-1.1" />
                  </svg>
                  Kaynak: {news.sourceUrl ? (
                    <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      {news.sourceName}
                    </a>
                  ) : news.sourceName}
                </span>
              )}
            </div>

            {news.excerpt && (
              <p className="text-lg text-gray-600 mb-6 font-medium leading-relaxed">
                {news.excerpt}
              </p>
            )}

            <div
              className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br/>') }}
            />

            {news.tags && news.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
                {news.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">İlgili İçerikler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((item) => (
                <Link key={item.id} href={`/haberler/${item.slug}`} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex gap-3">
                  {item.coverImage && (
                    <img src={item.coverImage} alt={item.title} className="w-20 h-16 object-cover rounded flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">{formatDate(item.publishedAt ?? new Date())}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
