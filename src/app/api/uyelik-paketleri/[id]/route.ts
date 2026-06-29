import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface Params { params: Promise<{ id: string }> }

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { id } = await params;
  try {
    await db.membershipPlan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Paket silinemedi' }, { status: 409 });
  }
}
