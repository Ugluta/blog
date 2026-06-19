"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  {
    label: "Ürünler",
    items: [
      { label: "İçerik Yönetimi", desc: "Haber ve blog yazıları oluşturun", href: "/uygulama", icon: "📝" },
      { label: "Sosyal Medya", desc: "Tüm platformlara otomatik yayın", href: "/uygulama/sosyal-hesaplar", icon: "🌐" },
      { label: "Video Üretimi", desc: "Yapay zeka ile video oluşturun", href: "/uygulama/video-olustur", icon: "🎬" },
      { label: "Analitik", desc: "Performansınızı takip edin", href: "/uygulama/analitik", icon: "📊" },
    ],
  },
  {
    label: "Çözümler",
    items: [
      { label: "Medya Şirketleri", desc: "Büyük ölçekli içerik operasyonları", href: "/cozumler/medya", icon: "🏢" },
      { label: "Ajanslar", desc: "Çok müşterili içerik yönetimi", href: "/cozumler/ajanslar", icon: "🤝" },
      { label: "Girişimciler", desc: "Hızlı büyüme için içerik araçları", href: "/cozumler/girisimciler", icon: "🚀" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Fiyatlandırma", href: "/fiyatlandirma" },
];

export default function MegaHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

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
  const close = () => {
    timerRef.current = setTimeout(() => setActiveMenu(null), 120);
  };
  const keep = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = searchValue.trim();
    if (v) { router.push(`/arama?q=${encodeURIComponent(v)}`); setSearchOpen(false); setSearchValue(""); }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-[0_2px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl bg-[#0a0f1eee]"
          : "bg-[#0a0f1e]"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-5">
        <div className="flex items-center h-16 gap-8">

          {/* ── Logo ── */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}>
              <span className="text-slate-900 font-black text-sm">K</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Kurumsal<span className="text-amber-400">.</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {NAV.map((item) =>
              item.items ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => open(item.label)}
                  onMouseLeave={close}
                >
                  <button
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeMenu === item.label
                        ? "bg-white/8 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === item.label ? "rotate-180 text-amber-400" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {activeMenu === item.label && (
                    <div
                      className="absolute top-[calc(100%+8px)] left-0 anim-slide-down"
                      style={{ minWidth: 320 }}
                      onMouseEnter={keep}
                      onMouseLeave={close}
                    >
                      {/* Arrow */}
                      <div className="absolute -top-1.5 left-6 w-3 h-3 rotate-45 bg-[#0F172A] border-l border-t border-slate-700/60" />
                      <div className="bg-[#0F172A] border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                        <div className="p-2">
                          {item.items.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setActiveMenu(null)}
                              className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                            >
                              <span className="text-xl flex-shrink-0 mt-0.5">{link.icon}</span>
                              <div>
                                <p className="text-sm font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                                  {link.label}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-800/30">
                          <Link
                            href="/uygulama"
                            className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
                            onClick={() => setActiveMenu(null)}
                          >
                            Tüm özellikleri gör →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href || pathname.startsWith(item.href! + "/")
                      ? "text-white bg-white/8"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Ara..."
                  className="w-48 bg-white/8 border border-slate-700 text-slate-100 placeholder-slate-500 px-3 py-1.5 text-sm rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchValue(""); }} className="text-slate-500 hover:text-slate-300 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Ara"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            <Link
              href="/giris"
              className="hidden lg:block px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Giriş Yap
            </Link>

            <Link
              href="/abone-ol"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-900 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25"
              style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}
            >
              Başlayın
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
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

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-700/40 bg-[#0a0f1e] anim-slide-down">
          {/* Mobile search */}
          <div className="px-5 pt-4 pb-2">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-white/5 border border-slate-700 text-slate-100 placeholder-slate-500 px-4 py-2.5 pr-10 text-sm rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <nav className="px-3 pb-4 space-y-0.5">
            {NAV.map((item) =>
              item.items ? (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? "rotate-180 text-amber-400" : "text-slate-600"}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="ml-3 mt-1 border-l border-slate-700/50 pl-3 space-y-0.5">
                      {item.items.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="text-base">{link.icon}</span>
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
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}

            <div className="pt-3 px-1 flex flex-col gap-2">
              <Link
                href="/giris"
                className="block text-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Giriş Yap
              </Link>
              <Link
                href="/abone-ol"
                className="block text-center px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 transition-all"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}
                onClick={() => setMobileOpen(false)}
              >
                Başlayın →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
