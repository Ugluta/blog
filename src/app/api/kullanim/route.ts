import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get('userId');
  const userRole = (session.user as { role?: string }).role ?? '';
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole);

  const userId = isAdmin && targetUserId ? targetUserId : session.user.id;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [user, downloadsThisMonth, filesAggregate, aiNewsToday, aiDocsToday] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        membershipStatus: true,
        membershipExpiry: true,
        membershipPlan: {
          select: {
            id: true,
            name: true,
            slug: true,
            downloadLimit: true,
            uploadLimit: true,
            storageLimit: true,
          },
        },
      },
    }),
    db.download.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    }),
    db.file.aggregate({
      where: { authorId: userId },
      _count: { _all: true },
      _sum: { fileSize: true },
    }),
    db.news.count({
      where: { authorId: userId, isAiGenerated: true, createdAt: { gte: startOfToday } },
    }),
    db.document.count({
      where: { authorId: userId, isAiGenerated: true, createdAt: { gte: startOfToday } },
    }),
  ]);

  if (!user) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
  }

  const plan = user.membershipPlan;
  const downloadLimit = plan?.downloadLimit ?? null;
  const uploadLimit = plan?.uploadLimit ?? null;
  const storageLimit = plan?.storageLimit ? Number(plan.storageLimit) : null;
  const AI_DAILY_LIMIT = 20;

  const totalUploads = filesAggregate._count._all;
  const storageUsed = filesAggregate._sum.fileSize ?? 0;
  const aiUsageToday = aiNewsToday + aiDocsToday;

  const percent = (used: number, limit: number | null) =>
    limit != null ? Math.min(100, Math.round((used / limit) * 100)) : null;

  return NextResponse.json({
    plan: plan
      ? {
          id: plan.id,
          name: plan.name,
          slug: plan.slug,
          downloadLimit: plan.downloadLimit,
          uploadLimit: plan.uploadLimit,
          storageLimit: plan.storageLimit ? Number(plan.storageLimit) : null,
        }
      : null,
    usage: { downloadsThisMonth, totalUploads, storageUsed, aiUsageToday },
    limits: {
      downloads: { used: downloadsThisMonth, limit: downloadLimit, percent: percent(downloadsThisMonth, downloadLimit) },
      uploads: { used: totalUploads, limit: uploadLimit, percent: percent(totalUploads, uploadLimit) },
      storage: { used: storageUsed, limit: storageLimit, percent: percent(storageUsed, storageLimit) },
      aiDaily: { used: aiUsageToday, limit: AI_DAILY_LIMIT, percent: percent(aiUsageToday, AI_DAILY_LIMIT) },
    },
    membershipStatus: user.membershipStatus,
    membershipExpiry: user.membershipExpiry,
  });
}
