import type { Metadata } from "next";
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
      <body className="min-h-full bg-slate-900 text-slate-100 antialiased">
        <div className="min-h-screen bg-[#0F172A]">
          {children}
        </div>
      </body>
    </html>
  );
}
