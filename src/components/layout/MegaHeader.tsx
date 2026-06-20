"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const TOP_LINKS = [
  { label: "Belgelendirme", href: "/docs" },
  { label: "Topluluk", href: "/topluluk" },
  { label: "API Referansı", href: "/api-referansi" },
];

const TOP_DROPDOWNS = [
  {
    label: "Destek",
    items: [
      { label: "Destek Merkezi", href: "/destek" },
      { label: "SSS", href: "/sss" },
      { label: "Değişiklik Günlüğü", href: "/changelog" },
    ],
  },
  {
    label: "Hesabım",
    items: [
      { label: "Müşteri Paneli", href: "/uygulama" },
      { label: "Profil Ayarları", href: "/profil" },
      { label: "Çıkış Yap", href: "/cikis" },
    ],
  },
];

const NAV = [
  { label: "Yenilikler", href: "/blog" },
  {
    label: "Keşfedin",
    items: [
      { label: "Platform Turu", desc: "Tüm özellikleri keşfedin", href: "/urunler" },
      { label: "Kullanım Senaryoları", desc: "Sektöre özel çözümler", href: "/cozumler" },
      { label: "Başarı Hikayeleri", desc: "Müşteri deneyimleri", href: "/blog" },
    ],
  },
  {
    label: "Ürünler",
    items: [
      { label: "İçerik Yönetimi", desc: "Haber ve blog yazıları oluşturun", href: "/uygulama" },
      { label: "Sosyal Medya", desc: "Tüm platformlara otomatik yayın", href: "/uygulama/sosyal-hesaplar" },
      { label: "Video Üretimi", desc: "Yapay zeka ile video oluşturun", href: "/uygulama/video-olustur" },
      { label: "Analitik", desc: "Performansınızı takip edin", href: "/uygulama/analitik" },
    ],
  },
  {
    label: "Çözümler",
    items: [
      { label: "Medya Şirketleri", desc: "Büyük ölçekli içerik operasyonları", href: "/cozumler/medya" },
      { label: "Ajanslar", desc: "Çok müşterili içerik yönetimi", href: "/cozumler/ajanslar" },
      { label: "Girişimciler", desc: "Hızlı büyüme için içerik araçları", href: "/cozumler/girisimciler" },
    ],
  },
  { label: "Fiyatlandırma", href: "/fiyatlandirma" },
];

const ANNOUNCEMENTS = [
  { tag: "Yeni", text: "AI İçerik Üretimi v2.0 yayınlandı — daha hızlı, daha akıllı", href: "/blog" },
  { tag: "Duyuru", text: "Sosyal medya entegrasyonları genişletildi: TikTok ve Pinterest eklendi", href: "/urunler" },
  { tag: "Webinar", text: "Yapay Zeka ile İçerik Stratejisi — 15 Temmuz, ücretsiz kayıt", href: "/iletisim" },
  { tag: "Güncelleme", text: "Platform performansı %40 iyileştirildi, yeni dashboard arayüzü", href: "/uygulama" },
];

function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % ANNOUNCEMENTS.length);
    }, 4000);
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
    <div className="relative bg-amber-50 border-b border-amber-100 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-5 h-9 flex items-center justify-between gap-4">
        <button onClick={() => go(-1)} className="flex-shrink-0 text-amber-400 hover:text-amber-600 transition-colors" aria-label="Önceki">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <Link href={ann.href} className="flex-1 flex items-center justify-center gap-2.5 min-w-0 group" key={current}>
          <span className="flex-shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            {ann.tag}
          </span>
          <span className="text-xs text-amber-900 group-hover:text-amber-950 transition-colors truncate font-medium">
            {ann.text}
          </span>
          <svg className="w-3 h-3 flex-shrink-0 text-amber-400 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <div className="flex-shrink-0 flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1">
            {ANNOUNCEMENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); setCurrent(i); start(); }}
                className={`h-1 rounded-full transition-all ${i === current ? "bg-amber-500 w-4" : "bg-amber-300 w-1.5 hover:bg-amber-400"}`}
              />
            ))}
          </div>
          <button onClick={() => go(1)} className="text-amber-400 hover:text-amber-600 transition-colors" aria-label="Sonraki">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={() => setVisible(false)} className="text-amber-300 hover:text-amber-500 transition-colors ml-0.5" aria-label="Kapat">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MegaHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeTopMenu, setActiveTopMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const topTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
    setActiveTopMenu(null);
  }, [pathname]);

  const open = (label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveMenu(label);
  };
  const close = () => { timerRef.current = setTimeout(() => setActiveMenu(null), 120); };
  const keep = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const openTop = (label: string) => {
    if (topTimerRef.current) clearTimeout(topTimerRef.current);
    setActiveTopMenu(label);
  };
  const closeTop = () => { topTimerRef.current = setTimeout(() => setActiveTopMenu(null), 120); };
  const keepTop = () => { if (topTimerRef.current) clearTimeout(topTimerRef.current); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const v = searchValue.trim();
    if (v) { router.push(`/arama?q=${encodeURIComponent(v)}`); setSearchOpen(false); setSearchValue(""); }
  };

  return (
    <div className={`sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? "shadow-md" : ""}`}>

      {/* ── Top utility bar ── */}
      <div className="bg-[#f2f3f3] border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-5">
          <div className="flex items-center h-9 gap-5">

            {/* Language */}
            <button className="flex items-center gap-1 text-[11px] text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Türkçe
              <svg className="w-2.5 h-2.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Middle links */}
            <div className="hidden md:flex items-center gap-5 flex-1">
              {TOP_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-[11px] text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right dropdowns + avatar */}
            <div className="flex items-center gap-0.5 ml-auto">
              {TOP_DROPDOWNS.map((dd) => (
                <div
                  key={dd.label}
                  className="relative"
                  onMouseEnter={() => openTop(dd.label)}
                  onMouseLeave={closeTop}
                >
                  <button
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      activeTopMenu === dd.label ? "text-gray-900 bg-white/60" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {dd.label}
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeTopMenu === dd.label && (
                    <div
                      className="absolute top-full right-0 mt-0.5 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 z-50"
                      style={{ minWidth: 168 }}
                      onMouseEnter={keepTop}
                      onMouseLeave={closeTop}
                    >
                      {dd.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-1.5 text-[11px] text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Avatar */}
              <Link
                href="/uygulama"
                className="w-7 h-7 ml-1.5 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-5">
          <div className="flex items-center h-[56px] gap-6">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}
              >
                <span className="text-slate-900 font-black text-sm">K</span>
              </div>
              <span className="font-bold text-[17px] tracking-tight text-gray-900">
                Kurumsal<span className="text-amber-500">.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center flex-1">
              {NAV.map((item) =>
                item.items ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => open(item.label)}
                    onMouseLeave={close}
                  >
                    <button
                      className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium transition-colors rounded-md ${
                        activeMenu === item.label
                          ? "text-gray-900 bg-gray-100"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-3 h-3 transition-transform duration-150 ${activeMenu === item.label ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {activeMenu === item.label && (
                      <div
                        className="absolute top-[calc(100%+2px)] left-0 z-50"
                        style={{ minWidth: 264 }}
                        onMouseEnter={keep}
                        onMouseLeave={close}
                      >
                        <div className="bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/60 overflow-hidden">
                          <div className="p-1.5">
                            {item.items.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setActiveMenu(null)}
                                className="flex items-start gap-3 px-3.5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group/link"
                              >
                                <div>
                                  <p className="text-[13px] font-semibold text-gray-800 group-hover/link:text-amber-600 transition-colors leading-tight">
                                    {link.label}
                                  </p>
                                  <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{link.desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/70">
                            <Link
                              href="/uygulama"
                              onClick={() => setActiveMenu(null)}
                              className="text-[11px] text-amber-600 hover:text-amber-500 font-semibold flex items-center gap-1 transition-colors"
                            >
                              Tümünü gör →
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
                    className={`px-3.5 py-2 text-[13px] font-medium transition-colors rounded-md ${
                      pathname === item.href || pathname.startsWith(item.href! + "/")
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto flex-shrink-0">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Ara..."
                    className="w-44 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 px-3 py-1.5 text-sm rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                    onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchValue(""); }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Arama
                </button>
              )}

              <Link
                href="/giris"
                className="hidden lg:block px-3 py-1.5 text-[13px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                Giriş Yap
              </Link>

              <Link
                href="/uygulama"
                className="hidden sm:block px-4 py-2 text-[13px] font-bold text-white rounded-lg transition-all hover:opacity-90 ml-1"
                style={{ background: "#0f1111" }}
              >
                Başlayın
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex items-center justify-center w-9 h-9 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all ml-1"
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
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-5 pt-3 pb-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 px-4 py-2.5 pr-10 text-sm rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? "rotate-180 text-amber-500" : "text-gray-400"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="ml-3 mt-0.5 border-l-2 border-gray-100 pl-3 space-y-0.5">
                        {item.items.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-3 py-2 rounded-lg text-[12px] text-gray-600 hover:text-amber-600 hover:bg-gray-50 transition-colors"
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
                    className="block px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="pt-3 px-1 flex flex-col gap-2">
                <Link
                  href="/giris"
                  className="block text-center px-4 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 border border-gray-200 hover:border-gray-300 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/uygulama"
                  className="block text-center px-4 py-2.5 rounded-xl text-[13px] font-bold text-white"
                  style={{ background: "#0f1111" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Başlayın →
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Announcement slider ── */}
      <AnnouncementBar />
    </div>
  );
}
