import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | KURUMSAL",
  description: "Türkiye'nin lider kurumsal teknoloji platformu — misyonumuz, vizyonumuz ve ekibimiz hakkında.",
};

const TEAM = [
  { name: "Mustafa Erdoğan", title: "CEO & Kurucu Ortak", avatar: "ME", bg: "from-amber-500 to-orange-600" },
  { name: "Dr. Leyla Şahin", title: "CTO & Kurucu Ortak", avatar: "LS", bg: "from-blue-500 to-cyan-600" },
  { name: "Emre Kılıç", title: "Baş Ürün Müdürü", avatar: "EK", bg: "from-purple-500 to-violet-600" },
  { name: "Selin Arslan", title: "Kurumsal Satış Direktörü", avatar: "SA", bg: "from-emerald-500 to-teal-600" },
  { name: "Burak Yıldız", title: "Mühendislik Müdürü", avatar: "BY", bg: "from-red-500 to-rose-600" },
  { name: "Nihan Çelik", title: "Pazarlama Direktörü", avatar: "NÇ", bg: "from-pink-500 to-fuchsia-600" },
];

const TIMELINE = [
  { year: "2019", title: "Kuruluş", desc: "İstanbul'da 3 kişilik bir ekiple kuruldu. İlk ürün: Kurumsal içerik yönetim sistemi." },
  { year: "2020", title: "İlk Büyük Müşteri", desc: "Fortune 500 listesindeki bir Türk holdingiyle ilk kurumsal sözleşme imzalandı." },
  { year: "2021", title: "Seri A", desc: "12 milyon dolar Seri A yatırım turu tamamlandı. Ekip 25 kişiye ulaştı." },
  { year: "2022", title: "AI Entegrasyonu", desc: "GPT tabanlı içerik üretimi ve otomatik kategorileme özellikleri platforma eklendi." },
  { year: "2023", title: "Uluslararası Genişleme", desc: "MENA ve Balkan pazarlarına açılış. 5 yeni ülkede aktif müşteri." },
  { year: "2024", title: "Seri B", desc: "35 milyon dolar Seri B turu. 350+ kurumsal müşteri, 80+ kişilik ekip." },
  { year: "2026", title: "Bugün", desc: "Türkiye'nin en büyük kurumsal içerik ve otomasyon platformu. 12 ülke, 350+ müşteri." },
];

const VALUES = [
  { icon: "🎯", title: "Sonuç Odaklılık", desc: "Müşterilerimizin hedeflerine ulaşmasını kendi başarımız olarak görürüz." },
  { icon: "🔒", title: "Güven & Şeffaflık", desc: "Açık iletişim ve dürüstlük, tüm ilişkilerimizin temeli." },
  { icon: "⚡", title: "Yenilikçilik", desc: "Sürekli öğrenme ve gelişim kültürü ile sektörün önünde yürürüz." },
  { icon: "🤝", title: "Ortaklık Ruhu", desc: "Müşterilerimiz ve çalışanlarımızla uzun vadeli, güvene dayalı ilişkiler." },
];

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <MegaHeader />

      <main>
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          <div className="container mx-auto px-4 max-w-4xl text-center relative">
            <div className="inline-block px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-widest mb-5">
              2019&apos;dan Beri
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Kurumsal Dijital<br />
              <span className="text-amber-400">Dönüşümün</span> Öncüsü
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Türkiye&apos;nin en kapsamlı kurumsal içerik yönetimi ve otomasyon platformu olarak, 350&apos;den fazla kuruma dijital geleceği inşa ediyoruz.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 border-y border-slate-800">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: "350+", label: "Kurumsal Müşteri" },
                { value: "80+", label: "Takım Üyesi" },
                { value: "12", label: "Aktif Ülke" },
                { value: "99.9%", label: "Uptime" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-black text-amber-400 mb-1">{s.value}</div>
                  <div className="text-sm text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 container mx-auto px-4 max-w-5xl">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl mb-4">🎯</div>
              <h2 className="text-lg font-bold text-white mb-3">Misyonumuz</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Kurumsal içerik üretimini, yönetimini ve dağıtımını otomatikleştirerek şirketlerin dijital varlığını güçlendirmek. Yapay zeka destekli araçlarımızla editöryal süreçleri hızlandırır, maliyet verimliliği sağlarız.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl mb-4">🚀</div>
              <h2 className="text-lg font-bold text-white mb-3">Vizyonumuz</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                2030 yılına kadar MENA&apos;nın en büyük kurumsal içerik zekası platformu olmak. Her büyüklükteki kurumun veri güdümlü içerik stratejisi geliştirmesini mümkün kılmak.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-10 bg-slate-900/40 border-y border-slate-800">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Değerlerimiz</h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {VALUES.map((v) => (
                <div key={v.title} className="text-center p-5">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-white text-sm mb-2">{v.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-white text-center mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Yolculuğumuz</h2>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-slate-700/50" />
            <div className="space-y-6">
              {TIMELINE.map((t) => (
                <div key={t.year} className="flex gap-6 items-start">
                  <div className="w-12 text-right flex-shrink-0 pt-1">
                    <span className="text-xs font-bold text-amber-400">{t.year}</span>
                  </div>
                  <div className="relative flex-shrink-0 mt-1.5">
                    <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                  </div>
                  <div className="flex-1 pb-2">
                    <h3 className="text-sm font-bold text-white mb-1">{t.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-10 bg-slate-900/40 border-y border-slate-800">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Liderlik Ekibi</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
              {TEAM.map((m) => (
                <div key={m.name} className="text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.bg} flex items-center justify-center text-white font-black text-sm mx-auto mb-3`}>
                    {m.avatar}
                  </div>
                  <p className="text-xs font-bold text-white">{m.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{m.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Bize Katılın</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto">
            Büyüyen ekibimizde yer almak ya da platformumuzu denemek ister misiniz? Bizimle iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/iletisim" className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-colors">
              İletişime Geç
            </Link>
            <Link href="/abone-ol" className="px-6 py-3 rounded-xl border border-slate-700/50 hover:border-amber-500/30 text-slate-300 hover:text-white font-medium text-sm transition-colors">
              Platformu Dene
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
