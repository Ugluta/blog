import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; postId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await params
  const { content } = await req.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'İçerik zorunludur' }, { status: 400 })
  }

  const post = await db.boardPost.findUnique({ where: { id: postId } })
  if (!post) {
    return NextResponse.json({ error: 'Konu bulunamadı' }, { status: 404 })
  }

  const reply = await db.boardReply.create({
    data: {
      content: content.trim(),
      postId,
      authorId: session.user.id,
    },
  })

  return NextResponse.json({ success: true, data: reply }, { status: 201 })
}
