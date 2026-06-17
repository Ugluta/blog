import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { slug as makeSlug } from '@/lib/utils';
import type { DocumentStatus } from '@prisma/client';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('sayfa')) || 1;
  const perPage = 20;

  const [data, total] = await Promise.all([
    db.document.findMany({
      where: { authorId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.document.count({ where: { authorId: session.user.id } }),
  ]);

  return NextResponse.json({ data, total });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const body = await req.json();
  const { title, content, template, aiPrompt, isAiGenerated, status, tags } = body;

  if (!title) return NextResponse.json({ error: 'Başlık zorunlu' }, { status: 400 });

  const docSlug = makeSlug(title) + '-' + Date.now().toString(36);

  const data = await db.document.create({
    data: {
      title,
      slug: docSlug,
      content: content || '',
      template: template || null,
      aiPrompt: aiPrompt || null,
      isAiGenerated: !!isAiGenerated,
      authorId: session.user.id,
      status: (status as DocumentStatus) || 'DRAFT',
      tags: tags || [],
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true, data }, { status: 201 });
}
