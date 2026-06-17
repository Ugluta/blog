import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const file = await db.file.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true, image: true } },
      category: true,
      subject: true,
      grade: true,
    },
  });
  if (!file) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json({ data: file });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const file = await db.file.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ success: true, data: file });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  await db.file.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
