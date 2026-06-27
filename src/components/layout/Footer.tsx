import Link from 'next/link';

const LINKS: Record<string, { label: string; href: string }[]> = {
  'İçerik': [
    { label: 'Blog Yazıları', href: '/haberler' },
    { label: 'Projeler', href: '/projeler' },
    { label: 'Kod Paylaşımları', href: '/kod' },
    { label: 'Galeri', href: '/galeri' },
  ],
  'Araçlar': [
    { label: 'OCR — Görüntüden Metin', href: '/ocr' },
    { label: 'AI Belge Oluştur', href: '/belge-olustur' },
    { label: 'Soru Bankası', href: '/sorular' },
    { label: 'Dosyalar', href: '/dosyalar' },
  ],
  'Kurumsal': [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Hizmetler', href: '/hizmetler' },
    { label: 'İletişim', href: '/iletisim' },
    { label: 'Üyelik Paketleri', href: '/uyelik' },
  ],
  'Yasal': [
    { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
    { label: 'Gizlilik Politikası', href: '/gizlilik' },
    { label: 'KVKK', href: '/kvkk' },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 overflow-hidden">
      {/* Gradient top accent */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_80%_0%,rgba(99,102,241,0.12),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">

          {/* Brand */}
          <div className="col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <span className="text-white font-mono font-bold text-sm">&lt;/&gt;</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[16px] font-extrabold text-white tracking-tight">Blog</span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-400">developer</span>
              </div>
            </Link>
            <p className="text-[13px] leading-relaxed text-slate-500 max-w-xs">
              Fikirler, projeler ve kod tek yerde. İçerik üret, paylaş ve dağıt.
            </p>
            {/* Newsletter */}
            <div className="flex items-center gap-2 max-w-xs">
              <input type="email" placeholder="E-posta adresin"
                className="flex-1 h-10 px-3 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600" />
              <button className="h-10 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all">
                Abone Ol
              </button>
            </div>
            <div className="flex items-center gap-2">
              {[
                { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'GitHub', path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' },
                { label: 'YouTube', path: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-600 hover:bg-slate-800 flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 fill-slate-400 group-hover:fill-blue-400 transition-colors" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[13px] text-slate-400 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-slate-800/70">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-500">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-300">Blog</span>. Tüm hakları saklıdır.
          </p>
          <p className="text-[12px] text-slate-600">
            <span className="font-mono text-blue-400">&lt;/&gt;</span> ile geliştirildi
          </p>
        </div>
      </div>
    </footer>
  );
}
