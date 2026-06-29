import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { ArchiveType, SchoolType } from '@prisma/client';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const archive = await db.archive.findUnique({ where: { id } });
  if (!archive) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json(archive);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, slug, description, type, content, fileUrl,
    schoolTypes, gradeLevel, subject, year, isTemplate, isActive } = body;

  const archive = await db.archive.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(type !== undefined && { type: type as ArchiveType }),
      ...(content !== undefined && { content }),
      ...(fileUrl !== undefined && { fileUrl }),
      ...(schoolTypes !== undefined && { schoolTypes: schoolTypes as SchoolType[] }),
      ...(gradeLevel !== undefined && { gradeLevel }),
      ...(subject !== undefined && { subject }),
      ...(year !== undefined && { year: year ? Number(year) : null }),
      ...(isTemplate !== undefined && { isTemplate }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(archive);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { id } = await params;
  await db.archive.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
