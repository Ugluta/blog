import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const data = await db.setting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] });
  return NextResponse.json({ data });
}

export async function PATCH(req: Request) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { settings } = await req.json() as { settings: Record<string, string> };

  await Promise.all(
    Object.entries(settings).map(([key, value]) =>
      db.setting.updateMany({ where: { key }, data: { value: String(value) } })
    )
  );

  return NextResponse.json({ success: true });
}
