'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Shield, CreditCard, FolderOpen, Tag,
  Newspaper, Megaphone, Scale, Tv, Globe, FileEdit, HelpCircle,
  Users2, MessageSquare, Library, BarChart3, Settings, BookOpen,
  Bot, ChevronDown, ChevronRight, LogOut
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const menuGroups = [
  {
    label: 'Genel',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/admin/istatistikler', label: 'İstatistikler', icon: BarChart3 },
    ],
  },
  {
    label: 'Kullanıcı Yönetimi',
    items: [
      { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: Users },
      { href: '/admin/roller', label: 'Rol & İzinler', icon: Shield },
      { href: '/admin/uyelik-paketleri', label: 'Üyelik Paketleri', icon: CreditCard },
    ],
  },
  {
    label: 'Dosya & İçerik',
    items: [
      { href: '/admin/dosyalar', label: 'Dosyalar', icon: FolderOpen },
      { href: '/admin/kategoriler', label: 'Kategoriler', icon: Tag },
      { href: '/admin/belgeler', label: 'Belgeler', icon: FileEdit },
      { href: '/admin/arsiv', label: 'Arşiv & Kütüphane', icon: Library },
    ],
  },
  {
    label: 'Haberler & Duyurular',
    items: [
      { href: '/admin/haberler', label: 'Haberler', icon: Newspaper },
      { href: '/admin/duyurular', label: 'Duyurular', icon: Megaphone },
      { href: '/admin/mevzuat', label: 'Mevzuat', icon: Scale },
      { href: '/admin/scraper', label: 'Scraper (AI)', icon: Bot },
    ],
  },
  {
    label: 'Eğitim Araçları',
    items: [
      { href: '/admin/sorular', label: 'Soru Bankası', icon: HelpCircle },
      { href: '/admin/soru-bankasi', label: 'Sınav Oluştur', icon: FileEdit },
    ],
  },
  {
    label: 'Topluluk',
    items: [
      { href: '/admin/gruplar', label: 'Gruplar', icon: Users2 },
      { href: '/admin/pano', label: 'Pano', icon: MessageSquare },
    ],
  },
  {
    label: 'Site Yönetimi',
    items: [
      { href: '/admin/reklamlar', label: 'Reklamlar', icon: Tv },
      { href: '/admin/tema', label: 'Tema & Menü', icon: Globe },
      { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const toggleGroup = (label: string) => {
    setCollapsed((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-slate-300 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">ÖğretmenEvrak</p>
            <p className="text-xs text-slate-500">Yönetim Paneli</p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <button
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
            >
              {group.label}
              {collapsed.includes(group.label)
                ? <ChevronRight className="w-3 h-3" />
                : <ChevronDown className="w-3 h-3" />}
            </button>

            {!collapsed.includes(group.label) && (
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'admin-sidebar-link',
                      isActive(item.href, item.exact) && 'active'
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Globe className="w-4 h-4" />
          Siteyi Görüntüle
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 mt-1 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          Çıkış
        </button>
      </div>
    </aside>
  );
}
