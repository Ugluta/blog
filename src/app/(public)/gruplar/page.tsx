import { db } from '@/lib/db'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Pagination } from '@/components/ui/Pagination'
import { Users2, Lock, Globe, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gruplar',
  description: 'Öğretmenler için tematik gruplar ve topluluklar.',
}

export default async function GruplarPage({
  searchParams,
}: {
  searchParams: Promise<{ sayfa?: string }>
}) {
  const { sayfa } = await searchParams
  const page = Math.max(1, Number(sayfa) || 1)
  const perPage = 12

  const where = { isPublic: true, isActive: true }

  const [groups, total] = await Promise.all([
    db.group.findMany({
      where,
      include: { _count: { select: { members: true, posts: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.group.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container-custom py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users2 className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gruplar</h1>
                  <p className="text-gray-500 text-sm mt-0.5">{total.toLocaleString('tr-TR')} topluluk</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {groups.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
                >
                  {group.image ? (
                    <img src={group.image} alt={group.name} className="w-full h-28 object-cover" />
                  ) : (
                    <div className="w-full h-28 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <Users2 className="w-10 h-10 text-white/60" />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {group.name}
                      </h3>
                      <span className="flex items-center gap-0.5 text-xs text-gray-400 shrink-0">
                        <Globe className="w-3 h-3" /> Herkese Açık
                      </span>
                    </div>

                    {group.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{group.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users2 className="w-3.5 h-3.5" />
                        {group._count.members.toLocaleString('tr-TR')} üye
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {group._count.posts.toLocaleString('tr-TR')} gönderi
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Users2 className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Henüz grup yok</h3>
              <p className="text-sm text-gray-400">Yakında topluluklar eklenecek.</p>
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} baseUrl="/gruplar" />
        </div>
      </main>
      <Footer />
    </>
  )
}
