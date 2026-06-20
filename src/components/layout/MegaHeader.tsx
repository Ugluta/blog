"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "API",
    items: [
      { label: "REST API", desc: "HTTP tabanlı API entegrasyonu", href: "/api-referansi" },
      { label: "Webhooks", desc: "Gerçek zamanlı olay bildirimleri", href: "/docs/webhooks" },
      { label: "SDK'lar", desc: "Geliştirici kütüphaneleri", href: "/docs" },
    ],
  },
  {
    label: "Ürünler",
    items: [
      { label: "İçerik Yönetimi", desc: "Blog ve makale oluşturun", href: "/uygulama" },
      { label: "Sosyal Medya", desc: "Tüm platformlara otomatik yayın", href: "/uygulama/sosyal-hesaplar" },
      { label: "Video Üretimi", desc: "AI ile video oluşturun", href: "/uygulama/video-olustur" },
      { label: "Analitik", desc: "Performans analizleri", href: "/uygulama/analitik" },
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
    label: "Kaynaklar",
    items: [
      { label: "Blog", desc: "Haberler ve güncellemeler", href: "/blog" },
      { label: "Belgelendirme", desc: "Teknik dokümanlar", href: "/docs" },
      { label: "Değişiklik Günlüğü", desc: "Sürüm notları", href: "/changelog" },
      { label: "Topluluk", desc: "Geliştirici forumu", href: "/topluluk" },
    ],
  },
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
      {/* ── Single-tier header (OpenAI style) ── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-[60px] gap-6">

            {/* Brand */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}
              >
                <span className="text-black font-black text-xs">K</span>
              </div>
              <span className="font-semibold text-[15px] text-gray-900 tracking-tight">
                Kurumsal Platformu
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
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[13.5px] transition-colors ${
                        activeMenu === item.label
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                        className="absolute top-[calc(100%+4px)] left-0 z-50"
                        style={{ minWidth: 240 }}
                        onMouseEnter={keep}
                        onMouseLeave={close}
                      >
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/60 overflow-hidden">
                          <div className="p-1.5">
                            {item.items.map((link) => (
                              <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setActiveMenu(null)}
                                className="flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group/link"
                              >
                                <span className="text-[13px] font-medium text-gray-800 group-hover/link:text-gray-900 leading-tight">
                                  {link.label}
                                </span>
                                <span className="text-[11px] text-gray-400 mt-0.5 leading-tight">{link.desc}</span>
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
                    className={`px-3 py-1.5 rounded-full text-[13.5px] transition-colors ${
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                    className="w-44 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 px-3.5 py-1.5 text-sm rounded-full focus:outline-none focus:border-gray-400 transition-all"
                    onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchValue(""); }}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
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
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-full hover:bg-gray-800 transition-colors ml-1"
              >
                Müşteri Paneli
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex items-center justify-center w-9 h-9 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all ml-1"
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
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 px-4 py-2.5 pr-10 text-sm rounded-full focus:outline-none focus:border-gray-400 transition-colors"
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
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? "rotate-180 text-gray-600" : "text-gray-400"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="ml-3 mt-0.5 border-l-2 border-gray-100 pl-3 space-y-0.5">
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
                    className={`block px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                      pathname === item.href
                        ? "text-gray-900 bg-gray-50"
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
                  className="block text-center px-4 py-2.5 rounded-full text-[13px] font-medium text-gray-700 border border-gray-200 hover:border-gray-300 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/uygulama"
                  className="block text-center px-4 py-2.5 rounded-full text-[13px] font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Müşteri Paneli ↗
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
