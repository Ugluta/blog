import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

const WRITE_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

async function canWrite() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role ?? '';
  return !!session?.user && WRITE_ROLES.includes(role);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get('admin') === '1';
  const items = await db.galleryItem.findMany({
    where: isAdmin ? {} : { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await canWrite())) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  const b = await req.json();
  const { id, title, imageUrl, description, category, isActive, sortOrder } = b;
  if (!title || !imageUrl) return NextResponse.json({ error: 'Başlık ve görsel URL zorunlu' }, { status: 400 });

  const data = {
    title,
    imageUrl,
    description: description || null,
    category: category || null,
    isActive: isActive !== false,
    sortOrder: Number(sortOrder) || 0,
  };

  if (id) {
    const updated = await db.galleryItem.update({ where: { id }, data });
    return NextResponse.json(updated);
  }
  const created = await db.galleryItem.create({ data });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: Request) {
  if (!(await canWrite())) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id zorunlu' }, { status: 400 });
  await db.galleryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
