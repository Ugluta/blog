'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FolderOpen, Newspaper, FileText, HelpCircle, Archive,
  Users, Shield, CreditCard, Megaphone, BarChart3, Bot, Palette, Settings,
  Users2, MessageSquare, Tag, ScanText, FolderGit2, Code2,
  Image as ImageIcon, Briefcase, Share2,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Portföy',
    items: [
      { href: '/admin/projeler',  label: 'Projeler',  icon: FolderGit2 },
      { href: '/admin/kod',       label: 'Kod',       icon: Code2 },
      { href: '/admin/galeri',    label: 'Galeri',    icon: ImageIcon },
      { href: '/admin/hizmetler', label: 'Hizmetler', icon: Briefcase },
    ],
  },
  {
    label: 'İçerik',
    items: [
      { href: '/admin/icerik',    label: 'İçerik & Yayın',   icon: Share2 },
      { href: '/admin/haberler',  label: 'Blog / Haberler', icon: Newspaper },
      { href: '/admin/dosyalar',  label: 'Dosyalar',        icon: FolderOpen },
      { href: '/admin/belgeler',  label: 'Belgeler',        icon: FileText },
      { href: '/admin/sorular',   label: 'Sorular',         icon: HelpCircle },
      { href: '/admin/arsiv',     label: 'Arşiv',           icon: Archive },
    ],
  },
  {
    label: 'Dağıtım',
    items: [
      { href: '/admin/scraper',      label: 'AI Scraper',   icon: Bot },
      { href: '/admin/sosyal-medya', label: 'Sosyal Medya', icon: Share2 },
    ],
  },
  {
    label: 'Topluluk',
    items: [
      { href: '/admin/gruplar', label: 'Gruplar', icon: Users2 },
      { href: '/admin/pano',    label: 'Pano',    icon: MessageSquare },
    ],
  },
  {
    label: 'Kullanıcılar',
    items: [
      { href: '/admin/kullanicilar',     label: 'Kullanıcılar',     icon: Users },
      { href: '/admin/roller',           label: 'Roller & İzinler', icon: Shield },
      { href: '/admin/uyelik-paketleri', label: 'Üyelik Paketleri', icon: CreditCard },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { href: '/admin/reklamlar',     label: 'Reklamlar',     icon: Megaphone },
      { href: '/admin/istatistikler', label: 'İstatistikler',  icon: BarChart3 },
      { href: '/admin/ocr',           label: 'OCR Aracı',      icon: ScanText },
      { href: '/admin/kategoriler',   label: 'Kategoriler',   icon: Tag },
      { href: '/admin/tema',          label: 'Tema & Menü',   icon: Palette },
      { href: '/admin/ayarlar',       label: 'Ayarlar',       icon: Settings },
    ],
  },
]

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-slate-700/50 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0">
          <span className="text-white font-mono font-bold text-xs">&lt;/&gt;</span>
        </div>
        <div className="leading-none">
          <p className="text-white font-bold text-sm">Blog</p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-400">admin panel</p>
        </div>
      </div>

      {/* Nav — tek kaydırma alanı, görünür ince kaydırıcı */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-4 px-2.5 space-y-5 [scrollbar-width:thin] [scrollbar-color:#475569_transparent]">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label ?? `g${gi}`}>
            {group.label && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-sm shadow-blue-900/40'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
