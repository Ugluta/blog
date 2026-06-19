'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Search, Menu, X, Bell, BookOpen, FileText, Newspaper,
  Archive, HelpCircle, ChevronDown, Heart, LogOut, User, ScanText, Sparkles,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dosyalar',
    href: '/dosyalar',
    icon: FileText,
    children: [
      { label: 'Tüm Dosyalar', href: '/dosyalar' },
      { label: 'Yıllık Planlar', href: '/dosyalar?kategori=yillik-planlar' },
      { label: 'Ders Planları', href: '/dosyalar?kategori=ders-planlari' },
      { label: 'Sınav Soruları', href: '/dosyalar?kategori=sinav-sorulari' },
      { label: 'Çalışma Kağıtları', href: '/dosyalar?kategori=calisma-kagitlari' },
    ],
  },
  {
    label: 'Haberler',
    href: '/haberler',
    icon: Newspaper,
    children: [
      { label: 'Tüm Haberler', href: '/haberler' },
      { label: 'Duyurular', href: '/duyurular' },
      { label: 'Mevzuat', href: '/mevzuat' },
    ],
  },
  { label: 'Soru Bankası', href: '/sorular', icon: HelpCircle },
  { label: 'Arşiv', href: '/arsiv', icon: Archive },
  {
    label: 'Araçlar',
    href: '/ocr',
    icon: ScanText,
    children: [
      { label: 'OCR — Görüntüden Metin', href: '/ocr' },
      { label: 'AI Belge Oluştur', href: '/belge-olustur' },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [notifCount, setNotifCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

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

  const userInitials = session?.user?.name
    ? session.user.name.slice(0, 2).toUpperCase()
    : session?.user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">
              <span className="text-blue-600">Öğretmen</span>Evrak
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3 h-3" />}
                </Link>
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search + Actions */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </form>

            {status === 'authenticated' && session?.user ? (
              <>
                <Link
                  href="/bildirimler"
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setNotifCount(0)}
                >
                  <Bell className="w-5 h-5" />
                  {notifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{userInitials}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.user.name || session.user.email}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                      </div>
                      <Link
                        href="/favorilerim"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="w-4 h-4" /> Favorilerim
                      </Link>
                      <Link
                        href="/bildirimler"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Bell className="w-4 h-4" /> Bildirimler
                        {notifCount > 0 && (
                          <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                            {notifCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/ocr"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ScanText className="w-4 h-4" /> OCR Aracı
                      </Link>
                      <Link
                        href="/belge-olustur"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Sparkles className="w-4 h-4" /> AI Belge Oluştur
                      </Link>
                      <Link
                        href="/profil"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" /> Profilim
                      </Link>
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" /> Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Giriş
                </Link>
                <Link
                  href="/kayit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Üye Ol
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="container-custom py-4 space-y-2">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{item.label}</span>
                </Link>
                {item.children && (
                  <div className="ml-8 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2 text-sm text-gray-500 hover:text-blue-600"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {status === 'authenticated' ? (
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/favorilerim"
                  className="flex-1 py-2.5 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-lg flex items-center justify-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <Heart className="w-4 h-4" /> Favorilerim
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex-1 py-2.5 text-center text-sm font-medium text-red-600 border border-red-200 rounded-lg"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/giris"
                  className="flex-1 py-2.5 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Üye Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
