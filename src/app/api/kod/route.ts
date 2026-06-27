import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { toSlug } from '@/lib/slug';

const WRITE_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

async function canWrite() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role ?? '';
  return !!session?.user && WRITE_ROLES.includes(role);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get('admin') === '1';
  const snippets = await db.codeSnippet.findMany({
    where: isAdmin ? {} : { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(snippets);
}

export async function POST(req: Request) {
  if (!(await canWrite())) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  const b = await req.json();
  const { id, title, description, language, code, tags, isActive, sortOrder } = b;
  if (!title || !code) return NextResponse.json({ error: 'Başlık ve kod zorunlu' }, { status: 400 });

  const data = {
    title,
    description: description || null,
    language: language || 'text',
    code,
    tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map((t: string) => t.trim()).filter(Boolean) : []),
    isActive: isActive !== false,
    sortOrder: Number(sortOrder) || 0,
  };

  if (id) {
    const updated = await db.codeSnippet.update({ where: { id }, data });
    return NextResponse.json(updated);
  }
  const created = await db.codeSnippet.create({ data: { ...data, slug: `${toSlug(title)}-${Date.now().toString(36)}` } });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: Request) {
  if (!(await canWrite())) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id zorunlu' }, { status: 400 });
  await db.codeSnippet.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
