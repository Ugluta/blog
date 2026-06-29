import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
  if (!session?.user || !allowedRoles.includes((session.user as { role?: string }).role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, totalFiles, totalDownloads, totalNews, totalQuestions,
    newUsersToday, downloadsToday, pendingFiles, activeAds] = await Promise.all([
    db.user.count(),
    db.file.count({ where: { status: 'APPROVED' } }),
    db.download.count(),
    db.news.count({ where: { status: 'PUBLISHED' } }),
    db.question.count({ where: { isApproved: true } }),
    db.user.count({ where: { createdAt: { gte: today } } }),
    db.download.count({ where: { createdAt: { gte: today } } }),
    db.file.count({ where: { status: 'PENDING' } }),
    db.advertisement.count({ where: { isActive: true } }),
  ]);

  return NextResponse.json({
    data: {
      totalUsers, totalFiles, totalDownloads, totalNews, totalQuestions,
      newUsersToday, downloadsToday, pendingFiles, activeAds,
    },
  });
}
