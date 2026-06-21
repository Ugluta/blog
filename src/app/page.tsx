import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";

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
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#FEF3C7"/>
        <path d="M12 28V16l8-4 8 4v12l-8 4-8-4z" stroke="#F59E0B" strokeWidth="1.5"/>
        <path d="M20 12v16M12 16l8 4 8-4" stroke="#F59E0B" strokeWidth="1.5"/>
      </svg>
    ),
    title: "İçerik Yönetimi",
    desc: "Her cihazda kullanıcıların beğeneceği içerikler oluşturmanıza yardımcı modern araçlar.",
    href: "/uygulama",
  },
  {
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#D1FAE5"/>
        <circle cx="20" cy="20" r="6" stroke="#10B981" strokeWidth="1.5"/>
        <path d="M8 20h6M26 20h6M20 8v6M20 26v6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Sosyal Medya",
    desc: "Daha hızlı zamanlama, akıllı paylaşım ve tüm platformlara otomatik bağlantı.",
    href: "/uygulama/sosyal-hesaplar",
  },
  {
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#DBEAFE"/>
        <path d="M14 26l4-8 4 4 4-10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="10" y="10" width="20" height="20" rx="3" stroke="#3B82F6" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Analitik",
    desc: "Gerçek zamanlı performans analizi ve içerik optimizasyon önerileri.",
    href: "/uygulama/analitik",
  },
  {
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill="#EDE9FE"/>
        <path d="M20 12l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: "AI Studio",
    desc: "AI Studio'da yapay zeka destekli içerik uygulamaları geliştirin.",
    href: "/uygulama/video-olustur",
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

export default function HomePage() {
  return (
    <>
      <MegaHeader />
      <main className="bg-white">

        {/* ── 1. TOP 3 CARDS — AWS style ── */}
        <section className="bg-[#f8f8f8] py-14 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TOP_CARDS.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:shadow-gray-200/80 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="h-44 relative" style={{ background: card.gradient }}>
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded bg-black/25 text-white backdrop-blur-sm tracking-wide">
                      {card.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1a73e8] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{card.desc}</p>
                    <p className="mt-4 text-sm text-[#1a73e8] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Devamını oku <span>→</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. BIG HERO BANNER — AWS style ── */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div
              className="relative rounded-2xl overflow-hidden h-72 lg:h-[380px] flex items-end"
              style={{ background: "linear-gradient(120deg,#0f172a 0%,#1e1b4b 40%,#312e81 70%,#4c1d95 100%)" }}
            >
              <div className="absolute top-0 right-0 w-2/3 h-full opacity-20"
                style={{ background: "radial-gradient(ellipse at 90% 50%,#f59e0b,transparent 65%)" }} />
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10"
                style={{ background: "radial-gradient(ellipse,#818cf8,transparent)" }} />
              <div className="relative z-10 p-8 lg:p-12 max-w-2xl">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Başarı Hikayesi</p>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  Medya şirketi, AI platformuyla yayın sürelerini %40 azalttı
                </h2>
                <p className="text-gray-300 text-sm mb-5 leading-relaxed max-w-lg hidden md:block">
                  Kurumsal platformu kullanarak içerik üretim akışını tamamen dönüştüren şirketin hikayesini okuyun.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 transition-colors"
                >
                  Hikayeyi oku →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. CATEGORY CARDS — AWS industry 2-col style ── */}
        <section className="bg-[#f8f8f8] border-y border-gray-200 py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 border-b-2 border-amber-500 pb-1">
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
                    <h3 className="text-[14px] font-bold text-gray-900 mb-1.5 group-hover:text-[#1a73e8] transition-colors line-clamp-2">
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

        {/* ── 4. PRODUCT CARDS — Google "Başlayın" 4-col style ── */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Platformla hemen başlayın
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCT_CARDS.map((p) => (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white"
                >
                  <div className="mb-4">{p.icon}</div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-[#1a73e8] leading-relaxed">{p.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. 2-COL FEATURE — Google Android skills style ── */}
        <section className="bg-gray-50 border-y border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div
                className="rounded-2xl h-64 lg:h-72 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" }}
              >
                {[
                  { text: "İçerik", left: "18%", top: "22%", rotate: "-8deg" },
                  { text: "SEO", left: "52%", top: "14%", rotate: "5deg" },
                  { text: "Sosyal", left: "63%", top: "44%", rotate: "-4deg" },
                  { text: "Video", left: "18%", top: "58%", rotate: "7deg" },
                  { text: "Analitik", left: "44%", top: "64%", rotate: "-5deg" },
                ].map((tag) => (
                  <div
                    key={tag.text}
                    className="absolute px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-lg"
                    style={{ left: tag.left, top: tag.top, transform: `rotate(${tag.rotate})` }}
                  >
                    {tag.text}
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  Platform becerileriyle daha akıllı bir içerik asistanı oluşturun
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Platformumuzdaki araçları kullanarak içerik tabanlı iş akışlarını hızlandırın ve kaliteli materyaller üretin.
                </p>
                <Link
                  href="/uygulama"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a73e8] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Daha fazla bilgi
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. 3-COL COMMUNITY CARDS — Google style ── */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COMMUNITY_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="h-44" style={{ background: card.gradient }} />
                  <div className="p-6 bg-white">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">{card.desc}</p>
                    <Link
                      href={card.href}
                      className="inline-flex items-center px-4 py-2 bg-[#1a73e8] text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {card.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. SOCIAL FOLLOW — Google style ── */}
        <section className="bg-gray-50 border-t border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Kurumsal&apos;ı takip edin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
                  name: "YouTube",
                  desc: "Yapay zeka destekli içerik üreticilerinden oluşan topluluğa katılın ve en son gelişmeleri öğrenin.",
                  href: "https://youtube.com",
                },
                {
                  icon: <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                  name: "Twitter / X",
                  desc: "En son platform haberlerini, ipuçlarını ve topluluk öne çıkanlarından haberdar olun.",
                  href: "https://twitter.com",
                },
                {
                  icon: <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
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
                  className="p-5 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all block"
                >
                  <div className="mb-3">{s.icon}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{s.name}</h3>
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
