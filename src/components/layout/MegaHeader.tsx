"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { currencyData, weatherData } from "@/lib/mockData";

const navItems = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Haberler",
    href: "#",
    mega: true,
    columns: [
      [
        { label: "💻 Teknoloji", href: "/haberler/teknoloji" },
        { label: "📈 Ekonomi", href: "/haberler/ekonomi" },
        { label: "🌍 Dünya", href: "/haberler/dunya" },
      ],
      [
        { label: "⚽ Spor", href: "/haberler/spor" },
        { label: "🏥 Sağlık", href: "/haberler/saglik" },
        { label: "🎭 Kültür", href: "/haberler/kultur" },
      ],
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Ürünler & Hizmetler", href: "/urunler" },
  { label: "Kod Örnekleri", href: "/kod-ornekleri" },
  { label: "Galeri", href: "/galeri" },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-2xl header-scrolled" : ""
      }`}
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* Top Bar */}
      <div className="border-b border-slate-700/50 bg-slate-900/80">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-9 text-xs text-slate-400">
            {/* Date */}
            <span className="hidden sm:block font-inter">{getTurkishDate()}</span>

            {/* Currency Ticker */}
            <div className="flex items-center gap-4 overflow-hidden">
              {currencyData.map((c) => (
                <div key={c.code} className="flex items-center gap-1 whitespace-nowrap">
                  <span className="text-slate-500">{c.code}</span>
                  <span className="font-semibold text-slate-200">
                    {c.buy.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      c.change >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {c.change >= 0 ? "▲" : "▼"}
                    {Math.abs(c.change).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Weather + Social */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1 text-slate-300">
                <span>{weatherData.emoji}</span>
                <span className="font-semibold">{weatherData.temp}°C</span>
                <span className="text-slate-500 hidden lg:inline">
                  {weatherData.city}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <a
                  href="https://twitter.com"
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                  aria-label="Twitter/X"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-slate-700/50" style={{ backgroundColor: "#0F172A" }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex flex-col leading-tight">
              <span
                className="text-2xl font-black tracking-widest uppercase"
                style={{ color: "#F59E0B", fontFamily: "'Inter', sans-serif" }}
              >
                KURUMSAL
              </span>
              <span className="text-[10px] tracking-[0.2em] text-slate-400 uppercase font-light">
                Güvenilir Haber &amp; Analiz
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Haber, blog, konu ara..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* CTA + Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              <a
                href="/abone-ol"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-slate-900 transition-colors"
                style={{ backgroundColor: "#F59E0B" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Abone Ol
              </a>
              <button
                className="lg:hidden p-2 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menüyü aç/kapat"
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
      </div>

      {/* Navigation Bar */}
      <div className="hidden lg:block bg-slate-800/80 border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-11">
            {navItems.map((item) =>
              item.mega ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button className="flex items-center gap-1 px-4 h-11 text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors border-b-2 border-transparent hover:border-amber-400">
                    {item.label}
                    <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Mega Dropdown */}
                  <div className="absolute top-full left-0 w-72 bg-slate-800 border border-slate-700 rounded-b-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="p-4 grid grid-cols-2 gap-1">
                      {item.columns?.map((col, ci) => (
                        <div key={ci} className="space-y-1">
                          {col.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-700 px-4 py-2">
                      <Link
                        href="/haberler"
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Tüm Haberleri Gör →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 h-11 flex items-center text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors border-b-2 border-transparent hover:border-amber-400"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-800 border-b border-slate-700">
          {/* Mobile Search */}
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Ara..."
                className="w-full bg-slate-700 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-amber-500"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <nav className="px-4 pb-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.mega && item.columns && (
                  <div className="ml-4 mt-1 grid grid-cols-2 gap-1">
                    {item.columns.flat().map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-3 py-1.5 text-xs text-slate-400 hover:text-amber-400 rounded-md transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2">
              <a
                href="/abone-ol"
                className="block w-full text-center px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-900"
                style={{ backgroundColor: "#F59E0B" }}
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
