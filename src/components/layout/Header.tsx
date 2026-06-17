'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, Bell, User, BookOpen, FileText, Newspaper, Archive, HelpCircle, ChevronDown } from 'lucide-react';

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
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
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
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="container-custom py-4 space-y-2">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Ara..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <Link href="/giris" className="flex-1 py-2.5 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-lg">
                Giriş Yap
              </Link>
              <Link href="/kayit" className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg">
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
