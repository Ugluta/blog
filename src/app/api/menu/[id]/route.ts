import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }
  const body = await req.json();
  const data = await db.menuItem.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }
  await db.menuItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
