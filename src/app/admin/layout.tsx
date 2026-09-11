"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    title: "Genel",
    items: [
      { label: "Dashboard", href: "/admin", icon: "📊" },
      { label: "Tüm Yazılar", href: "/admin/posts", icon: "📝" },
      { label: "Abonelikler", href: "/admin/subscriptions", icon: "💎" },
      { label: "Genel Ayarlar", href: "/admin/settings/general", icon: "⚙️" },
      { label: "Görünüm", href: "/admin/settings/appearance", icon: "🎨" },
      { label: "Tipografi", href: "/admin/settings/typography", icon: "✍️" },
    ],
  },
  {
    title: "Kategoriler",
    items: [
      { label: "Haber Kategorileri", href: "/admin/categories/haber", icon: "📰" },
      { label: "Blog Kategorileri", href: "/admin/categories/blog", icon: "✍️" },
      { label: "Kod Örnekleri", href: "/admin/categories/kod-ornekleri", icon: "💻" },
      { label: "Ürün & Hizmetler", href: "/admin/categories/urunler", icon: "🛍️" },
      { label: "Galeri", href: "/admin/categories/galeri", icon: "🖼️" },
    ],
  },
  {
    title: "İçerik & Navigasyon",
    items: [
      { label: "Header Menü", href: "/admin/menus/header", icon: "☰" },
      { label: "Footer Menü", href: "/admin/menus/footer", icon: "≡" },
      { label: "Ana Sayfa Bölümleri", href: "/admin/settings/homepage", icon: "🏠" },
      { label: "Sidebar Widget", href: "/admin/settings/sidebar", icon: "▦" },
      { label: "Galeri Yönetimi", href: "/admin/gallery", icon: "🖼️" },
      { label: "Yorumlar", href: "/admin/comments", icon: "💬" },
    ],
  },
  {
    title: "Yayın & Reklam",
    items: [
      { label: "Newsletter", href: "/admin/newsletter", icon: "📧" },
      { label: "Reklam Yönetimi", href: "/admin/settings/ads", icon: "📢" },
      { label: "Monetizasyon", href: "/admin/settings/monetization", icon: "💰" },
      { label: "SEO Ayarları", href: "/admin/settings/seo", icon: "🔍" },
      { label: "Sosyal Medya", href: "/admin/settings/social", icon: "🌐" },
    ],
  },
  {
    title: "Otomasyon",
    items: [
      { label: "AI Sağlayıcılar", href: "/admin/settings/ai", icon: "🤖" },
      { label: "Scraper Kaynaklar", href: "/admin/scraper", icon: "🕷️" },
      { label: "Yayın Kuyruğu", href: "/admin/publisher", icon: "📤" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { label: "Kullanıcılar", href: "/admin/users", icon: "👥" },
      { label: "Performans", href: "/admin/settings/performance", icon: "⚡" },
      { label: "Güvenlik", href: "/admin/settings/security", icon: "🔒" },
      { label: "API Ayarları", href: "/admin/settings/api", icon: "🔑" },
      { label: "Kod Enjeksiyonu", href: "/admin/settings/code", icon: "⌨️" },
      { label: "Loglar", href: "/admin/logs", icon: "📋" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#E7E2D8] flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E2D8]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-widest text-[#3A6EA8] uppercase">KURUMSAL</span>
          </Link>
          <span className="text-xs bg-[#EBF2FA] text-[#3A6EA8] px-2 py-0.5 rounded-full font-medium">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#666666] px-3 mb-1.5">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                          ${active
                            ? "bg-[#EBF2FA] text-[#3A6EA8] font-semibold"
                            : "text-[#666666] hover:bg-[#EBF2FA] hover:text-[#111111]"
                          }`}
                      >
                        <span className="text-base w-5 text-center">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-3 border-t border-[#E7E2D8]">
          <Link href="/" className="flex items-center gap-2 text-xs text-[#666666] hover:text-[#444444] transition-colors">
            <span>←</span> Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-[#E7E2D8] bg-[#FFFFFF] flex items-center justify-between px-5 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-[#666666] hover:text-[#111111]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <nav className="hidden lg:flex items-center gap-1 text-xs text-[#666666]">
            <Link href="/admin" className="hover:text-[#3A6EA8] transition-colors">Admin</Link>
            {pathname !== "/admin" && (
              <>
                <span>/</span>
                <span className="text-[#444444] capitalize">{pathname.split("/").pop()?.replace(/-/g, " ")}</span>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[#666666] hover:text-[#3A6EA8] transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Siteyi Görüntüle
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
