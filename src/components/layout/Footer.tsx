import Link from "next/link";

const COLS = [
  {
    title: "Platform",
    links: [
      { label: "İçerik Yönetimi", href: "/uygulama" },
      { label: "Sosyal Medya", href: "/uygulama/sosyal-hesaplar" },
      { label: "Video Üretimi", href: "/uygulama/video-olustur" },
      { label: "Analitik", href: "/uygulama/analitik" },
      { label: "Fiyatlandırma", href: "/fiyatlandirma" },
      { label: "API", href: "/api-referansi" },
    ],
  },
  {
    title: "Kaynaklar",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Belgelendirme", href: "/docs" },
      { label: "Değişiklik Günlüğü", href: "/changelog" },
      { label: "Yol Haritası", href: "/roadmap" },
      { label: "Topluluk", href: "/topluluk" },
      { label: "Destek", href: "/destek" },
    ],
  },
  {
    title: "Şirket",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "İletişim", href: "/iletisim" },
      { label: "Kariyer", href: "/kariyer" },
      { label: "Ortaklık", href: "/ortaklik" },
      { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
      { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
    ],
  },
  {
    title: "Hesap",
    links: [
      { label: "Müşteri Paneli", href: "/uygulama" },
      { label: "Ücretsiz Başla", href: "/uygulama" },
      { label: "Giriş Yap", href: "/giris" },
      { label: "Kayıt Ol", href: "/kayit" },
    ],
  },
];

const SOCIAL = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Twitter/X",
    href: "https://twitter.com",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0c0c0e" }} className="border-t border-white/[0.06]">

      {/* ── Main grid ── */}
      {/*
        Altın oran yerleşimi: Sol sütun genişliği ≈ 1.618 × nav sütun genişliği
        5 birim toplam: 1.618 (logo) + 4 × 1 (nav) = 5.618 birim
        Logo sütunu ≈ %28.8, her nav sütunu ≈ %17.8
        CSS grid: [1.618fr_1fr_1fr_1fr_1fr]
      */}
      <div className="max-w-screen-xl mx-auto px-8 pt-16 pb-12">
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "1.618fr 1fr 1fr 1fr 1fr" }}
        >
          {/* Brand column */}
          <div className="pr-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}
              >
                <span className="text-black font-black text-sm">K</span>
              </div>
              <span className="text-white font-bold text-base tracking-tight">
                Kurumsal<span className="text-amber-400">.</span>
              </span>
            </Link>

            {/* Description */}
            <p className="text-sm text-zinc-400 leading-[1.7] mb-6" style={{ maxWidth: "22ch" }}>
              Yapay zeka destekli içerik üretimi, sosyal medya yönetimi ve otomatik yayıncılık platformu.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-1.5 mb-8">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/8 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Mobile app */}
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600 mb-3">
              Mobil Uygulama
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all w-fit group"
              >
                <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-12.6-3.18-3.18L3.18 23.76zM20.47 10.2l-2.7-1.55-3.57 3.57 3.57 3.57 2.73-1.57c.78-.45.78-1.57-.03-2.02zM2.01.56C1.86.76 1.77 1.02 1.77 1.33v21.34c0 .31.09.57.24.77l.12.11L13.38 12 2.13.45.01.56zM13.77 8.57l-10.59-10.6c-.16-.16-.35-.24-.56-.24-.3 0-.55.19-.69.48L13.77 8.57z" />
                </svg>
                <div>
                  <p className="text-[9px] text-zinc-500 leading-none uppercase tracking-wide">Get it on</p>
                  <p className="text-xs font-semibold text-zinc-200 leading-tight">Google Play</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all w-fit group"
              >
                <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <p className="text-[9px] text-zinc-500 leading-none uppercase tracking-wide">Download on the</p>
                  <p className="text-xs font-semibold text-zinc-200 leading-tight">App Store</p>
                </div>
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-white mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Bottom bar ── */}
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="flex items-center justify-between py-5 gap-4">
          <span className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Kurumsal, Ltd. Tüm hakları saklıdır.
          </span>
          <div className="flex items-center gap-5">
            <a
              href="mailto:destek@kurumsal.com.tr"
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              destek@kurumsal.com.tr
            </a>
            <div className="flex items-center gap-1">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-tagline */}
        <p className="pb-5 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800">
          Yapay Zeka Destekli İçerik Platformu
        </p>
      </div>

    </footer>
  );
}
