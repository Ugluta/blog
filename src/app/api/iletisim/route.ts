import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, email, subject, message } = body as { name?: string; email?: string; subject?: string; message?: string };

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Ad, e-posta ve mesaj zorunlu' }, { status: 400 });
  }

  try {
    const admins = await db.user.findMany({
      where: { role: { in: ['SUPER_ADMIN', 'ADMIN'] } },
      select: { id: true },
    });

    if (admins.length > 0) {
      await db.notification.createMany({
        data: admins.map((a) => ({
          userId: a.id,
          title: `İletişim: ${subject || 'Konu yok'}`,
          message: `${name} (${email}): ${message}`,
          type: 'contact',
          link: '/admin',
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Mesaj kaydedilemedi: ' + String(e) }, { status: 500 });
  }
}
