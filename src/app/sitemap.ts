import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ogretmenevrak.com';

  const [files, news] = await Promise.all([
    db.file.findMany({ where: { status: 'APPROVED', isActive: true }, select: { slug: true, updatedAt: true } }),
    db.news.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/dosyalar`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/haberler`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/duyurular`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/mevzuat`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/arsiv`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/sorular`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/giris`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/kayit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const fileRoutes: MetadataRoute.Sitemap = files.map((f) => ({
    url: `${baseUrl}/dosyalar/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const newsRoutes: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${baseUrl}/haberler/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...fileRoutes, ...newsRoutes];
}
