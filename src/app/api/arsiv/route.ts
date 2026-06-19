import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { ArchiveType, SchoolType } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('tur') as ArchiveType | null;
  const isAdmin = searchParams.get('admin') === '1';

  const where = {
    ...(!isAdmin && { isActive: true }),
    ...(type && { type }),
  };

  const archives = await db.archive.findMany({
    where,
    orderBy: [{ isTemplate: 'desc' }, { downloadCount: 'desc' }],
  });

  return NextResponse.json(archives);
}

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const { title, slug, description, type, content, fileUrl,
    schoolTypes, gradeLevel, subject, year, isTemplate, isActive } = body;

  if (!title || !type) return NextResponse.json({ error: 'Başlık ve tür zorunlu' }, { status: 400 });

  const finalSlug = slug || title.toLowerCase()
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const slugExists = await db.archive.findUnique({ where: { slug: finalSlug } });
  const resolvedSlug = slugExists ? `${finalSlug}-${Date.now()}` : finalSlug;

  const archive = await db.archive.create({
    data: {
      title, slug: resolvedSlug,
      description: description || null,
      type: type as ArchiveType,
      content: content || null,
      fileUrl: fileUrl || null,
      schoolTypes: (schoolTypes as SchoolType[]) || [],
      gradeLevel: gradeLevel || null,
      subject: subject || null,
      year: year ? Number(year) : null,
      isTemplate: isTemplate || false,
      isActive: isActive !== false,
    },
  });

  return NextResponse.json(archive, { status: 201 });
}
