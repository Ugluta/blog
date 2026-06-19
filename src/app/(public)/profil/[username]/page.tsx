import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { formatDate, ROLE_LABELS, SCHOOL_TYPE_LABELS, getFileTypeColor } from '@/lib/utils'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  const user = await db.user.findUnique({
    where: { username },
    select: { name: true },
  })
  if (!user) return { title: 'Kullanıcı Bulunamadı' }
  return { title: `${user.name || username} — Profil` }
}

export default async function KullaniciProfilPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const user = await db.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          files: { where: { status: 'APPROVED', isActive: true } },
          boardPosts: true,
          groups: true,
        },
      },
      files: {
        where: { status: 'APPROVED', isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          title: true,
          slug: true,
          fileType: true,
          downloadCount: true,
          createdAt: true,
        },
      },
      boardPosts: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true,
          viewCount: true,
          _count: { select: { replies: true } },
          group: { select: { name: true, slug: true } },
        },
      },
    },
  })

  if (!user) notFound()

  const initials =
    user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'

  const hasContent = user.files.length > 0 || user.boardPosts.length > 0

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container-custom py-10">
          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-start gap-6">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || username}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name || username}
                </h1>
                {user.username && (
                  <p className="text-gray-400 text-sm mt-0.5">@{user.username}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                  {user.schoolType && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {SCHOOL_TYPE_LABELS[user.schoolType] || user.schoolType}
                    </span>
                  )}
                </div>
                {user.bio && (
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">{user.bio}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                  {user.school && <span>🏫 {user.school}</span>}
                  {user.city && <span>📍 {user.city}</span>}
                  <span>📅 {formatDate(user.createdAt)} tarihinde katıldı</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{user._count.files}</p>
                <p className="text-sm text-gray-500 mt-1">Paylaşılan Dosya</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-2xl font-bold text-gray-900">{user._count.boardPosts}</p>
                <p className="text-sm text-gray-500 mt-1">Forum Konusu</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{user._count.groups}</p>
                <p className="text-sm text-gray-500 mt-1">Grup Üyeliği</p>
              </div>
            </div>
          </div>

          {!hasContent && (
            <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
              <p className="text-gray-400">Bu kullanıcı henüz içerik paylaşmamış.</p>
            </div>
          )}

          {hasContent && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Files */}
              {user.files.length > 0 && (
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Paylaşılan Dosyalar</h2>
                    <div className="divide-y divide-gray-50">
                      {user.files.map((file) => (
                        <Link
                          key={file.id}
                          href={`/dosyalar/${file.slug}`}
                          className="flex items-center gap-3 py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              getFileTypeColor(file.fileType)
                            }`}
                          >
                            {file.fileType?.slice(0, 3)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {file.title}
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(file.createdAt)}</p>
                          </div>
                          <span className="text-xs text-gray-400 shrink-0">
                            {file.downloadCount} indirme
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Board Posts */}
              {user.boardPosts.length > 0 && (
                <div className={user.files.length === 0 ? 'lg:col-span-3' : ''}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Son Forum Konuları</h2>
                    <div className="space-y-4">
                      {user.boardPosts.map((post) => (
                        <div
                          key={post.id}
                          className="border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                        >
                          {post.group && (
                            <Link
                              href={`/gruplar/${post.group.slug}`}
                              className="text-xs text-blue-500 hover:underline"
                            >
                              {post.group.name}
                            </Link>
                          )}
                          <Link
                            href={
                              post.group
                                ? `/gruplar/${post.group.slug}/konu/${post.id}`
                                : '#'
                            }
                            className="block text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors mt-0.5 line-clamp-2"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                            <span>{formatDate(post.createdAt)}</span>
                            <span>{post._count.replies} yanıt</span>
                            {post.viewCount > 0 && <span>{post.viewCount} görüntülenme</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
