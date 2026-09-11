import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ikie | Müzik Blogu",
  description: "AI destekli müzik haberleri ve içerik platformu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="font-sans min-h-screen bg-cream text-ink">{children}</body>
    </html>
  );
}
