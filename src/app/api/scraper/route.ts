import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { ContentType } from '@prisma/client';

export async function GET() {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const data = await db.scraperSource.findMany({
    include: {
      jobs: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, status: true, itemsFound: true, itemsSaved: true, createdAt: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const { name, url, selector, titleSelector, autoPublish, contentType } = body;

  if (!name || !url) {
    return NextResponse.json({ error: 'Ad ve URL zorunlu' }, { status: 400 });
  }

  const data = await db.scraperSource.create({
    data: {
      name,
      url,
      selector: selector || null,
      titleSelector: titleSelector || null,
      autoPublish: !!autoPublish,
      contentType: (contentType as ContentType) || 'NEWS',
    },
  });

  return NextResponse.json({ success: true, data }, { status: 201 });
}
