"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ---------- types ----------

type DropItem = {
  label: string;
  desc: string;
  href: string;
  iconBg?: string;
  iconColor?: string;
};

type NavEntry =
  | { label: string; href: string; items?: undefined }
  | { label: string; href?: undefined; items: DropItem[] };

// ---------- data ----------

const UTILITY_LINKS = [
  { label: "Belgelendirme", href: "/docs" },
  { label: "Topluluk", href: "/topluluk" },
  { label: "Destek", href: "/destek" },
];

const NAV: NavEntry[] = [
  {
    label: "Ürünler",
    items: [
      { label: "İçerik Yönetimi", desc: "Blog ve makale oluşturun", href: "/uygulama", iconBg: "#FEF3C7", iconColor: "#D97706" },
      { label: "Sosyal Medya", desc: "Tüm platformlara otomatik yayın", href: "/uygulama/sosyal-hesaplar", iconBg: "#D1FAE5", iconColor: "#059669" },
      { label: "Video Üretimi", desc: "AI ile video oluşturun", href: "/uygulama/video-olustur", iconBg: "#DBEAFE", iconColor: "#2563EB" },
      { label: "Analitik", desc: "Performans analizleri", href: "/uygulama/analitik", iconBg: "#EDE9FE", iconColor: "#7C3AED" },
    ],
  },
  {
    label: "Çözümler",
    items: [
      { label: "Medya Şirketleri", desc: "Büyük ölçekli operasyonlar", href: "/cozumler/medya" },
      { label: "Ajanslar", desc: "Çok müşterili içerik yönetimi", href: "/cozumler/ajanslar" },
      { label: "Girişimciler", desc: "Hızlı büyüme araçları", href: "/cozumler/girisimciler" },
    ],
  },
  {
    label: "Geliştiriciler",
    items: [
      { label: "REST API", desc: "HTTP tabanlı entegrasyon", href: "/api-referansi" },
      { label: "SDK'lar", desc: "Geliştirici kütüphaneleri", href: "/docs" },
      { label: "Webhooks", desc: "Gerçek zamanlı bildirimler", href: "/docs/webhooks" },
      { label: "Belgelendirme", desc: "Teknik dokümanlar", href: "/docs" },
    ],
  },
  {
    label: "Kaynaklar",
    items: [
      { label: "Blog", desc: "Haberler ve güncellemeler", href: "/blog" },
      { label: "Değişiklik Günlüğü", desc: "Sürüm notları", href: "/changelog" },
      { label: "Topluluk", desc: "Geliştirici forumu", href: "/topluluk" },
      { label: "Destek", desc: "Yardım merkezi", href: "/destek" },
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

// ---------- Announcement bar ----------

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
    <div className="bg-amber-50 border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-4">
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
        <div className="flex items-center gap-1.5 flex-shrink-0">
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

// ---------- Product icon boxes for dropdown ----------

function ProductIcon({ label, iconBg, iconColor }: { label: string; iconBg: string; iconColor: string }) {
  const paths: Record<string, JSX.Element> = {
    "İçerik Yönetimi": (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 7.5h8M2 11h5" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    "Sosyal Medya": (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <circle cx="4" cy="8" r="2" stroke={iconColor} strokeWidth="1.5" />
        <circle cx="12" cy="4" r="2" stroke={iconColor} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" stroke={iconColor} strokeWidth="1.5" />
        <path d="M6 7L10 5M6 9L10 11" stroke={iconColor} strokeWidth="1.5" />
      </svg>
    ),
    "Video Üretimi": (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="4" width="9" height="8" rx="1.5" stroke={iconColor} strokeWidth="1.5" />
        <path d="M10 6.5l4-2v7l-4-2V6.5z" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    "Analitik": (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 11.5L5.5 8l3 3L13 4.5" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: iconBg }}
    >
      {paths[label] ?? null}
    </div>
  );
}

// ---------- Main component ----------

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

      {/* ── Top utility bar ── */}
      <div className="bg-slate-900 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
          <span className="text-slate-500 text-xs hidden sm:block font-medium">
            Türkiye&apos;nin AI içerik platformu
          </span>
          <div className="flex items-center gap-4 ml-auto">
            {UTILITY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors hidden md:block"
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-3.5 bg-slate-700 hidden md:block" />
            <Link href="/giris" className="text-xs text-slate-300 hover:text-white transition-colors">
              Giriş Yap
            </Link>
            <Link
              href="/kayit"
              className="text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors px-3 py-1 rounded"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <header className="bg-white border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-[68px] gap-8">

            {/* Brand */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}
              >
                <span className="text-black font-black text-sm">K</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-[15px] text-gray-900 tracking-tight">Kurumsal</span>
                <span className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase mt-0.5">Platformu</span>
              </div>
            </Link>

            {/* Desktop nav */}
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
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-150 ${
                        activeMenu === item.label
                          ? "bg-amber-50 text-amber-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-150 flex-shrink-0 ${
                          activeMenu === item.label ? "rotate-180 text-amber-500" : "text-gray-400"
                        }`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {activeMenu === item.label && (
                      <div
                        className="absolute top-[calc(100%+6px)] left-0 z-50"
                        onMouseEnter={keep}
                        onMouseLeave={close}
                      >
                        <div
                          className="bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-200/80 overflow-hidden"
                          style={{ minWidth: item.label === "Ürünler" ? 480 : 288 }}
                        >
                          {item.label === "Ürünler" ? (
                            /* 2×2 grid for products */
                            <div className="p-3 grid grid-cols-2 gap-1">
                              {item.items.map((link) => (
                                <Link
                                  key={link.label}
                                  href={link.href}
                                  onClick={() => setActiveMenu(null)}
                                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/link"
                                >
                                  {link.iconBg && link.iconColor && (
                                    <ProductIcon label={link.label} iconBg={link.iconBg} iconColor={link.iconColor} />
                                  )}
                                  <div className="pt-0.5 min-w-0">
                                    <div className="text-[13px] font-semibold text-gray-800 group-hover/link:text-gray-900 leading-tight">
                                      {link.label}
                                    </div>
                                    <div className="text-[11px] text-gray-500 mt-1 leading-tight">{link.desc}</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            /* Single column for other dropdowns */
                            <div className="p-2">
                              {item.items.map((link) => (
                                <Link
                                  key={link.label}
                                  href={link.href}
                                  onClick={() => setActiveMenu(null)}
                                  className="flex flex-col px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group/link"
                                >
                                  <span className="text-[13px] font-semibold text-gray-800 group-hover/link:text-gray-900 leading-tight">
                                    {link.label}
                                  </span>
                                  <span className="text-[11px] text-gray-500 mt-0.5 leading-tight">{link.desc}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={`px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                      pathname === item.href
                        ? "bg-amber-50 text-amber-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
                    className="w-44 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 px-3.5 py-1.5 text-sm rounded-lg focus:outline-none focus:border-amber-300 focus:bg-white transition-all"
                    onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchValue(""); }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  aria-label="Ara"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {/* CTA */}
              <Link
                href="/uygulama"
                className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 text-white text-[13px] font-bold rounded-full hover:opacity-90 hover:shadow-lg hover:shadow-amber-500/25 transition-all ml-1"
                style={{ background: "linear-gradient(135deg,#FBBF24 0%,#F59E0B 50%,#EA580C 100%)" }}
              >
                Müşteri Paneli
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
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
            <div className="px-6 pt-3 pb-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 px-4 py-2.5 pr-10 text-sm rounded-lg focus:outline-none focus:border-amber-300 transition-colors"
                  />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
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
                      <div className="ml-3 mt-0.5 border-l-2 border-amber-100 pl-3 space-y-0.5">
                        {item.items.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="block px-3 py-2 rounded-lg text-[12px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
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
                    className={`block px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                      pathname === item.href
                        ? "text-amber-700 bg-amber-50"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="pt-3 px-1 flex flex-col gap-2">
                <Link
                  href="/giris"
                  className="block text-center px-4 py-2.5 rounded-full text-[13px] font-medium text-gray-700 border border-gray-200 hover:border-gray-300 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/uygulama"
                  className="block text-center px-4 py-2.5 rounded-full text-[13px] font-bold text-white transition-colors"
                  style={{ background: "linear-gradient(135deg,#FBBF24,#EA580C)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Müşteri Paneli ↗
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Announcement bar ── */}
      <AnnouncementBar />
    </div>
  );
}
