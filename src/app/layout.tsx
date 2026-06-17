import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "KURUMSAL | Türkiye'nin Öncü Kurumsal Haber ve Analiz Platformu",
  description:
    "Teknoloji, ekonomi, dünya haberleri, spor, sağlık ve kültür alanlarında güncel haberler, derinlemesine analizler ve uzman yorumları. Türkiye'nin en güvenilir kurumsal içerik platformu.",
  keywords: "haberler, teknoloji, ekonomi, spor, sağlık, kültür, Türkiye, analiz",
  authors: [{ name: "KURUMSAL Editöryal Ekibi" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: "KURUMSAL | Türkiye'nin Öncü Haber Platformu",
    description: "Güncel haberler, analizler ve kurumsal içerikler",
    siteName: "KURUMSAL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <ThemeProvider />
      </head>
      <body className="min-h-full text-slate-100 antialiased">
        <Providers>
          <div className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
