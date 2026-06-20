import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kurumsal | İçerik Yönetimi ve Yayıncılık Platformu",
  description:
    "Yapay zeka destekli içerik üretimi, sosyal medya yönetimi ve otomatik yayıncılık platformu. Blog, makale ve dijital içeriklerinizi tek yerden yönetin.",
  keywords: "içerik yönetimi, blog platformu, yapay zeka, sosyal medya, yayıncılık, teknoloji",
  authors: [{ name: "Kurumsal Ekibi" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: "Kurumsal | İçerik Yönetimi Platformu",
    description: "Yapay zeka destekli içerik üretimi ve yayıncılık platformu",
    siteName: "Kurumsal",
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
