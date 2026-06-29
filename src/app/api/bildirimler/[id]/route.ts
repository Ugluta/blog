import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  const { isRead } = await req.json();

  const notification = await db.notification.update({
    where: { id, userId: session.user.id },
    data: { isRead: isRead !== false },
  });

  return NextResponse.json(notification);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await params;
  await db.notification.delete({ where: { id, userId: session.user.id } });
  return NextResponse.json({ success: true });
}
