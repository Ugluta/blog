'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search, Menu, X, Bell, ChevronDown, Heart, LogOut,
  User, Sparkles, CreditCard, LayoutDashboard,
} from 'lucide-react';

const navItems = [
  { label: 'Blog', href: '/haberler' },
  { label: 'Projeler', href: '/projeler' },
  { label: 'Kod', href: '/kod' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Hizmetler', href: '/hizmetler' },
  {
    label: 'Araçlar',
    href: '/hesaplama',
    children: [
      { label: 'Maliyet & Kâr Hesaplama', href: '/hesaplama' },
      { label: 'OCR — Görüntüden Metin', href: '/ocr' },
      { label: 'AI Belge Oluştur', href: '/belge-olustur' },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [notifCount, setNotifCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/bildirimler')
      .then((r) => r.json())
      .then((data) => setNotifCount(data.unreadCount ?? 0))
      .catch(() => {});
  }, [status]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const userInitials = session?.user?.name
    ? session.user.name.slice(0, 2).toUpperCase()
    : session?.user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  function isActive(href: string) {
    return href === '/haberler' ? pathname.startsWith('/haberler') : pathname.startsWith(href);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500" />

      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/70">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center h-16 gap-6">

            <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-shadow">
                <span className="text-white font-mono font-bold text-sm">&lt;/&gt;</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-extrabold tracking-tight text-gray-900">Blog</span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-600">developer</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 flex-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                      {item.children && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${openDropdown === item.label ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
                      )}
                      {active && <span className="absolute left-3 right-3 -bottom-px h-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" />}
                    </Link>

                    {item.children && openDropdown === item.label && (
                      <div className="absolute top-full left-0 pt-2 z-50">
                        <div className="w-56 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 p-1.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-3 py-2 text-[13.5px] text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2 ml-auto">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="relative">
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="Ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                    className="w-56 h-9 pl-4 pr-9 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" aria-label="Ara">
                  <Search className="w-[18px] h-[18px]" />
                </button>
              )}

              {status === 'authenticated' && session?.user ? (
                <>
                  <Link href="/bildirimler" className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setNotifCount(0)}>
                    <Bell className="w-[18px] h-[18px]" />
                    {notifCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-white" />}
                  </Link>

                  <div className="relative" ref={userMenuRef}>
                    <button onClick={() => setShowUserMenu((v) => !v)} className="ml-1 w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white text-[11px] font-bold flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all">
                      {userInitials}
                    </button>
                    {showUserMenu && (
                      <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-[13px] font-semibold text-gray-900 truncate">{session.user.name || session.user.email}</p>
                          <p className="text-[12px] text-gray-400 truncate">{session.user.email}</p>
                        </div>
                        {[
                          { href: '/admin', Icon: LayoutDashboard, label: 'Yönetim Paneli' },
                          { href: '/favorilerim', Icon: Heart, label: 'Favorilerim' },
                          { href: '/bildirimler', Icon: Bell, label: 'Bildirimler' },
                          { href: '/belge-olustur', Icon: Sparkles, label: 'AI Belge Oluştur' },
                          { href: '/uyelik', Icon: CreditCard, label: 'Üyelik Paketleri' },
                          { href: '/profil', Icon: User, label: 'Profilim' },
                        ].map(({ href, Icon, label }) => (
                          <Link key={href} href={href} className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                            <Icon className="w-4 h-4 text-gray-400" />
                            {label}
                          </Link>
                        ))}
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Çıkış Yap
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 ml-1">
                  <Link href="/giris" className="h-9 px-4 text-[13.5px] font-medium text-gray-700 hover:text-blue-600 rounded-lg transition-colors flex items-center">
                    Giriş Yap
                  </Link>
                  <Link href="/kayit" className="h-9 px-5 text-[13.5px] font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 rounded-full shadow-lg shadow-blue-600/20 transition-all flex items-center">
                    Üye Ol
                  </Link>
                </div>
              )}
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 ml-auto" aria-label="Menü">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-5 py-4 space-y-0.5">
              <form onSubmit={handleSearch} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="search" placeholder="Ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </form>
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link href={item.href} className="flex items-center h-10 px-3 text-[14px] font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 pl-3 border-l border-gray-100 mb-1">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className="block py-2 text-[13px] text-gray-500 hover:text-blue-600 transition-colors" onClick={() => setMobileOpen(false)}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-4 mt-2 border-t border-gray-100">
                {status === 'authenticated' ? (
                  <Link href="/profil" className="flex-1 h-10 flex items-center justify-center text-[13.5px] font-medium text-gray-700 border border-gray-200 rounded-lg" onClick={() => setMobileOpen(false)}>
                    Profilim
                  </Link>
                ) : (
                  <>
                    <Link href="/giris" className="flex-1 h-10 flex items-center justify-center text-[13.5px] font-medium text-gray-700 border border-gray-200 rounded-lg" onClick={() => setMobileOpen(false)}>
                      Giriş Yap
                    </Link>
                    <Link href="/kayit" className="flex-1 h-10 flex items-center justify-center text-[13.5px] font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" onClick={() => setMobileOpen(false)}>
                      Üye Ol
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
