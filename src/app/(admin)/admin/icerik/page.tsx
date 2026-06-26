import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ContentManagementClient from './ContentManagementClient';

export default async function IcerikPage() {
  const session = await auth();
  if (!session?.user) redirect('/giris');

  const [news, accounts] = await Promise.all([
    prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true, title: true, slug: true, status: true, isAiGenerated: true,
        sourceUrl: true, sourceName: true, image: true, excerpt: true,
        tags: true, createdAt: true, publishedAt: true,
        publisherJobs: {
          select: { platform: true, status: true, postUrl: true },
        },
      },
    }),
    prisma.socialAccount.findMany({
      where: { isActive: true },
      select: { id: true, platform: true, accountName: true },
    }),
  ]);

  return <ContentManagementClient news={news} accounts={accounts} />;
}
