import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const data = await db.document.findUnique({ where: { id } });
  if (!data) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await req.json();
  if (body.status === 'PUBLISHED' && !body.publishedAt) body.publishedAt = new Date();
  const data = await db.document.update({ where: { id }, data: body });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  await db.document.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
