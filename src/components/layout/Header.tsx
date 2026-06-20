'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Search, Menu, X, Bell, ChevronDown, Heart, LogOut,
  User, ScanText, Sparkles, CreditCard, Upload, FileText,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dosyalar',
    href: '/dosyalar',
    children: [
      { label: 'Tüm Dosyalar', href: '/dosyalar' },
      { label: 'Yıllık Planlar', href: '/dosyalar?kategori=yillik-planlar' },
      { label: 'Ders Planları', href: '/dosyalar?kategori=ders-planlari' },
      { label: 'Sınav Soruları', href: '/dosyalar?kategori=sinav-sorulari' },
      { label: 'Çalışma Kağıtları', href: '/dosyalar?kategori=calisma-kagitlari' },
      { label: 'Dosya Yükle', href: '/dosyalar/yukle' },
    ],
  },
  { label: 'Haberler', href: '/haberler' },
  { label: 'Gruplar', href: '/gruplar' },
  { label: 'Soru Bankası', href: '/sorular' },
  {
    label: 'Araçlar',
    href: '/ocr',
    children: [
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
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  }

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'shadow-[0_2px_16px_rgba(0,0,0,0.08)]'
          : 'border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center h-16 gap-6">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect width="30" height="30" rx="8" fill="#1d4ed8" />
              <path d="M8 10h14M8 15h9M8 20h11" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span className="text-[17px] font-semibold tracking-tight text-gray-900 leading-none">
              Eğitim<span className="text-blue-600">Portal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-0.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    openDropdown === item.label
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-150 ${
                        openDropdown === item.label ? 'rotate-180 text-blue-500' : 'text-gray-400'
                      }`}
                    />
                  )}
                </Link>

                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-1 z-50">
                    <div className="w-52 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 py-1.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-[13.5px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  className="w-52 h-9 pl-4 pr-9 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Ara"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
            )}

            {status === 'authenticated' && session?.user ? (
              <>
                <Link
                  href="/bildirimler"
                  className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setNotifCount(0)}
                >
                  <Bell className="w-[18px] h-[18px]" />
                  {notifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </Link>

                <Link
                  href="/dosyalar/yukle"
                  className="ml-1 flex items-center gap-1.5 h-9 px-4 text-[13.5px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Yükle
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="ml-1 w-8 h-8 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all"
                  >
                    {userInitials}
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-[13px] font-semibold text-gray-900 truncate">{session.user.name || session.user.email}</p>
                        <p className="text-[12px] text-gray-400 truncate">{session.user.email}</p>
                      </div>
                      {[
                        { href: '/dosyalar/yukle', Icon: Upload, label: 'Dosya Yükle' },
                        { href: '/dosyalarim', Icon: FileText, label: 'Dosyalarım' },
                        { href: '/favorilerim', Icon: Heart, label: 'Favorilerim' },
                        { href: '/bildirimler', Icon: Bell, label: 'Bildirimler' },
                        { href: '/ocr', Icon: ScanText, label: 'OCR Aracı' },
                        { href: '/belge-olustur', Icon: Sparkles, label: 'AI Belge Oluştur' },
                        { href: '/uyelik', Icon: CreditCard, label: 'Üyelik Paketleri' },
                        { href: '/profil', Icon: User, label: 'Profilim' },
                      ].map(({ href, Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon className="w-4 h-4 text-gray-400" />
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href="/giris"
                  className="h-9 px-4 text-[13.5px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="h-9 px-4 text-[13.5px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                >
                  Üye Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 ml-auto"
            aria-label="Menü"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-5 py-4 space-y-0.5">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center h-10 px-3 text-[14px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 pl-3 border-l border-gray-100 mb-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2 text-[13px] text-gray-500 hover:text-gray-800 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-4 mt-2 border-t border-gray-100">
              {status === 'authenticated' ? (
                <>
                  <Link
                    href="/dosyalar/yukle"
                    className="flex-1 h-10 flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-white bg-blue-600 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Upload className="w-4 h-4" /> Yükle
                  </Link>
                  <Link
                    href="/profil"
                    className="flex-1 h-10 flex items-center justify-center text-[13.5px] font-medium text-gray-700 border border-gray-200 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profilim
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/giris"
                    className="flex-1 h-10 flex items-center justify-center text-[13.5px] font-medium text-gray-700 border border-gray-200 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="flex-1 h-10 flex items-center justify-center text-[13.5px] font-semibold text-white bg-blue-600 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Üye Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
