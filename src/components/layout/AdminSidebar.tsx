'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, FolderOpen, Newspaper, FileText, HelpCircle, Archive,
  Users, Shield, CreditCard, Megaphone, BarChart3, Bot, Palette, Settings,
  ChevronDown, ChevronRight, Upload, Plus, Zap, Bell, Users2, MessageSquare,
  Tag, ScanText,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'İçerik',
    items: [
      { href: '/admin/dosyalar',  label: 'Dosyalar',   icon: FolderOpen },
      { href: '/admin/haberler',  label: 'Haberler',   icon: Newspaper },
      { href: '/admin/belgeler',  label: 'Belgeler',   icon: FileText },
      { href: '/admin/sorular',   label: 'Sorular',    icon: HelpCircle },
      { href: '/admin/arsiv',     label: 'Arşiv',      icon: Archive },
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
      { href: '/admin/kullanicilar',     label: 'Kullanıcılar',    icon: Users },
      { href: '/admin/roller',           label: 'Roller & İzinler', icon: Shield },
      { href: '/admin/uyelik-paketleri', label: 'Üyelik Paketleri', icon: CreditCard },
    ],
  },
  {
    label: 'Monetizasyon',
    items: [
      { href: '/admin/reklamlar',     label: 'Reklamlar',    icon: Megaphone },
      { href: '/admin/istatistikler', label: 'İstatistikler', icon: BarChart3 },
    ],
  },
  {
    label: 'Araçlar',
    items: [
      { href: '/admin/ocr',         label: 'OCR — Görüntüden Metin', icon: ScanText },
      { href: '/admin/scraper',     label: 'AI Scraper',              icon: Bot },
      { href: '/admin/kategoriler', label: 'Kategoriler',             icon: Tag },
      { href: '/admin/tema',        label: 'Tema & Menü',            icon: Palette },
      { href: '/admin/ayarlar',     label: 'Ayarlar',                 icon: Settings },
    ],
  },
]

const SHORTCUTS = [
  { href: '/admin/dosyalar/yukle',                 label: 'Dosya Yükle',       icon: Upload,   color: 'text-blue-400' },
  { href: '/admin/haberler/yeni',                  label: 'Yeni Haber',        icon: Plus,     color: 'text-green-400' },
  { href: '/admin/sorular',                        label: 'Soru Oluştur (AI)', icon: Zap,      color: 'text-yellow-400' },
  { href: '/admin/belgeler',                       label: 'Belge Oluştur (AI)',icon: Zap,      color: 'text-purple-400' },
  { href: '/admin/ocr',                            label: 'OCR Tarama',        icon: ScanText, color: 'text-pink-400' },
  { href: '/admin/haberler/yeni?tur=ANNOUNCEMENT', label: 'Duyuru Yayınla',   icon: Bell,     color: 'text-orange-400' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [notifCount, setNotifCount] = useState(0)

  useEffect(() => {
    fetch('/api/bildirimler')
      .then((r) => r.json())
      .then((data) => setNotifCount(data.unreadCount ?? 0))
      .catch(() => {})
  }, [])

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  function toggle(label: string) {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="w-56 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 overflow-hidden shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-500 transition-colors">
            E
          </div>
          <span className="font-semibold text-white text-sm">EğitimPortal</span>
        </Link>
        <Link
          href="/bildirimler"
          className="relative p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Bildirimler"
        >
          <Bell className="w-4 h-4" />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label ?? '_root'} className="mb-1">
            {group.label && (
              <button
                onClick={() => toggle(group.label!)}
                className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-400 transition-colors"
              >
                {group.label}
                {collapsed[group.label]
                  ? <ChevronRight className="w-3 h-3" />
                  : <ChevronDown  className="w-3 h-3" />}
              </button>
            )}
            {!collapsed[group.label ?? ''] && (
              <div className="px-2">
                {group.items.map((item) => {
                  const active = isActive(item.href, item.exact)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                        active
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* KİSAYOLLAR */}
      <div className="border-t border-slate-800 py-3 shrink-0">
        <p className="px-4 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kısayollar</p>
        <div className="px-2">
          {SHORTCUTS.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors mb-0.5"
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${s.color}`} />
                {s.label}
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
