import Link from 'next/link';

const LINKS: Record<string, { label: string; href: string }[]> = {
  Dosyalar: [
    { label: 'Tüm Dosyalar', href: '/dosyalar' },
    { label: 'Yıllık Planlar', href: '/dosyalar?kategori=yillik-planlar' },
    { label: 'Ders Planları', href: '/dosyalar?kategori=ders-planlari' },
    { label: 'Sınav Soruları', href: '/dosyalar?kategori=sinav-sorulari' },
    { label: 'Çalışma Kağıtları', href: '/dosyalar?kategori=calisma-kagitlari' },
    { label: 'Dosya Yükle', href: '/dosyalar/yukle' },
  ],
  'İçerik & Topluluk': [
    { label: 'Haberler', href: '/haberler' },
    { label: 'Duyurular', href: '/duyurular' },
    { label: 'Mevzuat', href: '/mevzuat' },
    { label: 'Soru Bankası', href: '/sorular' },
    { label: 'Gruplar', href: '/gruplar' },
    { label: 'Arşiv', href: '/arsiv' },
  ],
  Araçlar: [
    { label: 'OCR — Görüntüden Metin', href: '/ocr' },
    { label: 'AI Belge Oluştur', href: '/belge-olustur' },
    { label: 'Dosya Yükle', href: '/dosyalar/yukle' },
    { label: 'Üyelik Paketleri', href: '/uyelik' },
  ],
  Kurumsal: [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'İletişim', href: '/iletisim' },
    { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
    { label: 'Gizlilik Politikası', href: '/gizlilik' },
    { label: 'KVKK', href: '/kvkk' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <rect width="30" height="30" rx="8" fill="#1d4ed8" />
                <path d="M8 10h14M8 15h9M8 20h11" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span className="text-[16px] font-semibold text-white tracking-tight">
                Öğretmen<span className="text-blue-400">Evrak</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed text-slate-500">
              Öğretmen ve idareciler için kapsamlı materyal, evrak ve kaynak platformu.
            </p>
            <div className="flex items-center gap-2">
              {/* X / Twitter */}
              <a
                href="#"
                aria-label="X"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-slate-400" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-slate-400" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-slate-400" viewBox="0 0 24 24">
                  <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-slate-400 hover:text-white transition-colors"
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

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-600">
            &copy; {new Date().getFullYear()} ÖğretmenEvrak. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/kullanim-kosullari" className="text-[12px] text-slate-600 hover:text-slate-300 transition-colors">
              Kullanım Koşulları
            </Link>
            <Link href="/gizlilik" className="text-[12px] text-slate-600 hover:text-slate-300 transition-colors">
              Gizlilik
            </Link>
            <Link href="/kvkk" className="text-[12px] text-slate-600 hover:text-slate-300 transition-colors">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
