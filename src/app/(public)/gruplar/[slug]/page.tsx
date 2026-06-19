import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JoinGroupButton } from '@/components/JoinGroupButton'
import { Users2, MessageSquare, Calendar, Pin, ArrowLeft, Eye, Lock } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function GroupDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await auth()

  const group = await db.group.findFirst({
    where: { slug, isActive: true },
    include: {
      _count: { select: { members: true, posts: true } },
      posts: {
        include: {
          author: { select: { name: true, image: true } },
          _count: { select: { replies: true } },
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 30,
      },
    },
  })

  if (!group) notFound()
  if (!group.isPublic && !session?.user) notFound()

  const isMember = session?.user?.id
    ? !!(await db.groupMember.findUnique({
        where: { groupId_userId: { groupId: group.id, userId: session.user.id } },
      }))
    : false

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container-custom py-8">
            <Link href="/gruplar" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 mb-6">
              <ArrowLeft className="w-4 h-4" /> Gruplara Dön
            </Link>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {group.image ? (
                <img src={group.image} alt={group.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                  <Users2 className="w-9 h-9 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
                  {!group.isPublic && <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                {group.description && (
                  <p className="text-gray-500 mb-3">{group.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Users2 className="w-4 h-4" /> {group._count.members} üye
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" /> {group._count.posts} konu
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {isMember ? (
                  <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200">
                    ✓ Üyesiniz
                  </span>
                ) : session?.user ? (
                  <JoinGroupButton groupId={group.id} />
                ) : (
                  <Link
                    href={`/giris?next=/gruplar/${group.slug}`}
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Gruba Katıl
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {group.posts.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Henüz konu açılmamış</p>
              <p className="text-gray-400 text-sm mt-1">İlk konuyu siz açın!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {group.posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
                >
                  {post.isPinned && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full mb-2 w-fit">
                      <Pin className="w-3 h-3" /> Sabitlenmiş
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      {post.author.image ? (
                        <img src={post.author.image} className="w-4 h-4 rounded-full" alt="" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-200" />
                      )}
                      {post.author.name || 'Anonim'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {post._count.replies} yanıt
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {post.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
