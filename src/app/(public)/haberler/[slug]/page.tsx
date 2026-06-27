import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Eye, Clock, Calendar, Tag, ChevronRight, Folder } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = await db.news.findUnique({
    where: { slug, status: 'PUBLISHED' },
    select: { title: true, excerpt: true, image: true, metaTitle: true, metaDesc: true },
  })
  if (!news) return { title: 'Yazı Bulunamadı' }
  return {
    title: news.metaTitle ?? news.title,
    description: news.metaDesc ?? news.excerpt ?? undefined,
    openGraph: {
      title: news.title,
      description: news.excerpt ?? undefined,
      images: news.image ? [news.image] : [],
    },
  }
}

export const dynamic = 'force-dynamic'

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

  const [related, latest, categoryGroups] = await Promise.all([
    db.news.findMany({
      where: { status: 'PUBLISHED', id: { not: news.id }, ...(news.category ? { category: news.category } : { type: news.type }) },
      orderBy: { publishedAt: 'desc' }, take: 4,
      select: { id: true, title: true, slug: true, publishedAt: true, image: true },
    }),
    db.news.findMany({
      where: { status: 'PUBLISHED', id: { not: news.id } },
      orderBy: { publishedAt: 'desc' }, take: 5,
      select: { id: true, title: true, slug: true, publishedAt: true },
    }),
    db.news.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED', category: { not: null } },
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
      take: 8,
    }),
  ])

  const plain = news.content.replace(/<[^>]+>/g, ' ')
  const words = plain.trim().split(/\s+/).filter(Boolean).length
  const readMin = Math.max(1, Math.ceil(words / 200))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ikie.net'
  const pageUrl = `${siteUrl}/haberler/${news.slug}`
  const share = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(pageUrl)}`,
    fb: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    wa: `https://wa.me/?text=${encodeURIComponent(news.title + ' ' + pageUrl)}`,
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/haberler" className="hover:text-blue-600">Blog</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-800 truncate max-w-[200px] sm:max-w-md">{news.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* MAIN */}
            <article className="min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {news.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={news.image} alt={news.title} className="w-full h-64 md:h-80 object-cover" />
                )}
                <div className="p-6 md:p-9">
                  <div className="flex items-center gap-2 mb-4">
                    {news.category && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {news.category}
                      </span>
                    )}
                    {news.isAiGenerated && (
                      <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                        AI destekli
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
                    {news.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                    {news.author?.name && (
                      <span className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {news.author.name.slice(0, 2).toUpperCase()}
                        </span>
                        {news.author.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(news.publishedAt ?? news.createdAt)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {readMin} dk okuma</span>
                    <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {news.viewCount} görüntülenme</span>
                  </div>

                  {news.excerpt && (
                    <p className="text-lg text-gray-600 mb-6 font-medium leading-relaxed">{news.excerpt}</p>
                  )}

                  <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                  />

                  {news.tags && news.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                      {news.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          <Tag className="w-3 h-3" />{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Share */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">Paylaş:</span>
                    <a href={share.x} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800">X</a>
                    <a href={share.fb} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Facebook</a>
                    <a href={share.wa} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">WhatsApp</a>
                  </div>
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Benzer Yazılar</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {related.map((item) => (
                      <Link key={item.id} href={`/haberler/${item.slug}`}
                        className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all flex gap-3">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                        ) : (
                          <div className="w-20 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center flex-shrink-0">
                            <Folder className="w-5 h-5 text-blue-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(item.publishedAt ?? new Date())}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* SIDEBAR */}
            <aside className="space-y-6 lg:sticky lg:top-20 self-start">
              {/* Categories */}
              {categoryGroups.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Folder className="w-4 h-4 text-blue-600" /> Kategoriler</h3>
                  <div className="space-y-1">
                    {categoryGroups.map((c) => (
                      <Link key={c.category} href={`/haberler?kategori=${encodeURIComponent(c.category ?? '')}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                        <span>{c.category}</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{c._count.category}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest posts */}
              {latest.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-3">Son Yazılar</h3>
                  <div className="space-y-3">
                    {latest.map((item, i) => (
                      <Link key={item.id} href={`/haberler/${item.slug}`} className="group flex gap-3">
                        <span className="text-lg font-bold text-gray-200 leading-none">{String(i + 1).padStart(2, '0')}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.publishedAt ?? new Date())}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
                <h3 className="font-bold mb-1">Projelerime göz at</h3>
                <p className="text-blue-100 text-sm mb-4">Üzerinde çalıştığım ürün ve uygulamaları keşfet.</p>
                <Link href="/projeler" className="inline-block bg-white text-blue-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">Projeler →</Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
