import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { slug as makeSlug } from '@/lib/utils';

export async function GET() {
  const data = await db.category.findMany({
    where: { isActive: true },
    include: {
      children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      _count: { select: { files: true } },
    },
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const { name, icon, color, parentId, description } = body;
  if (!name) return NextResponse.json({ error: 'Ad zorunlu' }, { status: 400 });

  const categorySlug = makeSlug(name) + '-' + Date.now().toString(36);

  const data = await db.category.create({
    data: { name, slug: categorySlug, icon, color, parentId: parentId || null, description },
  });

  return NextResponse.json({ success: true, data }, { status: 201 });
}
