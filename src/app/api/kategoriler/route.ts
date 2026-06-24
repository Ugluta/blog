import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { slug as slugify } from '@/lib/utils'

export async function GET() {
  const categories = await db.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { files: true } },
      children: {
        include: { _count: { select: { files: true } } },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })

  function mapCat(cat: any): unknown {
    return {
      id:        cat.id,
      name:      cat.name,
      slug:      cat.slug,
      icon:      cat.icon,
      color:     cat.color,
      fileCount: cat._count.files,
      children:  (cat.children || []).map((child: any) => ({
        id:        child.id,
        name:      child.name,
        slug:      child.slug,
        icon:      child.icon,
        color:     child.color,
        fileCount: child._count.files,
        children:  [],
      })),
    }
  }

  return NextResponse.json(categories.map(mapCat))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userRole = session?.user && 'role' in session.user ? (session.user as { role?: string }).role : undefined
  if (!session?.user || !hasRole(userRole, 'EDITOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, parentId, icon, color, description } = body

  if (!name) return NextResponse.json({ error: 'İsim zorunlu' }, { status: 400 })

  const baseSlug = slugify(name)
  const exists   = await db.category.count({ where: { slug: { startsWith: baseSlug } } })
  const slug     = exists ? `${baseSlug}-${exists + 1}` : baseSlug

  const maxOrder = await db.category.aggregate({
    where:   { parentId: parentId ?? null },
    _max:    { sortOrder: true },
  })

  const category = await db.category.create({
    data: {
      name,
      slug,
      icon:      icon      ?? null,
      color:     color     ?? null,
      description: description ?? null,
      parentId:  parentId  ?? null,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  })

  return NextResponse.json(category, { status: 201 })
}
