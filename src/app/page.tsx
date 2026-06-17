import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Search, Download, Users, FileText, TrendingUp, BookOpen, ArrowRight, Star, Shield, Zap, ChevronRight } from 'lucide-react';

const schoolTypes = [
  { label: 'Anaokulu', href: '/dosyalar?okul=ANAOKULU', emoji: '🌱', color: 'bg-green-50 border-green-100 hover:bg-green-100' },
  { label: 'İlkokul', href: '/dosyalar?okul=ILKOKUL', emoji: '📖', color: 'bg-blue-50 border-blue-100 hover:bg-blue-100' },
  { label: 'Ortaokul', href: '/dosyalar?okul=ORTAOKUL', emoji: '🏫', color: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100' },
  { label: 'Lise', href: '/dosyalar?okul=LISE', emoji: '🎓', color: 'bg-purple-50 border-purple-100 hover:bg-purple-100' },
  { label: 'İmam Hatip', href: '/dosyalar?okul=IMAM_HATIP', emoji: '🕌', color: 'bg-teal-50 border-teal-100 hover:bg-teal-100' },
  { label: 'Meslek Lisesi', href: '/dosyalar?okul=MESLEK_LISESI', emoji: '🔧', color: 'bg-orange-50 border-orange-100 hover:bg-orange-100' },
];

const subjects = [
  { name: 'Türkçe', icon: '📖', color: 'text-red-500 bg-red-50', href: '/dosyalar?ders=turkce' },
  { name: 'Matematik', icon: '🔢', color: 'text-blue-500 bg-blue-50', href: '/dosyalar?ders=matematik' },
  { name: 'Fen Bilimleri', icon: '🔬', color: 'text-green-500 bg-green-50', href: '/dosyalar?ders=fen-bilimleri' },
  { name: 'Sosyal Bilgiler', icon: '🌍', color: 'text-amber-500 bg-amber-50', href: '/dosyalar?ders=sosyal-bilgiler' },
  { name: 'İngilizce', icon: '🇬🇧', color: 'text-purple-500 bg-purple-50', href: '/dosyalar?ders=ingilizce' },
  { name: 'Fizik', icon: '⚛️', color: 'text-indigo-500 bg-indigo-50', href: '/dosyalar?ders=fizik' },
  { name: 'Kimya', icon: '🧪', color: 'text-pink-500 bg-pink-50', href: '/dosyalar?ders=kimya' },
  { name: 'Biyoloji', icon: '🧬', color: 'text-teal-500 bg-teal-50', href: '/dosyalar?ders=biyoloji' },
  { name: 'Tarih', icon: '🏛️', color: 'text-orange-500 bg-orange-50', href: '/dosyalar?ders=tarih' },
  { name: 'Coğrafya', icon: '🗺️', color: 'text-lime-500 bg-lime-50', href: '/dosyalar?ders=cografya' },
  { name: 'Müzik', icon: '🎵', color: 'text-violet-500 bg-violet-50', href: '/dosyalar?ders=muzik' },
  { name: 'Beden Eğitimi', icon: '⚽', color: 'text-cyan-500 bg-cyan-50', href: '/dosyalar?ders=beden-egitimi' },
];

const categories = [
  { name: 'Yıllık Planlar', icon: '📅', count: '2.4K', href: '/dosyalar?kategori=yillik-planlar', color: 'bg-blue-600' },
  { name: 'Ders Planları', icon: '📋', count: '5.1K', href: '/dosyalar?kategori=ders-planlari', color: 'bg-green-600' },
  { name: 'Sınav Soruları', icon: '📝', count: '8.7K', href: '/dosyalar?kategori=sinav-sorulari', color: 'bg-purple-600' },
  { name: 'Çalışma Kağıtları', icon: '📄', count: '3.2K', href: '/dosyalar?kategori=calisma-kagitlari', color: 'bg-orange-500' },
  { name: 'Sunumlar', icon: '📊', count: '1.8K', href: '/dosyalar?kategori=sunumlar', color: 'bg-red-500' },
  { name: 'Evrak Örnekleri', icon: '📁', count: '4.3K', href: '/dosyalar?kategori=evrak-ornekleri', color: 'bg-teal-600' },
];

const features = [
  { icon: Zap, title: 'Hızlı Erişim', desc: 'CDN destekli altyapı ile saniyeler içinde yükle ve indir.' },
  { icon: Shield, title: 'Güvenli Platform', desc: 'SSL şifrelemesi ve gizlilik politikamız ile verileriniz güvende.' },
  { icon: TrendingUp, title: 'SEO Optimize', desc: 'Arama motorlarında üst sıralarda yer alan içerikler.' },
  { icon: Star, title: 'Kaliteli İçerik', desc: 'Uzman eğitimciler tarafından hazırlanmış ve denetlenmiş materyaller.' },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="gradient-hero text-white py-20 md:py-28">
          <div className="container-custom text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Türkiye&apos;nin en kapsamlı eğitim platformu
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-balance">
              Öğretmenler için<br />
              <span className="text-blue-300">Her Materyal Burada</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Yıllık plan, ders planı, sınav sorusu, evrak örneği ve daha fazlası.
              Hepsi tek platformda, ücretsiz.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white/10 border border-white/20 rounded-2xl p-2 backdrop-blur-sm">
                <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="search"
                    placeholder="Yıllık plan, ders sorusu, evrak ara..."
                    className="w-full py-3 text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-colors shrink-0">
                  Ara
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {['Yıllık Plan', 'Sınav Sorusu', 'Kazanım Testi', 'MEB Evrak'].map((q) => (
                  <button key={q} className="text-xs bg-white/10 border border-white/20 hover:bg-white/20 rounded-full px-3 py-1 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { icon: FileText, value: '25.000+', label: 'Dosya' },
                { icon: Users, value: '150.000+', label: 'Kullanıcı' },
                { icon: Download, value: '1.2M+', label: 'İndirme' },
                { icon: BookOpen, value: '15+', label: 'Ders' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="font-bold text-lg">{value}</p>
                    <p className="text-blue-200 text-xs">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SCHOOL TYPES */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Okul Türüne Göre</h2>
                <p className="section-subtitle">Okul türünü seçerek ilgili materyallere ulaş</p>
              </div>
              <Link href="/dosyalar" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                Tümü <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {schoolTypes.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${s.color} transition-all duration-200 card-hover`}
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="text-sm font-semibold text-gray-800">{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-12">
          <div className="container-custom">
            <h2 className="section-title">Popüler Kategoriler</h2>
            <p className="section-subtitle">En çok aranan dosya kategorileri</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white"
                >
                  <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {cat.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">{cat.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.count} dosya</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SUBJECTS */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Derslere Göre</h2>
                <p className="section-subtitle">Ders seçerek ilgili materyallere eriş</p>
              </div>
              <Link href="/dosyalar" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                Tüm Dersler <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
              {subjects.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${s.color} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-medium text-center leading-tight">{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Neden ÖğretmenEvrak?</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Hız, güvenlik, SEO ve tasarım odaklı platform.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 gradient-primary text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Hemen Üye Ol, Ücretsiz Kullan</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              150.000+ öğretmen ve idareci kullanıyor. Sen de katıl.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/kayit"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Ücretsiz Başla <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dosyalar"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500/30 border border-white/20 text-white font-semibold rounded-xl hover:bg-blue-500/40 transition-colors"
              >
                Dosyalara Göz At
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
