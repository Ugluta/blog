"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type DropItem = {
  label: string;
  desc: string;
  href: string;
};

type NavEntry =
  | { label: string; href: string; items?: undefined }
  | { label: string; href?: undefined; items: DropItem[] };

const NAV: NavEntry[] = [
  {
    label: "İçerikler",
    items: [
      { label: "Blog", desc: "Yazılar, düşünceler ve notlar", href: "/blog" },
      { label: "Müzik", desc: "Besteler, notlar ve parçalar", href: "/muzik" },
      { label: "Haberler", desc: "Güncel yazılar", href: "/haberler" },
      { label: "Galeri", desc: "Fotoğraf ve görsel arşiv", href: "/galeri" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "İçerik Yönetimi", desc: "Blog ve makale oluşturun", href: "/uygulama" },
      { label: "Sosyal Medya", desc: "Tüm platformlara otomatik yayın", href: "/uygulama/sosyal-hesaplar" },
      { label: "Analitik", desc: "Performans ve istatistikler", href: "/uygulama/analitik" },
    ],
  },
  {
    label: "Kaynaklar",
    items: [
      { label: "Hakkımızda", desc: "Kim olduğumuz", href: "/hakkimizda" },
      { label: "İletişim", desc: "Bize ulaşın", href: "/iletisim" },
      { label: "Destek", desc: "Yardım ve SSS", href: "/destek" },
    ],
  },
  { label: "Fiyatlandırma", href: "/fiyatlandirma" },
];

const ANNOUNCEMENTS = [
  { tag: "Yeni", text: "Müzik arşivi güncellendi — yeni besteler eklendi", href: "/muzik" },
  { tag: "Yazı", text: "Yapay zeka destekli içerik üretimi hakkında yeni makale yayınlandı", href: "/blog" },
  { tag: "Duyuru", text: "Platform v2.0 — daha hızlı, daha sade arayüz", href: "/uygulama" },
];

function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % ANNOUNCEMENTS.length);
    }, 5000);
  };

  useEffect(() => {
    start();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const go = (dir: 1 | -1) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent((c) => (c + dir + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
    start();
  };

  if (!visible) return null;
  const ann = ANNOUNCEMENTS[current];

  return (
    <div className="bg-[#EBF2FA] border-b border-[#B5CDE8]">
      <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-4">
        <button onClick={() => go(-1)} className="flex-shrink-0 text-[#3A6EA8]/50 hover:text-[#3A6EA8] transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <Link href={ann.href} className="flex-1 flex items-center justify-center gap-2.5 min-w-0 group" key={current}>
          <span className="flex-shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#3A6EA8] text-white">
            {ann.tag}
          </span>
          <span className="text-xs text-[#1A3A5C] group-hover:text-[#3A6EA8] transition-colors truncate font-medium">
            {ann.text}
          </span>
          <svg className="w-3 h-3 flex-shrink-0 text-[#3A6EA8]/50 group-hover:text-[#3A6EA8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            {ANNOUNCEMENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); setCurrent(i); start(); }}
                className={`h-1 rounded-full transition-all ${i === current ? "bg-[#3A6EA8] w-4" : "bg-[#B5CDE8] w-1.5 hover:bg-[#3A6EA8]/50"}`}
              />
            ))}
          </div>
          <button onClick={() => go(1)} className="text-[#3A6EA8]/50 hover:text-[#3A6EA8] transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={() => setVisible(false)} className="text-[#3A6EA8]/40 hover:text-[#3A6EA8] transition-colors ml-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ label }: { label: string }) {
  const icons: Record<string, ReactNode> = {
    Blog: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 7.5h8M2 11h5" stroke="#3A6EA8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    Müzik: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M6 11V4l7-1.5V10" stroke="#3A6EA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="4.5" cy="11" r="1.5" stroke="#3A6EA8" strokeWidth="1.5" />
        <circle cx="11.5" cy="10" r="1.5" stroke="#3A6EA8" strokeWidth="1.5" />
      </svg>
    ),
    Haberler: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="#3A6EA8" strokeWidth="1.5" />
        <path d="M5 6.5h6M5 9h4" stroke="#3A6EA8" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    Galeri: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="#3A6EA8" strokeWidth="1.5" />
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="#3A6EA8" strokeWidth="1.5" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="#3A6EA8" strokeWidth="1.5" />
        <rect x="9" y="9" width="5" height="5" rx="1" stroke="#3A6EA8" strokeWidth="1.5" />
      </svg>
    ),
    "İçerik Yönetimi": (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 7.5h8M2 11h5" stroke="#3A6EA8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    "Sosyal Medya": (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <circle cx="4" cy="8" r="2" stroke="#3A6EA8" strokeWidth="1.5" />
        <circle cx="12" cy="4" r="2" stroke="#3A6EA8" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" stroke="#3A6EA8" strokeWidth="1.5" />
        <path d="M6 7L10 5M6 9L10 11" stroke="#3A6EA8" strokeWidth="1.5" />
      </svg>
    ),
    Analitik: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 11.5L5.5 8l3 3L13 4.5" stroke="#3A6EA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    Hakkımızda: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="2.5" stroke="#3A6EA8" strokeWidth="1.5" />
        <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="#3A6EA8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    İletişim: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="#3A6EA8" strokeWidth="1.5" />
        <path d="M2 4l6 5 6-5" stroke="#3A6EA8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    Destek: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#3A6EA8" strokeWidth="1.5" />
        <path d="M8 9V8c1.5 0 2-1 1.5-2S8 5 7 5.5" stroke="#3A6EA8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.75" fill="#3A6EA8" />
      </svg>
    ),
  };
  return icons[label] ?? null;
}

export default function MegaHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  const open = (label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveMenu(label);
  };
  const close = () => { timerRef.current = setTimeout(() => setActiveMenu(null), 120); };
  const keep = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = searchValue.trim();
    if (v) { router.push(`/arama?q=${encodeURIComponent(v)}`); setSearchOpen(false); setSearchValue(""); }
  };

  return (
    <div className="sticky top-0 z-50">

      {/* ── Announcement bar ── */}
      <AnnouncementBar />

      {/* ── Main nav ── */}
      <header className="bg-white border-b-2 border-[#3A6EA8]" style={{ boxShadow: "0 1px 12px rgba(58,110,168,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-16 gap-8">

            {/* Brand */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#3A6EA8] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-sm tracking-tight">K</span>
              </div>
              <span className="font-extrabold text-[17px] text-[#111] tracking-tight group-hover:text-[#3A6EA8] transition-colors">
                Kurumsal
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1">
              {NAV.map((item) =>
                item.items ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => open(item.label)}
                    onMouseLeave={close}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 ${
                        activeMenu === item.label
                          ? "bg-[#EBF2FA] text-[#3A6EA8]"
                          : "text-[#444] hover:bg-[#EBF2FA] hover:text-[#3A6EA8]"
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-150 flex-shrink-0 ${
                          activeMenu === item.label ? "rotate-180 text-[#3A6EA8]" : "text-[#AAA]"
                        }`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {activeMenu === item.label && (
                      <div
                        className="absolute top-[calc(100%+4px)] left-0 z-50"
                        onMouseEnter={keep}
                        onMouseLeave={close}
                      >
                        <div
                          className="bg-white border border-[#DDD8CF] rounded-2xl overflow-hidden anim-slide-down"
                          style={{ minWidth: 280, boxShadow: "0 8px 32px rgba(58,110,168,0.12)" }}
                        >
                          <div className="p-2">
                            {item.items.map((link) => (
                              <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setActiveMenu(null)}
                                className="flex items-start gap-3 px-3.5 py-3 rounded-xl hover:bg-[#EBF2FA] transition-colors group/link"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#EBF2FA] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <NavIcon label={link.label} />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[13px] font-semibold text-[#111] group-hover/link:text-[#3A6EA8] leading-tight transition-colors">
                                    {link.label}
                                  </div>
                                  <div className="text-[11px] text-[#888] mt-0.5 leading-tight">{link.desc}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={`px-3.5 py-2 rounded-lg text-[14px] font-medium transition-all ${
                      pathname === item.href
                        ? "bg-[#EBF2FA] text-[#3A6EA8]"
                        : "text-[#444] hover:bg-[#EBF2FA] hover:text-[#3A6EA8]"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Ara..."
                    className="w-44 bg-[#F8F6F1] border border-[#DDD8CF] text-[#111] placeholder-[#AAA] px-3.5 py-1.5 text-sm rounded-lg focus:outline-none focus:border-[#3A6EA8] focus:bg-white transition-all"
                    onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchValue(""); }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#999] hover:bg-[#EBF2FA] hover:text-[#3A6EA8] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg text-[#777] hover:bg-[#EBF2FA] hover:text-[#3A6EA8] transition-colors"
                  aria-label="Ara"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              <Link href="/giris" className="hidden sm:block text-[13px] font-medium text-[#555] hover:text-[#3A6EA8] transition-colors px-3 py-2">
                Giriş
              </Link>
              <Link
                href="/uygulama"
                className="hidden sm:flex items-center gap-1.5 px-5 py-2 text-white text-[13px] font-bold rounded-full transition-all hover:shadow-lg hover:shadow-[#3A6EA8]/25"
                style={{ background: "#3A6EA8" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2D5A8E")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3A6EA8")}
              >
                Paneli Aç
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex items-center justify-center w-9 h-9 text-[#555] hover:bg-[#EBF2FA] hover:text-[#3A6EA8] rounded-lg transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#EDE9E0] bg-white">
            <div className="px-5 pt-3 pb-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-[#F8F6F1] border border-[#DDD8CF] text-[#111] placeholder-[#AAA] px-4 py-2.5 pr-10 text-sm rounded-xl focus:outline-none focus:border-[#3A6EA8] transition-colors"
                  />
                  <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            <nav className="px-4 pb-4 space-y-0.5">
              {NAV.map((item) =>
                item.items ? (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#333] hover:bg-[#EBF2FA] hover:text-[#3A6EA8] transition-colors"
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? "rotate-180 text-[#3A6EA8]" : "text-[#AAA]"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="ml-3 mt-0.5 border-l-2 border-[#B5CDE8] pl-3 space-y-0.5">
                        {item.items.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="block px-3 py-2 rounded-lg text-[12px] text-[#555] hover:text-[#3A6EA8] hover:bg-[#EBF2FA] transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={`block px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                      pathname === item.href
                        ? "text-[#3A6EA8] bg-[#EBF2FA]"
                        : "text-[#333] hover:text-[#3A6EA8] hover:bg-[#EBF2FA]"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="pt-3 px-1 flex flex-col gap-2">
                <Link href="/giris" className="block text-center px-4 py-2.5 rounded-full text-[13px] font-medium text-[#555] border border-[#DDD8CF] hover:border-[#B5CDE8] hover:bg-[#EBF2FA] hover:text-[#3A6EA8] transition-colors" onClick={() => setMobileOpen(false)}>
                  Giriş Yap
                </Link>
                <Link href="/uygulama" className="block text-center px-4 py-2.5 rounded-full text-[13px] font-bold text-white bg-[#3A6EA8] hover:bg-[#2D5A8E] transition-colors" onClick={() => setMobileOpen(false)}>
                  Paneli Aç ↗
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
