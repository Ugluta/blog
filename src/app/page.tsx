import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";

// ---------- static data ----------

const TOP_CARDS = [
  {
    category: "Yapay Zeka",
    title: "Temsilciler oluşturmanın ve ölçeklendirmenin yeni yolları",
    desc: "Temsilcileri büyük ölçekte oluşturmak, bağlamak ve optimize etmek için tek platform.",
    href: "/blog",
    gradient: "linear-gradient(135deg,#667eea 0%,#764ba2 60%,#f093fb 100%)",
  },
  {
    category: "İçerik",
    title: "Çalışma şeklinizi değiştiren yapay zeka destekli içerik asistanı",
    desc: "Kullandığınız her şeye bağlanan, sizin adınıza harekete geçen platform.",
    href: "/uygulama",
    gradient: "linear-gradient(135deg,#4facfe 0%,#00f2fe 50%,#43e97b 100%)",
  },
  {
    category: "Yenilikler",
    title: "Platformdan en büyük yapay zeka güncellemeleri ve haberler",
    desc: "Yeni geliştirici araçlarından altyapıya kadar her etken yapay zeka güncellemesi.",
    href: "/changelog",
    gradient: "linear-gradient(135deg,#f5576c 0%,#fda085 60%,#ffecd2 100%)",
  },
];

const PRODUCT_CARDS = [
  {
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    title: "İçerik Yönetimi",
    desc: "Her cihazda kullanıcıların beğeneceği içerikler oluşturmanıza yardımcı modern araçlar.",
    href: "/uygulama",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M6 8h20M6 14h14M6 20h10" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    iconBg: "#D1FAE5",
    iconColor: "#059669",
    title: "Sosyal Medya",
    desc: "Daha hızlı zamanlama, akıllı paylaşım ve tüm platformlara otomatik bağlantı.",
    href: "/uygulama/sosyal-hesaplar",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <circle cx="8" cy="16" r="4" stroke="#059669" strokeWidth="2" />
        <circle cx="24" cy="8" r="4" stroke="#059669" strokeWidth="2" />
        <circle cx="24" cy="24" r="4" stroke="#059669" strokeWidth="2" />
        <path d="M12 14L20 10M12 18L20 22" stroke="#059669" strokeWidth="2" />
      </svg>
    ),
  },
  {
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
    title: "Analitik",
    desc: "Gerçek zamanlı performans analizi ve içerik optimizasyon önerileri.",
    href: "/uygulama/analitik",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M6 22L11 16l5 4 5-8 5-6" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
    title: "AI Studio",
    desc: "AI Studio'da yapay zeka destekli içerik uygulamaları geliştirin.",
    href: "/uygulama/video-olustur",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 6l2.5 7.5H26l-6.5 5 2.5 7.5L16 22l-6 4 2.5-7.5L6 13.5h7.5L16 6z" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const COMMUNITY_CARDS = [
  {
    gradient: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
    title: "İçerik programlarını keşfedin",
    desc: "Ajanslar, medya şirketleri ve girişimcilerin dünyanın büyük içerik problemlerini çözmesini sağlar.",
    cta: "Daha fazla bilgi",
    href: "/cozumler",
  },
  {
    gradient: "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)",
    title: "Bir etkinlik bulun",
    desc: "Online ve şahsen düzenlenen içerik etkinlikleri aracılığıyla bilginizi artırın.",
    cta: "Etkinlikleri görüntüle",
    href: "/iletisim",
  },
  {
    gradient: "linear-gradient(135deg,#f093fb 0%,#f5576c 100%)",
    title: "Topluluğa katılın",
    desc: "İçerik üretim yolculuğunuzun neresinde olursanız olun, deneyim paylaşan bir ağa tanışın.",
    cta: "Toplulukları keşfedin",
    href: "/topluluk",
  },
];

const HERO_STATS = [
  { value: "10.000+", label: "İçerik üretildi" },
  { value: "%40", label: "Daha hızlı yayın" },
  { value: "50+", label: "Entegrasyon" },
  { value: "99.9%", label: "Uptime garantisi" },
];

// ---------- page ----------

export default function HomePage() {
  return (
    <>
      <MegaHeader />
      <main>

        {/* ── 0. HERO ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%)" }}
        >
          {/* decorative glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
              style={{ background: "#FBBF24" }} />
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full opacity-8 blur-3xl"
              style={{ background: "#6366f1" }} />
            {/* subtle grid */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 lg:py-36 text-center">
            {/* badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-amber-400 tracking-widest uppercase">
                Yapay Zeka Destekli Platform
              </span>
            </div>

            <h1 className="text-4xl lg:text-[64px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              İçerik Üretimini<br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#FBBF24,#F97316)" }}
              >
                Dönüştürün
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Yapay zeka destekli içerik üretimi, sosyal medya yönetimi ve otomatik yayıncılık — hepsi tek platformda.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/kayit"
                className="px-8 py-3.5 text-[15px] font-bold text-black rounded-full hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 transition-all"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F59E0B)" }}
              >
                Ücretsiz Başla →
              </Link>
              <Link
                href="/blog"
                className="px-8 py-3.5 text-[15px] font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all"
              >
                Demo İzle
              </Link>
            </div>

            {/* stats */}
            <div className="mt-20 flex items-center justify-center gap-10 lg:gap-16 flex-wrap border-t border-white/10 pt-10">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-extrabold text-white">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 1. ÖNE ÇIKAN KARTI — 3 gradient cards ── */}
        <section className="bg-[#f8f8f8] py-16 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-lg font-bold text-gray-900">Öne Çıkan İçerikler</h2>
              <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Tümünü gör →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TOP_CARDS.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:shadow-gray-200/80 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="h-48 relative" style={{ background: card.gradient }}>
                    <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm tracking-wide">
                      {card.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1a73e8] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{card.desc}</p>
                    <p className="mt-4 text-sm text-[#1a73e8] font-medium flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Devamını oku <span>→</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. BAŞARI HİKAYESİ — full-bleed dark banner ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(120deg,#0f172a 0%,#1e1b4b 45%,#312e81 75%,#4c1d95 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20"
              style={{ background: "radial-gradient(ellipse at 85% 40%,#F59E0B,transparent 65%)" }} />
            <div className="absolute bottom-0 left-0 w-1/3 h-3/4 opacity-10"
              style={{ background: "radial-gradient(ellipse,#818cf8,transparent)" }} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">Başarı Hikayesi</p>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                Medya şirketi, AI platformuyla yayın sürelerini %40 azalttı
              </h2>
              <p className="text-slate-300 text-base mb-8 leading-relaxed max-w-lg">
                Kurumsal platformu kullanarak içerik üretim akışını tamamen dönüştüren şirketin hikayesini okuyun.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all"
              >
                Hikayeyi oku →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 3. ÜRÜNLER 4-COL — Google style ── */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
                Platformla hemen başlayın
              </h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                İçerik üretiminizi hızlandıracak araçlar, tek bir çatı altında.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCT_CARDS.map((p) => (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: p.iconBg }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-[#1a73e8] leading-relaxed group-hover:underline">{p.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. KATEGORİ 2-COL — AWS industry cards ── */}
        <section className="bg-[#f8f8f8] border-y border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-lg font-bold text-gray-900 border-b-2 border-amber-500 pb-1">
                İçerik yönetimi
              </h2>
              <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Tüm içerikleri gör →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  tag: "İçerik Yönetimi",
                  title: "Büyük şirketler, AI çözümleriyle içerik verimliliği artırıyor",
                  desc: "AI içerik araçlarıyla içerik operasyonlarındaki küresel süreçleri nasıl optimize edebilirsiniz.",
                  gradient: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                  href: "/blog",
                },
                {
                  tag: "Sosyal Medya",
                  title: "Küresel markalar için sosyal medya ve içerik otomasyonu stratejisi",
                  desc: "AI ve içerik otomasyonu teknolojileriyle sosyal medya etkileşimini nasıl optimize edebilirsiniz.",
                  gradient: "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
                  href: "/uygulama/sosyal-hesaplar",
                },
              ].map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all flex"
                >
                  <div className="w-36 flex-shrink-0 relative" style={{ background: card.gradient }}>
                    <span className="absolute bottom-3 left-2 right-2 text-[10px] font-bold text-white/80 uppercase tracking-wider leading-tight">
                      {card.tag}
                    </span>
                  </div>
                  <div className="p-5 flex-1">
                    <h3 className="text-[14px] font-bold text-gray-900 mb-2 group-hover:text-[#1a73e8] transition-colors line-clamp-2 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{card.desc}</p>
                    <p className="mt-3 text-[#1a73e8] text-sm font-medium">→</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. 2-COL FEATURE ── */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div
                className="rounded-2xl h-72 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" }}
              >
                {[
                  { text: "İçerik", left: "18%", top: "20%", rotate: "-8deg" },
                  { text: "SEO", left: "54%", top: "13%", rotate: "5deg" },
                  { text: "Sosyal", left: "64%", top: "44%", rotate: "-4deg" },
                  { text: "Video", left: "16%", top: "58%", rotate: "7deg" },
                  { text: "Analitik", left: "42%", top: "65%", rotate: "-5deg" },
                ].map((tag) => (
                  <div
                    key={tag.text}
                    className="absolute px-3.5 py-1.5 text-white text-xs font-bold rounded-lg shadow-lg"
                    style={{
                      left: tag.left,
                      top: tag.top,
                      transform: `rotate(${tag.rotate})`,
                      background: "linear-gradient(135deg,#F59E0B,#EA580C)",
                    }}
                  >
                    {tag.text}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">Platform Becerileri</p>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
                  Daha akıllı bir içerik asistanı oluşturun
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed text-base">
                  Platformumuzdaki araçları kullanarak içerik tabanlı iş akışlarını hızlandırın ve kaliteli materyaller üretin.
                </p>
                <Link
                  href="/uygulama"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a73e8] text-white text-sm font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                  Daha fazla bilgi →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. 3-COL COMMUNITY CARDS ── */}
        <section className="bg-[#f8f8f8] border-t border-gray-200 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-10 text-center">
              Topluluğa Katılın
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COMMUNITY_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white"
                >
                  <div className="h-44" style={{ background: card.gradient }} />
                  <div className="p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">{card.desc}</p>
                    <Link
                      href={card.href}
                      className="inline-flex items-center px-4 py-2 bg-[#1a73e8] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {card.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. SOCIAL FOLLOW ── */}
        <section className="bg-white border-t border-gray-200 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
              Kurumsal&apos;ı takip edin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                  name: "YouTube",
                  desc: "Yapay zeka destekli içerik üreticilerinden oluşan topluluğa katılın ve en son gelişmeleri öğrenin.",
                  href: "https://youtube.com",
                },
                {
                  icon: (
                    <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                  name: "Twitter / X",
                  desc: "En son platform haberlerini, ipuçlarını ve topluluk öne çıkanlarından haberdar olun.",
                  href: "https://twitter.com",
                },
                {
                  icon: (
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                  name: "LinkedIn",
                  desc: "Geliştirici etkinliklerini, platform güncellemelerini ve ilham verici hikayeleri keşfedin.",
                  href: "https://linkedin.com",
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md transition-all block group"
                >
                  <div className="mb-4">{s.icon}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#1a73e8] transition-colors">{s.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
