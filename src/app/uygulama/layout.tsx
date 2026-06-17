"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/uygulama", label: "Dashboard", icon: "📊", exact: true },
  { href: "/uygulama/projelerim", label: "Projelerim", icon: "🎬" },
  { href: "/uygulama/video-olustur", label: "Video Oluştur", icon: "✨" },
  { href: "/uygulama/sosyal-hesaplar", label: "Sosyal Hesaplar", icon: "🌐" },
  { href: "/uygulama/medya", label: "Medya Kütüphanesi", icon: "🎵" },
  { href: "/uygulama/yayinlar", label: "Yayınlar", icon: "📤" },
  { href: "/uygulama/abonelik", label: "Abonelik", icon: "💎" },
  { href: "/uygulama/ayarlar", label: "Ayarlar", icon: "⚙️" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-[#0F172A] border-r border-slate-700/50 fixed inset-y-0 left-0">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-slate-700/50">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-widest text-amber-400 uppercase">KURUMSAL</span>
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">Video Creator</p>
        </div>

        {/* Create button */}
        <div className="px-4 py-4">
          <Link
            href="/uygulama/video-olustur"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors"
          >
            <span>+</span> Yeni Video
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
                  ${active
                    ? "bg-amber-500/15 text-amber-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Kullanıcı</p>
              <p className="text-[10px] text-slate-500 truncate">Ücretsiz Plan</p>
            </div>
            <Link href="/giris" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ↗
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0F172A] border-t border-slate-700/50 flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-0
                ${active ? "text-amber-400" : "text-slate-500"}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[9px] truncate max-w-[48px]">{item.label.split(" ")[0]}</span>
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
