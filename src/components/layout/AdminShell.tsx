'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { AdminSidebar } from './AdminSidebar'
import {
  Menu, Search, Bell, Maximize, Minimize, LogOut, User, ExternalLink, ChevronDown,
} from 'lucide-react'

type AdminUser = { name: string | null; email: string; role: string }

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Süper Admin', ADMIN: 'Admin', EDITOR: 'Editör', MODERATOR: 'Moderatör',
}

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [deskOpen, setDeskOpen] = useState(true)
  const [userMenu, setUserMenu] = useState(false)
  const [isFs, setIsFs] = useState(false)
  const [notif, setNotif] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/bildirimler').then((r) => r.json()).then((d) => setNotif(d.unreadCount ?? 0)).catch(() => {})
  }, [])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function toggleFs() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
      setIsFs(true)
    } else {
      document.exitFullscreen?.()
      setIsFs(false)
    }
  }

  const initials = (user.name || user.email).slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-60 shrink-0 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${deskOpen ? 'lg:block' : 'lg:hidden'}`}
      >
        <AdminSidebar onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 flex items-center gap-2 px-3 sm:px-4">
          <button
            onClick={() => { setMobileOpen((v) => !v); setDeskOpen((v) => !v) }}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Menü"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <ExternalLink className="w-4 h-4" /> Siteyi Gör
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <Link href="/ara" className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors" aria-label="Ara">
              <Search className="w-[18px] h-[18px]" />
            </Link>

            <button onClick={toggleFs} className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors hidden sm:inline-flex" aria-label="Tam ekran">
              {isFs ? <Minimize className="w-[18px] h-[18px]" /> : <Maximize className="w-[18px] h-[18px]" />}
            </button>

            <Link href="/bildirimler" className="relative p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors" onClick={() => setNotif(0)} aria-label="Bildirimler">
              <Bell className="w-[18px] h-[18px]" />
              {notif > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notif > 9 ? '9+' : notif}
                </span>
              )}
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserMenu((v) => !v)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {initials}
                </span>
                <span className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-[13px] font-semibold text-gray-800 max-w-[120px] truncate">{user.name || user.email}</span>
                  <span className="text-[11px] text-gray-400">{ROLE_LABELS[user.role] ?? user.role}</span>
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>

              {userMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">{user.name || 'Yönetici'}</p>
                    <p className="text-[12px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link href="/profil" className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors" onClick={() => setUserMenu(false)}>
                    <User className="w-4 h-4 text-gray-400" /> Profilim
                  </Link>
                  <Link href="/" target="_blank" className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors" onClick={() => setUserMenu(false)}>
                    <ExternalLink className="w-4 h-4 text-gray-400" /> Siteye Dön
                  </Link>
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-5 lg:p-6">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
