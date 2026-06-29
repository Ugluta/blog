import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { publishNewsToSocial } from '@/lib/publisher';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const body = await req.json();
  const { newsId, accountIds } = body as { newsId: string; accountIds: string[] };

  if (!newsId || !accountIds?.length) {
    return NextResponse.json({ error: 'newsId ve accountIds zorunlu' }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ikie.net';

  try {
    const results = await publishNewsToSocial(newsId, accountIds, siteUrl);
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
