import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Pagination } from '@/components/ui/pagination'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Haberler' }

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
      where: { type: 'NEWS', status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { author: { select: { name: true } } },
    }),
    db.news.count({ where: { type: 'NEWS', status: 'PUBLISHED' } }),
  ])

  const totalPages = Math.ceil(total / perPage)
  const featured = page === 1 ? news.slice(0, 2) : []
  const rest = page === 1 ? news.slice(2) : news

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="container-custom py-8">
            <h1 className="text-2xl font-bold text-gray-900">Haberler</h1>
            <p className="text-gray-500 text-sm mt-1">{total.toLocaleString('tr-TR')} haber</p>
          </div>
        </div>

        <div className="container-custom py-8">
          {featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {featured.map((item) => (
                <Link key={item.id} href={`/haberler/${item.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group">
                  {item.image
                    ? <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    : <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-700" />}
                  <div className="p-5">
                    <h2 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors">{item.title}</h2>
                    {item.excerpt && <p className="text-gray-500 text-sm mt-2 line-clamp-2">{item.excerpt}</p>}
                    <p className="text-xs text-gray-400 mt-3">{formatDate(item.publishedAt ?? item.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rest.map((item) => (
              <Link key={item.id} href={`/haberler/${item.slug}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm hover:border-blue-200 transition-all group">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(item.publishedAt ?? item.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>

          {news.length === 0 && (
            <div className="text-center py-16 text-gray-400">Henüz haber yok</div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} baseUrl="/haberler" />
        </div>
      </main>
      <Footer />
    </>
  )
}
