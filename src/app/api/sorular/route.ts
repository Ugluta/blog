import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { QuestionType, Difficulty, SchoolType } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('sayfa')) || 1;
  const perPage = Number(searchParams.get('limit')) || 20;
  const subjectId = searchParams.get('ders');
  const gradeId = searchParams.get('sinif');
  const difficulty = searchParams.get('zorluk') as Difficulty | null;
  const type = searchParams.get('tur') as QuestionType | null;
  const isAdmin = searchParams.get('admin') === '1';

  const where = {
    ...(!isAdmin && { isPublic: true, isApproved: true }),
    ...(subjectId && { subjectId }),
    ...(gradeId && { gradeId }),
    ...(difficulty && { difficulty }),
    ...(type && { type }),
  };

  const [data, total] = await Promise.all([
    db.question.findMany({
      where,
      include: {
        author: { select: { name: true } },
        subject: { select: { name: true, color: true } },
        grade: { select: { name: true } },
      },
      orderBy: { useCount: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.question.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, perPage, totalPages: Math.ceil(total / perPage) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const body = await req.json();
  const { content, type, difficulty, options, answer, explanation,
    subjectId, gradeId, schoolTypes, tags, isPublic } = body;

  if (!content) return NextResponse.json({ error: 'Soru metni zorunlu' }, { status: 400 });

  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR'];
  const isAutoApproved = allowedRoles.includes((session.user as { role?: string }).role || '');

  const data = await db.question.create({
    data: {
      content,
      type: (type as QuestionType) || 'MULTIPLE_CHOICE',
      difficulty: (difficulty as Difficulty) || 'MEDIUM',
      options: options || undefined,
      answer: answer || null,
      explanation: explanation || null,
      subjectId: subjectId || null,
      gradeId: gradeId || null,
      schoolTypes: (schoolTypes as SchoolType[]) || [],
      tags: tags || [],
      authorId: session.user.id,
      isPublic: isPublic !== false,
      isApproved: isAutoApproved,
    },
  });

  return NextResponse.json({ success: true, data }, { status: 201 });
}
