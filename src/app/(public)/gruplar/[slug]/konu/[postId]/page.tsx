import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ReplyForm } from '@/components/ReplyForm'
import { ArrowLeft, Calendar, Eye, Pin, MessageSquare } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string; postId: string }>
}

export default async function PostDetailPage({ params }: Props) {
  const { slug, postId } = await params
  const session = await auth()

  const group = await db.group.findFirst({ where: { slug, isActive: true } })
  if (!group) notFound()
  if (!group.isPublic && !session?.user) notFound()

  const post = await db.boardPost.findUnique({
    where: { id: postId },
    include: {
      author: { select: { name: true, image: true } },
      _count: { select: { replies: true } },
    },
  })

  if (!post || post.groupId !== group.id) notFound()

  const replies = await db.boardReply.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
  })

  const authorIds = [...new Set(replies.map((r) => r.authorId))]
  const replyAuthors = await db.user.findMany({
    where: { id: { in: authorIds } },
    select: { id: true, name: true, image: true },
  })
  const authorMap = Object.fromEntries(replyAuthors.map((a) => [a.id, a]))

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container-custom py-8 max-w-3xl mx-auto">
          <Link
            href={`/gruplar/${slug}`}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> {group.name}
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            {post.isPinned && (
              <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full mb-3 w-fit">
                <Pin className="w-3 h-3" /> Sabitlenmiş
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 mt-5 pt-5 border-t border-gray-100 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                {post.author.image ? (
                  <img src={post.author.image} className="w-5 h-5 rounded-full" alt="" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-200" />
                )}
                {post.author.name || 'Anonim'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.createdAt).toLocaleDateString('tr-TR')}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {post.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> {post._count.replies} yanıt
              </span>
            </div>
          </div>

          {replies.length > 0 && (
            <div className="space-y-3 mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {replies.length} Yanıt
              </h2>
              {replies.map((reply) => {
                const author = authorMap[reply.authorId]
                return (
                  <div key={reply.id} className="bg-white rounded-xl border border-gray-100 p-5">
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        {author?.image ? (
                          <img src={author.image} className="w-4 h-4 rounded-full" alt="" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gray-200" />
                        )}
                        {author?.name || 'Anonim'}
                      </span>
                      <span>
                        {new Date(reply.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {session?.user ? (
            <ReplyForm postId={postId} groupId={group.id} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <p className="text-gray-500 text-sm mb-3">Yanıt vermek için giriş yapın</p>
              <Link
                href={`/giris?next=/gruplar/${slug}/konu/${postId}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Giriş Yap
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
