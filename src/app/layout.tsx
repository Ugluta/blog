import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { AdSenseScript } from '@/components/ads/AdSenseScript';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://egitimportal.com'),
  title: {
    default: 'EğitimPortal - Öğretmenler için Her Şey',
    template: '%s | EğitimPortal',
  },
  description: 'Öğretmen ve idareciler için materyal, evrak, soru bankası ve doküman platformu. Ücretsiz dosya indirme, yıllık plan, ders planı ve daha fazlası.',
  keywords: ['öğretmen', 'evrak', 'materyal', 'yıllık plan', 'ders planı', 'sınav sorusu', 'meb', 'eğitim'],
  authors: [{ name: 'EğitimPortal' }],
  creator: 'EğitimPortal',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'EğitimPortal',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@egitimportal',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <AdSenseScript />
      </body>
    </html>
  );
}
