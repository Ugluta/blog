import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }
  const data = await db.user.findUnique({
    where: { id: params.id },
    include: { membershipPlan: true, _count: { select: { files: true, downloads: true } } },
  });
  if (!data) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }
  const body = await req.json();
  // Hassas alanları engelle
  delete body.password;
  delete body.email;
  const data = await db.user.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ success: true, data });
}
