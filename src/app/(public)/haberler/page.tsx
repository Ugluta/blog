import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Pagination } from '@/components/ui/pagination'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageHero } from '@/components/public/PageHero'
import { ArtThumb } from '@/components/public/ArtThumb'
import { ArrowRight, Newspaper } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog' }
export const dynamic = 'force-dynamic'

export default async function HaberlerPage({
  searchParams,
}: {
  searchParams: Promise<{ sayfa?: string }>
}) {
  const { sayfa } = await searchParams
  const page = Math.max(1, Number(sayfa) || 1)
  const perPage = 12

  const [news, total] = await Promise.all([
    db.news.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      select: { id: true, title: true, slug: true, excerpt: true, image: true, category: true, publishedAt: true, createdAt: true },
    }),
    db.news.count({ where: { status: 'PUBLISHED' } }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <PageHero eyebrow="Blog" title="Yazılar & İçerikler" subtitle="Güncel yazılar, notlar ve teknik içerikler." />

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
          {news.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Henüz yazı yok.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, i) => (
                <Link key={item.id} href={`/haberler/${item.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  {item.image
                    ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.title} className="w-full aspect-[16/9] object-cover" />
                    )
                    : <ArtThumb i={i} label={item.category ?? 'blog'} />}
                  <div className="p-5">
                    {item.category && (
                      <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-blue-600 mb-2">{item.category}</span>
                    )}
                    <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    {item.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.excerpt}</p>}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-400">{formatDate(item.publishedAt ?? item.createdAt)}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">Devamını oku <ArrowRight className="w-4 h-4" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} baseUrl="/haberler" />
        </div>
      </main>
      <Footer />
    </>
  )
}
