import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { slug as makeSlug } from '@/lib/utils'

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR']

export async function POST(req: Request) {
  const session = await auth()
  const userRole = (session?.user as { role?: string })?.role || ''
  if (!session?.user || !ALLOWED_ROLES.includes(userRole)) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { name, description, image, isPublic, isActive } = await req.json()

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Grup adı zorunludur' }, { status: 400 })
  }

  const baseSlug = makeSlug(name)
  let groupSlug = baseSlug

  const existing = await db.group.findUnique({ where: { slug: groupSlug } })
  if (existing) {
    groupSlug = `${baseSlug}-${Date.now().toString(36)}`
  }

  const group = await db.group.create({
    data: {
      name: name.trim(),
      slug: groupSlug,
      description: description?.trim() || null,
      image: image?.trim() || null,
      isPublic: isPublic !== false,
      isActive: isActive !== false,
    },
  })

  return NextResponse.json({ success: true, data: group }, { status: 201 })
}
