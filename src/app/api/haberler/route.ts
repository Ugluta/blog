import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { slug as makeSlug } from '@/lib/utils';
import type { ContentType, ContentStatus } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('sayfa')) || 1;
  const perPage = Number(searchParams.get('limit')) || 20;
  const type = searchParams.get('tur') as ContentType | null;
  const status = searchParams.get('durum') as ContentStatus | null;
  const isAdmin = searchParams.get('admin') === '1';

  const where = {
    ...(!isAdmin && { status: 'PUBLISHED' as const }),
    ...(type && { type }),
    ...(status && { status }),
  };

  const [data, total] = await Promise.all([
    db.news.findMany({
      where,
      include: { author: { select: { name: true, image: true } } },
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.news.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, perPage, totalPages: Math.ceil(total / perPage) });
}

export async function POST(req: Request) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '') || !session.user.id) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const { title, excerpt, content, image, type, status, tags, metaTitle, metaDesc,
    isFeatured, isPinned, sourceUrl, sourceName, isAiGenerated, scheduledAt } = body;

  if (!title || !content) {
    return NextResponse.json({ error: 'Başlık ve içerik zorunlu' }, { status: 400 });
  }

  const newsSlug = makeSlug(title) + '-' + Date.now().toString(36);

  const data = await db.news.create({
    data: {
      title,
      slug: newsSlug,
      excerpt,
      content,
      image,
      type: (type as ContentType) || 'NEWS',
      status: (status as ContentStatus) || 'DRAFT',
      authorId: session.user.id,
      tags: tags || [],
      metaTitle,
      metaDesc,
      isFeatured: !!isFeatured,
      isPinned: !!isPinned,
      sourceUrl,
      sourceName,
      isAiGenerated: !!isAiGenerated,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true, data }, { status: 201 });
}
