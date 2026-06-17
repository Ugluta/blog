import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ogretmenevrak.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/giris', '/kayit', '/profil'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
