"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    section: "İçerik",
    items: [
      { href: "/uygulama", label: "Dashboard", icon: "📊", exact: true },
      { href: "/uygulama/yazilar", label: "Yazılar", icon: "📝" },
      { href: "/uygulama/kategoriler", label: "Kategoriler", icon: "🗂️" },
      { href: "/uygulama/icerikler", label: "İçerik Havuzu", icon: "📥" },
      { href: "/uygulama/scraper", label: "Scraper", icon: "🤖" },
    ],
  },
  {
    section: "Video",
    items: [
      { href: "/uygulama/projelerim", label: "Projelerim", icon: "🎬" },
      { href: "/uygulama/video-olustur", label: "Video Oluştur", icon: "✨" },
    ],
  },
  {
    section: "Sosyal",
    items: [
      { href: "/uygulama/sosyal-hesaplar", label: "Sosyal Hesaplar", icon: "🌐" },
      { href: "/uygulama/yayinlar", label: "Yayınlar", icon: "📤" },
    ],
  },
  {
    section: "Sistem",
    items: [
      { href: "/uygulama/medya", label: "Medya Kütüphanesi", icon: "🎵" },
      { href: "/uygulama/abonelik", label: "Abonelik", icon: "💎" },
      { href: "/uygulama/ayarlar", label: "Ayarlar", icon: "⚙️" },
      { href: "/uygulama/tema-ayarlari", label: "Tema Ayarları", icon: "🎨" },
    ],
  },
];

const MOBILE_ITEMS = [
  { href: "/uygulama", label: "Ana Sayfa", icon: "📊", exact: true },
  { href: "/uygulama/yazilar", label: "Yazılar", icon: "📝" },
  { href: "/uygulama/icerikler", label: "Havuz", icon: "📥" },
  { href: "/uygulama/scraper", label: "Scraper", icon: "🤖" },
  { href: "/uygulama/sosyal-hesaplar", label: "Sosyal", icon: "🌐" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-[#0F172A] border-r border-slate-700/50 fixed inset-y-0 left-0">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-slate-700/50 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-widest text-amber-400 uppercase">KURUMSAL</span>
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">İçerik Yönetim Sistemi</p>
        </div>

        {/* New Content button */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <Link
            href="/uygulama/yazilar/yeni"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
            Yeni Yazı
          </Link>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 overflow-y-auto py-2 space-y-4">
          {NAV.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-1 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                {group.section}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, (item as { exact?: boolean }).exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        active
                          ? "bg-amber-500/15 text-amber-400 font-semibold"
                          : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-base w-5 flex-shrink-0 text-center">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Kullanıcı</p>
              <p className="text-[10px] text-slate-500 truncate">Ücretsiz Plan</p>
            </div>
            <Link href="/giris" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">↗</Link>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0F172A] border-t border-slate-700/50 flex items-center justify-around px-2 py-2">
        {MOBILE_ITEMS.map((item) => {
          const active = isActive(item.href, (item as { exact?: boolean }).exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-0 ${
                active ? "text-amber-400" : "text-slate-500"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[9px] truncate max-w-[48px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main */}
      <main className="lg:ml-60 flex-1 min-w-0 pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
