import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const data = await db.menuItem.findMany({
    where: { isActive: true },
    orderBy: [{ location: 'asc' }, { sortOrder: 'asc' }],
  });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }
  const body = await req.json();
  const count = await db.menuItem.count({ where: { location: body.location } });
  const data = await db.menuItem.create({
    data: {
      label: body.label,
      url: body.url,
      location: body.location || 'header',
      sortOrder: count,
      target: body.target || '_self',
    },
  });
  return NextResponse.json({ success: true, data }, { status: 201 });
}
