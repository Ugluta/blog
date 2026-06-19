import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR']

function role(session: { user?: unknown } | null): string {
  return (session?.user as { role?: string })?.role || ''
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user || !ALLOWED_ROLES.includes(role(session))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const group = await db.group.findUnique({ where: { id } })
  if (!group) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: group })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user || !ALLOWED_ROLES.includes(role(session))) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }
  const { id } = await params
  const { name, description, image, isPublic, isActive } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Grup adı zorunludur' }, { status: 400 })
  }
  const group = await db.group.update({
    where: { id },
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      image: image?.trim() || null,
      isPublic: !!isPublic,
      isActive: !!isActive,
    },
  })
  return NextResponse.json({ success: true, data: group })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user || !ALLOWED_ROLES.includes(role(session))) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }
  const { id } = await params
  await db.group.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
