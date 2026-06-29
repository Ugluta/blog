import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { title, content } = await req.json()

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Başlık ve içerik zorunludur' }, { status: 400 })
  }

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId: id, userId: session.user.id } },
  })
  if (!membership) {
    return NextResponse.json({ error: 'Bu grubun üyesi değilsiniz' }, { status: 403 })
  }

  const post = await db.boardPost.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      groupId: id,
      authorId: session.user.id,
    },
  })

  return NextResponse.json({ success: true, data: post }, { status: 201 })
}
