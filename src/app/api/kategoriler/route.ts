import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'

export async function GET() {
  const categories = await db.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { files: true } },
      children: {
        include: {
          _count: { select: { files: true } },
          children: {
            include: { _count: { select: { files: true } } },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })

  // flatten _count.files -> fileCount for easier consumption
  function mapCat(cat: typeof categories[number]): unknown {
    return {
      id:        cat.id,
      name:      cat.name,
      slug:      cat.slug,
      icon:      cat.icon,
      color:     cat.color,
      fileCount: cat._count.files,
      children:  cat.children?.map(mapCat) ?? [],
    }
  }

  return NextResponse.json(categories.map(mapCat))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !hasRole(session.user.role, 'EDITOR')) {
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
