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
    ],
  },
  {
    title: "Hesap",
    links: [
      { label: "Müşteri Paneli", href: "/uygulama" },
      { label: "Ücretsiz Başla", href: "/kayit" },
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
    <footer style={{ background: "#0f172a" }} className="border-t border-white/[0.06]">

      {/* ── Brand + social strip ── */}
      <div style={{ background: "#1e293b" }} className="border-b border-white/[0.06]">
        <div className="max-w-screen-xl mx-auto px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Logo + tagline */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-2 w-fit group">
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
            <p className="text-slate-400 text-sm leading-relaxed" style={{ maxWidth: "36ch" }}>
              Yapay zeka destekli içerik üretimi, sosyal medya yönetimi ve otomatik yayıncılık platformu.
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Link columns ── */}
      <div className="max-w-screen-xl mx-auto px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
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

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-screen-xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-600">
            © {new Date().getFullYear()} Kurumsal, Ltd. Tüm hakları saklıdır.
          </span>
          <div className="flex items-center gap-5">
            {[
              { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
              { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
              { label: "Çerezler", href: "/cerezler" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-slate-600 hover:text-slate-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
