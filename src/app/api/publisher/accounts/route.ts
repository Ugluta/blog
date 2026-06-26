import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { SocialPlatform } from '@prisma/client';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const accounts = await db.socialAccount.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, platform: true, accountName: true, accountId: true,
      isActive: true, tokenExpiry: true, createdAt: true,
    },
  });
  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const body = await req.json();
  const { platform, accountName, accountId, accessToken, refreshToken, tokenExpiry, metadata } = body as {
    platform: SocialPlatform;
    accountName: string;
    accountId?: string;
    accessToken: string;
    refreshToken?: string;
    tokenExpiry?: string;
    metadata?: Record<string, string>;
  };

  if (!platform || !accountName || !accessToken) {
    return NextResponse.json({ error: 'platform, accountName ve accessToken zorunlu' }, { status: 400 });
  }

  const account = await db.socialAccount.upsert({
    where: { platform_accountId: { platform, accountId: accountId ?? accountName } },
    create: {
      platform,
      accountName,
      accountId: accountId ?? accountName,
      accessToken,
      refreshToken,
      tokenExpiry: tokenExpiry ? new Date(tokenExpiry) : null,
      metadata: metadata ?? {},
    },
    update: {
      accountName,
      accessToken,
      refreshToken,
      tokenExpiry: tokenExpiry ? new Date(tokenExpiry) : null,
      metadata: metadata ?? {},
      isActive: true,
    },
  });

  return NextResponse.json(account);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id zorunlu' }, { status: 400 });

  await db.socialAccount.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
