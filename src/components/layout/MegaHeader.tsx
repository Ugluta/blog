"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { currencyData, weatherData } from "@/lib/mockData";

const navItems = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Haberler",
    href: "/haberler",
    dropdown: [
      { label: "Teknoloji", href: "/haberler/teknoloji" },
      { label: "Ekonomi", href: "/haberler/ekonomi" },
      { label: "Dünya", href: "/haberler/dunya" },
      { label: "Spor", href: "/haberler/spor" },
      { label: "Sağlık", href: "/haberler/saglik" },
      { label: "Kültür", href: "/haberler/kultur" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Galeri", href: "/galeri" },
  { label: "Ürünler", href: "/urunler" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];

function getTurkishDate() {
  const now = new Date();
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

export default function MegaHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileNewsOpen, setMobileNewsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const menuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleMenuEnter = (label: string) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => setActiveMenu(null), 100);
  };

  const handleDropdownEnter = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
  };

  const handleDropdownLeave = () => {
    menuTimerRef.current = setTimeout(() => setActiveMenu(null), 100);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = searchValue.trim();
    if (val) {
      router.push(`/arama?q=${encodeURIComponent(val)}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const onMobileSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input") as HTMLInputElement;
    const val = input.value.trim();
    if (val) {
      router.push(`/arama?q=${encodeURIComponent(val)}`);
      setMobileOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-2xl backdrop-blur-sm" : ""
      }`}
      style={{ backgroundColor: "#0a0f1e" }}
    >
      {/* ── Top Bar (30px) ──────────────────────────────── */}
      <div className="border-b border-slate-700/50" style={{ backgroundColor: "#0a0f1e" }}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-[30px] text-[11px] text-slate-400">
            {/* Left: Turkish date */}
            <span className="hidden sm:block tracking-wide">{getTurkishDate()}</span>

            {/* Center: Currency ticker — USD/EUR/GBP */}
            <div className="flex items-center gap-5 overflow-hidden">
              {currencyData.slice(0, 3).map((c) => (
                <div key={c.code} className="flex items-center gap-1 whitespace-nowrap">
                  <span className="text-slate-500 font-medium">{c.code}</span>
                  <span className="font-semibold text-slate-200">{c.buy.toFixed(2)}</span>
                  <span
                    className={`font-medium ${c.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {c.change >= 0 ? "▲" : "▼"}
                    {Math.abs(c.change).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Right: Weather + social icons */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1 text-slate-300">
                <span className="text-xs">{weatherData.emoji}</span>
                <span className="font-semibold">{weatherData.temp}°C</span>
                <span className="text-slate-500 hidden lg:inline ml-0.5">{weatherData.city}</span>
              </div>
              <div className="flex items-center gap-2 ml-1">
                <a
                  href="https://twitter.com"
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                  aria-label="X/Twitter"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Header (56px sticky) ───────────────────── */}
      <div
        className={`border-b border-slate-700/50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-md" : ""
        }`}
        style={{ backgroundColor: "#0F172A" }}
      >
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex flex-col leading-tight">
              <span
                className="text-xl font-black tracking-[0.15em] uppercase"
                style={{ color: "#F59E0B" }}
              >
                KURUMSAL
              </span>
              <span className="text-[9px] tracking-[0.22em] text-slate-400 uppercase font-light">
                Güvenilir Haber &amp; Analiz
              </span>
            </Link>

            {/* Desktop nav — centered */}
            <nav className="hidden lg:flex items-center h-14 flex-1 justify-center">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    className="relative h-14 flex items-center"
                    onMouseEnter={() => handleMenuEnter(item.label)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <button
                      className={`flex items-center gap-1 px-4 h-14 text-sm font-medium transition-colors border-b-2 ${
                        pathname.startsWith(item.href)
                          ? "text-amber-400 border-amber-500"
                          : "text-slate-300 hover:text-amber-400 border-transparent hover:border-amber-500/50"
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${
                          activeMenu === item.label ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Invisible bridge — prevents gap between button and dropdown */}
                    <div className="absolute top-full left-0 h-1 w-full" />

                    {/* Dropdown panel */}
                    {activeMenu === item.label && (
                      <div
                        className="absolute top-[calc(100%+1px)] left-0 w-52 z-50 anim-slide-down"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
                        style={{
                          backgroundColor: "#0F172A",
                          border: "1px solid rgba(51,65,85,0.6)",
                          borderTop: "2px solid #F59E0B",
                          borderRadius: "0 0 2px 2px",
                        }}
                      >
                        <ul className="py-1">
                          {item.dropdown.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className={`block px-4 py-2.5 text-sm transition-colors border-l-2 ${
                                  pathname === link.href
                                    ? "text-amber-400 border-amber-500 bg-slate-800/40"
                                    : "text-slate-300 hover:text-amber-400 border-transparent hover:border-amber-500 hover:bg-slate-800/60"
                                }`}
                                onClick={() => setActiveMenu(null)}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-slate-700/60 px-4 py-2.5">
                          <Link
                            href="/haberler"
                            className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                            onClick={() => setActiveMenu(null)}
                          >
                            Tüm Haberler →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-4 h-14 flex items-center text-sm font-medium transition-colors border-b-2 ${
                      pathname === item.href
                        ? "text-amber-400 border-amber-500"
                        : "text-slate-300 hover:text-amber-400 border-transparent hover:border-amber-500/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right: search icon + Abone Ol button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Inline expanding search */}
              <div className="relative flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Ara..."
                      className="w-44 bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                      style={{ borderRadius: "2px" }}
                      onBlur={() => {
                        if (!searchValue) setSearchOpen(false);
                      }}
                    />
                    <button
                      type="button"
                      className="ml-1 p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchValue("");
                      }}
                      aria-label="Aramayı kapat"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <button
                    className="hidden lg:flex p-2 text-slate-400 hover:text-amber-400 transition-colors"
                    onClick={() => setSearchOpen(true)}
                    aria-label="Arama"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <a
                href="/abone-ol"
                className="hidden sm:inline-flex items-center px-4 py-1.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F59E0B", borderRadius: "2px" }}
              >
                Abone Ol
              </a>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 text-slate-400 hover:text-amber-400 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menüyü aç/kapat"
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu (full-width slide-down) ─────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden border-b border-slate-700/50 anim-slide-down"
          style={{ backgroundColor: "#0F172A" }}
        >
          {/* Search input */}
          <div className="px-4 pt-3 pb-2">
            <form onSubmit={onMobileSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Haber, blog, konu ara..."
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 px-4 py-2 pr-10 text-sm focus:outline-none focus:border-amber-500"
                  style={{ borderRadius: "2px" }}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Nav links stacked */}
          <nav className="px-4 pb-4 space-y-0.5">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 transition-colors"
                      style={{ borderRadius: "2px" }}
                      onClick={() => setMobileNewsOpen(!mobileNewsOpen)}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${
                          mobileNewsOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {/* Accordion sub-items */}
                    {mobileNewsOpen && (
                      <div className="ml-4 mt-0.5 border-l border-slate-700/50 pl-3 space-y-0.5">
                        {item.dropdown.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-3 py-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                        <Link
                          href="/haberler"
                          className="block px-3 py-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          Tüm Haberler →
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-3 py-2.5 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "text-amber-400 bg-slate-800/60"
                        : "text-slate-300 hover:text-amber-400 hover:bg-slate-800/60"
                    }`}
                    style={{ borderRadius: "2px" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3">
              <a
                href="/abone-ol"
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-900"
                style={{ backgroundColor: "#F59E0B", borderRadius: "2px" }}
                onClick={() => setMobileOpen(false)}
              >
                Abone Ol
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
