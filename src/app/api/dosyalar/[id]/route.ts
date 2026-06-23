import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await db.file.findUnique({
    where: { id },
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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();

  const existing = await db.file.findUnique({
    where: { id },
    select: { authorId: true, status: true, title: true, slug: true },
  });

  const file = await db.file.update({ where: { id }, data: body });

  if (existing && body.status && body.status !== existing.status) {
    if (body.status === 'APPROVED') {
      await db.notification.create({
        data: {
          userId: existing.authorId,
          title: 'Dosyanız Onaylanıd',
          message: `"${existing.title}" başlıklı dosyanız onaylanıd ve yayına alındı.`,
          type: 'file_approved',
          link: `/dosyalar/${existing.slug}`,
        },
      });
    } else if (body.status === 'REJECTED') {
      await db.notification.create({
        data: {
          userId: existing.authorId,
          title: 'Dosyanız Reddedildi',
          message: `"${existing.title}" başlıklı dosyanız reddedildi.`,
          type: 'file_rejected',
          link: `/dosyalarim`,
        },
      });
    }
  }

  return NextResponse.json({ success: true, data: file });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  await db.file.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
