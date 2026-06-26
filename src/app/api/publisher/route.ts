import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const newsId = searchParams.get('newsId');
  const platform = searchParams.get('platform');

  const jobs = await prisma.publisherJob.findMany({
    where: {
      ...(newsId ? { newsId } : {}),
      ...(platform ? { platform: platform as never } : {}),
    },
    include: {
      news: { select: { id: true, title: true, slug: true } },
      socialAccount: { select: { id: true, accountName: true, platform: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(jobs);
}
