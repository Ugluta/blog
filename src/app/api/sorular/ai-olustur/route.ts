import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { generateQuestions } from '@/lib/ai';
import type { QuestionType, Difficulty } from '@prisma/client';

export async function POST(req: Request) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'TEACHER'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const { subject, grade, topic, count = 5, type = 'MULTIPLE_CHOICE', difficulty = 'MEDIUM' } = body;

  if (!subject || !topic) {
    return NextResponse.json({ error: 'Ders ve konu zorunlu' }, { status: 400 });
  }

  const questions = await generateQuestions({ subject, grade, topic, count: Math.min(count, 20), type, difficulty });

  if (!questions.length) {
    return NextResponse.json({ error: 'Soru üretilemedi' }, { status: 500 });
  }

  const created = await Promise.all(
    questions.map((q) =>
      db.question.create({
        data: {
          content: q.content,
          type: type as QuestionType,
          difficulty: difficulty as Difficulty,
          options: q.options ? q.options.map((o: string, i: number) => ({
            label: String.fromCharCode(65 + i),
            text: o.replace(/^[A-D][)\s]+/, ''),
            isCorrect: String.fromCharCode(65 + i) === q.answer,
          })) : undefined,
          answer: q.answer,
          explanation: q.explanation,
          authorId: session.user!.id,
          isAiGenerated: true,
          isPublic: false,
          isApproved: false,
        },
      })
    )
  );

  return NextResponse.json({ success: true, count: created.length, data: created });
}
