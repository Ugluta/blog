import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { AdPosition } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const position = searchParams.get('position') as AdPosition | null;
  const isAdmin = searchParams.get('admin') === '1';

  const now = new Date();
  const where = {
    ...(!isAdmin && { isActive: true }),
    ...(position && { position }),
    ...(!isAdmin && {
      OR: [
        { startDate: null },
        { startDate: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: now } },
          ],
        },
      ],
    }),
  };

  const ads = await db.advertisement.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const { title, position, imageUrl, linkUrl, htmlCode, adCode,
    width, height, startDate, endDate, isActive, sortOrder } = body;

  if (!title || !position) return NextResponse.json({ error: 'Başlık ve konum zorunlu' }, { status: 400 });

  const ad = await db.advertisement.create({
    data: {
      title,
      position: position as AdPosition,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      htmlCode: htmlCode || null,
      adCode: adCode || null,
      width: width ? Number(width) : null,
      height: height ? Number(height) : null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: isActive !== false,
      sortOrder: sortOrder || 0,
    },
  });

  return NextResponse.json(ad, { status: 201 });
}
