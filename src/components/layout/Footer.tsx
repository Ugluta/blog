import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  dosyalar: {
    title: 'Dosyalar',
    links: [
      { label: 'Yıllık Planlar', href: '/dosyalar?kategori=yillik-planlar' },
      { label: 'Ders Planları', href: '/dosyalar?kategori=ders-planlari' },
      { label: 'Sınav Soruları', href: '/dosyalar?kategori=sinav-sorulari' },
      { label: 'Çalışma Kağıtları', href: '/dosyalar?kategori=calisma-kagitlari' },
      { label: 'Evrak Örnekleri', href: '/dosyalar?kategori=evrak-ornekleri' },
    ],
  },
  icerik: {
    title: 'İçerik',
    links: [
      { label: 'Haberler', href: '/haberler' },
      { label: 'Duyurular', href: '/duyurular' },
      { label: 'Mevzuat', href: '/mevzuat' },
      { label: 'Soru Bankası', href: '/sorular' },
      { label: 'Arşiv', href: '/arsiv' },
    ],
  },
  kurumsal: {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
      { label: 'Gizlilik Politikası', href: '/gizlilik' },
      { label: 'KVKK', href: '/kvkk' },
      { label: 'İletişim', href: '/iletisim' },
    ],
  },
  okulTurleri: {
    title: 'Okul Türleri',
    links: [
      { label: 'Anaokulu', href: '/dosyalar?okul=ANAOKULU' },
      { label: 'İlkokul', href: '/dosyalar?okul=ILKOKUL' },
      { label: 'Ortaokul', href: '/dosyalar?okul=ORTAOKUL' },
      { label: 'Lise', href: '/dosyalar?okul=LISE' },
      { label: 'İmam Hatip', href: '/dosyalar?okul=IMAM_HATIP' },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">ÖğretmenEvrak</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Öğretmen ve idareciler için kapsamlı materyal, evrak ve kaynak platformu.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-3 text-sm">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="border-t border-gray-800 mt-10 pt-8 grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-blue-400 shrink-0" />
            <span>info@ogretmenevrak.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-blue-400 shrink-0" />
            <span>0850 XXX XX XX</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Türkiye</span>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} ÖğretmenEvrak. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <Link href="/kullanim-kosullari" className="hover:text-white">Kullanım Koşulları</Link>
            <Link href="/gizlilik" className="hover:text-white">Gizlilik</Link>
            <Link href="/kvkk" className="hover:text-white">KVKK</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
