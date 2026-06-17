import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const isSelf = session.user.id === id
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)

  if (!isSelf && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      membershipStatus: true,
      schoolType: true,
      bio: true,
      phone: true,
      city: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      membershipPlan: { select: { name: true } },
      _count: { select: { files: true, downloads: true, documents: true } },
    },
  })

  if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const isSelf = session.user.id === id
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)

  if (!isSelf && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { name, username, bio, phone, city, role, membershipStatus, schoolType } = body

  const data: Record<string, unknown> = {}
  if (name !== undefined) data.name = name
  if (username !== undefined) data.username = username
  if (bio !== undefined) data.bio = bio
  if (phone !== undefined) data.phone = phone
  if (city !== undefined) data.city = city

  if (isAdmin) {
    if (role !== undefined) data.role = role
    if (membershipStatus !== undefined) data.membershipStatus = membershipStatus
    if (schoolType !== undefined) data.schoolType = schoolType || null
  }

  const user = await db.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, membershipStatus: true },
  })

  return NextResponse.json(user)
}
