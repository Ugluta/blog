import { prisma } from '@/lib/prisma';
import { SocialPlatform } from '@prisma/client';
import { postToTwitter, buildTweetText } from './twitter';
import { postToFacebook, buildFacebookText } from './facebook';
import { postToInstagram, buildInstagramCaption } from './instagram';

export async function publishNewsToSocial(
  newsId: string,
  accountIds: string[],
  siteUrl: string
) {
  const news = await prisma.news.findUnique({
    where: { id: newsId },
    select: { id: true, title: true, slug: true, excerpt: true, image: true, tags: true },
  });
  if (!news) throw new Error('Haber bulunamadi');

  const accounts = await prisma.socialAccount.findMany({
    where: { id: { in: accountIds }, isActive: true },
  });

  const newsUrl = `${siteUrl}/haberler/${news.slug}`;
  const results = [];

  for (const account of accounts) {
    const job = await prisma.publisherJob.create({
      data: {
        newsId,
        socialAccountId: account.id,
        platform: account.platform,
        content: news.title,
        status: 'PENDING',
      },
    });

    try {
      let postId = '';
      let postUrl = '';
      const meta = (account.metadata ?? {}) as Record<string, string>;

      if (account.platform === SocialPlatform.TWITTER) {
        const text = buildTweetText(news.title, news.excerpt ?? '', newsUrl, news.tags);
        const res = await postToTwitter({ text, accessToken: account.accessToken });
        postId = res.id;
        postUrl = res.url;

      } else if (account.platform === SocialPlatform.FACEBOOK) {
        const message = buildFacebookText(news.title, news.excerpt ?? '', newsUrl);
        const pageId = meta.pageId ?? account.accountId ?? '';
        const res = await postToFacebook({ message, link: newsUrl, accessToken: account.accessToken, pageId });
        postId = res.id;
        postUrl = res.url;

      } else if (account.platform === SocialPlatform.INSTAGRAM) {
        if (!news.image) throw new Error('Instagram icin gorsel gerekli');
        const caption = buildInstagramCaption(news.title, news.excerpt ?? '', news.tags);
        const igUserId = meta.igUserId ?? account.accountId ?? '';
        const imageUrl = news.image.startsWith('http') ? news.image : `${siteUrl}${news.image}`;
        const res = await postToInstagram({ imageUrl, caption, accessToken: account.accessToken, igUserId });
        postId = res.id;
        postUrl = res.url;
      }

      await prisma.publisherJob.update({
        where: { id: job.id },
        data: { status: 'PUBLISHED', postId, postUrl, publishedAt: new Date() },
      });
      results.push({ account: account.accountName, platform: account.platform, status: 'ok', postUrl });

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await prisma.publisherJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', error: message },
      });
      results.push({ account: account.accountName, platform: account.platform, status: 'error', error: message });
    }
  }

  return results;
}
