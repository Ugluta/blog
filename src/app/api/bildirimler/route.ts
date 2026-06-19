import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    db.notification.count({
      where: { userId: session.user.id, isRead: false },
    }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { userId, title, message, type, link } = await req.json();
  if (!userId || !title || !message) {
    return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 });
  }

  const notification = await db.notification.create({
    data: { userId, title, message, type: type || 'info', link: link || null },
  });

  return NextResponse.json(notification, { status: 201 });
}
