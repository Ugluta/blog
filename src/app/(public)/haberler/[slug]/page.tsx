import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
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
    title: news.title,
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
    NEWS: 'Haber', ANNOUNCEMENT: 'Duyuru', LEGISLATION: 'Mevzuat', BLOG: 'Blog',
  }
  const typePath: Record<string, string> = {
    NEWS: '/haberler', ANNOUNCEMENT: '/duyurular', LEGISLATION: '/mevzuat', BLOG: '/haberler',
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
            <span>/</span>
            <Link href={typePath[news.type] ?? '/haberler'} className="hover:text-blue-600">
              {typeLabel[news.type] ?? 'Haber'}
            </Link>
            <span>/</span>
            <span className="text-gray-800 truncate max-w-xs">{news.title}</span>
          </nav>

          <article className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl">
            {news.coverImage && (
              <img src={news.coverImage} alt={news.title} className="w-full h-64 md:h-96 object-cover" />
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

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{news.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
                {news.author && <span>{news.author.name}</span>}
                <span>{formatDate(news.publishedAt ?? news.createdAt)}</span>
                <span>{news.viewCount} görüntüleme</span>
                {news.sourceName && (
                  <span>
                    Kaynak: {news.sourceUrl ? (
                      <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        {news.sourceName}
                      </a>
                    ) : news.sourceName}
                  </span>
                )}
              </div>

              {news.excerpt && (
                <p className="text-lg text-gray-600 mb-6 font-medium leading-relaxed">{news.excerpt}</p>
              )}

              <div
                className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br/>') }}
              />

              {news.tags && news.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
                  {news.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </article>

          {related.length > 0 && (
            <section className="mt-10 max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">İlgili İçerikler</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((item) => (
                  <Link key={item.id} href={`/haberler/${item.slug}`}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex gap-3">
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

          <div className="mt-8 max-w-4xl">
            <Link href="/haberler" className="text-sm text-blue-600 hover:underline">← Haberlere Dön</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
