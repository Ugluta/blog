import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş yapın' }, { status: 401 })

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      file: {
        select: {
          id: true, title: true, slug: true, fileType: true,
          downloadCount: true, viewCount: true, subject: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(favorites)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş yapın' }, { status: 401 })

  const { fileId } = await req.json()
  if (!fileId) return NextResponse.json({ error: 'fileId gerekli' }, { status: 400 })

  const existing = await db.favorite.findUnique({
    where: { userId_fileId: { userId: session.user.id, fileId } },
  })
  if (existing) return NextResponse.json(existing)

  const favorite = await db.favorite.create({
    data: { userId: session.user.id, fileId },
  })
  return NextResponse.json(favorite, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş yapın' }, { status: 401 })

  const { fileId } = await req.json()
  if (!fileId) return NextResponse.json({ error: 'fileId gerekli' }, { status: 400 })

  await db.favorite.deleteMany({
    where: { userId: session.user.id, fileId },
  })
  return NextResponse.json({ ok: true })
}
