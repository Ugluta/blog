import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { AdPosition } from '@prisma/client';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await db.advertisement.findUnique({ where: { id } });
  if (!ad) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json(ad);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const ad = await db.advertisement.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.position !== undefined && { position: body.position as AdPosition }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
      ...(body.linkUrl !== undefined && { linkUrl: body.linkUrl || null }),
      ...(body.htmlCode !== undefined && { htmlCode: body.htmlCode || null }),
      ...(body.adCode !== undefined && { adCode: body.adCode || null }),
      ...(body.width !== undefined && { width: body.width ? Number(body.width) : null }),
      ...(body.height !== undefined && { height: body.height ? Number(body.height) : null }),
      ...(body.startDate !== undefined && { startDate: body.startDate ? new Date(body.startDate) : null }),
      ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
  });

  return NextResponse.json(ad);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { id } = await params;
  await db.advertisement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
