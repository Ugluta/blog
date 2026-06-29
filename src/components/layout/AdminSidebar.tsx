'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Newspaper, Users, Shield, CreditCard, Megaphone,
  BarChart3, Bot, Palette, Settings, ScanText, FolderGit2, Code2,
  Image as ImageIcon, Briefcase, Share2, Send, ChevronDown,
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
      { href: '/admin/icerik',   label: 'İçerik & Yayın',   icon: Send },
      { href: '/admin/haberler', label: 'Blog / Haberler', icon: Newspaper },
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
      { href: '/admin/tema',          label: 'Tema & Menü',   icon: Palette },
      { href: '/admin/ayarlar',       label: 'Ayarlar',       icon: Settings },
    ],
  },
]

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href)

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const g of NAV_GROUPS) {
      if (!g.label) continue
      init[g.label] = g.items.some((it) => pathname.startsWith(it.href))
    }
    return init
  })

  const toggle = (label: string) => setOpen((p) => ({ ...p, [label]: !p[label] }))

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

      {/* Ağaç menü */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-3 px-2.5 space-y-1 [scrollbar-width:thin] [scrollbar-color:#475569_transparent]">
        {NAV_GROUPS.map((group, gi) => {
          if (!group.label) {
            return (
              <div key={`g${gi}`} className="mb-1">
                {group.items.map((item) => {
                  const active = isActive(item.href, item.exact)
                  const Icon = item.icon
                  return (
                    <Link key={item.href} href={item.href} onClick={onNavigate}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        active ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}>
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )
          }

          const isOpen = open[group.label]
          const hasActive = group.items.some((it) => isActive(it.href))
          return (
            <div key={group.label}>
              <button onClick={() => toggle(group.label!)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  hasActive ? 'text-blue-300' : 'text-slate-500 hover:text-slate-300'
                }`}>
                <span>{group.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="space-y-0.5 mt-0.5 mb-1">
                  {group.items.map((item) => {
                    const active = isActive(item.href)
                    const Icon = item.icon
                    return (
                      <Link key={item.href} href={item.href} onClick={onNavigate}
                        className={`flex items-center gap-3 pl-5 pr-3 py-2 rounded-lg text-sm transition-colors ${
                          active ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}>
                        <Icon className="w-[18px] h-[18px] shrink-0" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
