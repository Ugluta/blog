import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { scrapeSource } from '@/lib/scraper';

export async function POST(req: Request) {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { sourceId } = await req.json();
  if (!sourceId) return NextResponse.json({ error: 'sourceId zorunlu' }, { status: 400 });

  // Create job record
  const job = await db.scraperJob.create({
    data: { sourceId, status: 'running', startedAt: new Date() },
  });

  try {
    const result = await scrapeSource(sourceId);

    await db.scraperJob.update({
      where: { id: job.id },
      data: {
        status: result.error ? 'failed' : 'completed',
        itemsFound: result.found,
        itemsSaved: result.saved,
        error: result.error || null,
        finishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: !result.error, ...result });
  } catch (error) {
    await db.scraperJob.update({
      where: { id: job.id },
      data: { status: 'failed', error: String(error), finishedAt: new Date() },
    });
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
