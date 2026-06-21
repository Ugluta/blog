import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";

// ---------- data ----------

const TOP_CARDS = [
  {
    category: "Yapay Zeka",
    title: "Temsilciler oluşturmanın ve ölçeklendirmenin yeni yolları",
    desc: "Temsilcileri büyük ölçekte oluşturmak, bağlamak ve optimize etmek için tek platform.",
    href: "/blog",
    gradient: "linear-gradient(145deg,#312e81 0%,#4338ca 50%,#7c3aed 100%)",
  },
  {
    category: "İçerik",
    title: "Çalışma şeklinizi değiştiren yapay zeka destekli içerik asistanı",
    desc: "Kullandığınız her şeye bağlanan, sizin adınıza harekete geçen platform.",
    href: "/uygulama",
    gradient: "linear-gradient(145deg,#065f46 0%,#059669 50%,#34d399 100%)",
  },
  {
    category: "Yenilikler",
    title: "Platformdan en büyük yapay zeka güncellemeleri ve haberler",
    desc: "Yeni geliştirici araçlarından altyapıya kadar her etken yapay zeka güncellemesi.",
    href: "/changelog",
    gradient: "linear-gradient(145deg,#9a3412 0%,#ea580c 50%,#fb923c 100%)",
  },
];

const PRODUCT_CARDS = [
  {
    iconBg: "#FEF3C7",
    title: "İçerik Yönetimi",
    desc: "Profesyonel içerik üretimi ve yönetim araçları.",
    href: "/uygulama",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 10h10M4 14h12M4 18h8" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    iconBg: "#D1FAE5",
    title: "Sosyal Medya",
    desc: "Tüm platformlara otomatik, akıllı yayın yönetimi.",
    href: "/uygulama/sosyal-hesaplar",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="12" r="3" stroke="#059669" strokeWidth="2" />
        <circle cx="18" cy="6" r="3" stroke="#059669" strokeWidth="2" />
        <circle cx="18" cy="18" r="3" stroke="#059669" strokeWidth="2" />
        <path d="M9 11L15 7M9 13L15 17" stroke="#059669" strokeWidth="2" />
      </svg>
    ),
  },
  {
    iconBg: "#DBEAFE",
    title: "Analitik",
    desc: "Gerçek zamanlı performans ve optimizasyon analizleri.",
    href: "/uygulama/analitik",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M4 18L8 13l4 3 4-7 4-5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    iconBg: "#EDE9FE",
    title: "AI Studio",
    desc: "Yapay zeka ile video ve görsel içerik üretimi.",
    href: "/uygulama/video-olustur",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const COMMUNITY_CARDS = [
  {
    gradient: "linear-gradient(145deg,#312e81 0%,#4c1d95 60%,#6d28d9 100%)",
    title: "İçerik programlarını keşfedin",
    desc: "Ajanslar, medya şirketleri ve girişimcilerin büyük içerik problemlerini çözmesini sağlar.",
    cta: "Daha fazla bilgi",
    href: "/cozumler",
  },
  {
    gradient: "linear-gradient(145deg,#064e3b 0%,#065f46 60%,#047857 100%)",
    title: "Bir etkinlik bulun",
    desc: "Online ve şahsen düzenlenen içerik etkinlikleri aracılığıyla bilginizi artırın.",
    cta: "Etkinlikleri görüntüle",
    href: "/iletisim",
  },
  {
    gradient: "linear-gradient(145deg,#7f1d1d 0%,#991b1b 60%,#dc2626 100%)",
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
          style={{ background: "linear-gradient(160deg,#0f172a 0%,#1e293b 55%,#0f172a 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.07] blur-3xl rounded-full"
              style={{ background: "radial-gradient(ellipse,#FBBF24,transparent 70%)" }} />
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
                backgroundSize: "72px 72px",
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse block" />
              <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">
                Yapay Zeka Destekli Platform
              </span>
            </div>

            <h1 className="text-[40px] lg:text-[68px] font-extrabold text-white mb-6 leading-[1.08] tracking-tight">
              İçerik Üretimini<br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#FBBF24 0%,#F97316 100%)" }}
              >
                Dönüştürün
              </span>
            </h1>

            <p className="text-[17px] lg:text-xl text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Yapay zeka ile içerik üretin, sosyal medyada yayınlayın, analitiklerle büyüyün — tek platformda.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/kayit"
                className="px-8 py-3.5 text-[15px] font-extrabold text-black rounded-full transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30"
                style={{ background: "linear-gradient(135deg,#FBBF24,#F97316)" }}
              >
                Ücretsiz Başla →
              </Link>
              <Link
                href="/blog"
                className="px-8 py-3.5 text-[15px] font-semibold text-white border border-white/15 rounded-full hover:bg-white/8 hover:border-white/25 transition-all"
              >
                Demo İzle
              </Link>
            </div>

            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/[0.07] pt-10 max-w-2xl mx-auto lg:max-w-none">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-extrabold text-white">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 1. ÖNE ÇIKAN 3 KART — içerik kartta, AWS tarzı ── */}
        <section style={{ background: "#f1f5f9" }} className="py-16 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-slate-900">Öne Çıkan İçerikler</h2>
              <Link href="/blog" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
                Tümünü gör <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TOP_CARDS.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative h-64 rounded-2xl overflow-hidden flex flex-col justify-end hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                  style={{ background: card.gradient }}
                >
                  {/* dot pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.8) 1px,transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  {/* category badge */}
                  <span className="absolute top-4 left-4 z-10 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md tracking-wider border border-white/20">
                    {card.category}
                  </span>
                  {/* bottom dark overlay */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0) 55%)" }}
                  />
                  {/* text content */}
                  <div className="relative z-10 p-5">
                    <h3 className="text-[15px] font-bold text-white mb-1.5 line-clamp-2 leading-snug drop-shadow">
                      {card.title}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-3">{card.desc}</p>
                    <span className="text-xs text-white/90 font-semibold flex items-center gap-1.5 group-hover:gap-3 transition-all">
                      Devamını oku <span className="text-white/60">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. BAŞARI HİKAYESİ — full-bleed ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(125deg,#0f172a 0%,#1e1b4b 40%,#312e81 70%,#4c1d95 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-2/3 h-full opacity-[0.15]"
              style={{ background: "radial-gradient(ellipse at 80% 40%,#F59E0B,transparent 60%)" }} />
            <div className="absolute bottom-0 left-0 w-1/3 h-2/3 opacity-[0.07]"
              style={{ background: "radial-gradient(ellipse,#a78bfa,transparent)" }} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-5">
                <span className="w-6 h-px bg-amber-400" />
                Başarı Hikayesi
              </span>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                Medya şirketi, AI platformuyla yayın sürelerini %40 azalttı
              </h2>
              <p className="text-slate-300 text-base mb-8 leading-relaxed max-w-lg">
                Kurumsal platformu kullanarak içerik üretim akışını tamamen dönüştüren şirketin hikayesini okuyun.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-extrabold rounded-full hover:bg-amber-50 hover:scale-105 transition-all shadow-lg"
              >
                Hikayeyi oku →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 3. ÜRÜNLER 4-COL ── */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-[42px] font-extrabold text-slate-900 mb-3 leading-tight">
                Platformla hemen başlayın
              </h2>
              <p className="text-slate-500 text-base max-w-lg mx-auto">
                İçerik üretiminizi hızlandıracak araçlar, tek bir çatı altında.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCT_CARDS.map((p) => (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-sm"
                    style={{ background: p.iconBg }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">{p.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{p.desc}</p>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Keşfet <span>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. KATEGORİ 2-COL ── */}
        <section style={{ background: "#f1f5f9" }} className="border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                <span className="w-1 h-5 rounded-full bg-amber-500 block" />
                İçerik yönetimi
              </h2>
              <Link href="/blog" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Tüm içerikleri gör →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  tag: "İçerik Yönetimi",
                  title: "Büyük şirketler, AI çözümleriyle içerik verimliliği artırıyor",
                  desc: "AI içerik araçlarıyla içerik operasyonlarındaki küresel süreçleri nasıl optimize edebilirsiniz.",
                  gradient: "linear-gradient(145deg,#312e81,#4338ca)",
                  href: "/blog",
                },
                {
                  tag: "Sosyal Medya",
                  title: "Küresel markalar için sosyal medya ve içerik otomasyonu stratejisi",
                  desc: "AI ve içerik otomasyonu teknolojileriyle sosyal medya etkileşimini nasıl optimize edebilirsiniz.",
                  gradient: "linear-gradient(145deg,#064e3b,#059669)",
                  href: "/uygulama/sosyal-hesaplar",
                },
              ].map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 flex"
                >
                  <div className="w-32 flex-shrink-0 relative" style={{ background: card.gradient }}>
                    <span className="absolute bottom-3 left-0 right-0 px-2 text-[9px] font-extrabold text-white/70 uppercase tracking-widest text-center leading-tight">
                      {card.tag}
                    </span>
                  </div>
                  <div className="p-5 flex-1">
                    <h3 className="text-[14px] font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors line-clamp-2 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">{card.desc}</p>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Oku <span>→</span>
                    </span>
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
              {/* dark illustration */}
              <div
                className="rounded-2xl h-72 relative overflow-hidden shadow-2xl shadow-slate-900/30"
                style={{ background: "linear-gradient(145deg,#0f172a,#1e1b4b,#312e81)" }}
              >
                <div className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {[
                  { text: "İçerik", left: "12%", top: "18%", rotate: "-6deg" },
                  { text: "SEO", left: "56%", top: "10%", rotate: "4deg" },
                  { text: "Sosyal", left: "62%", top: "44%", rotate: "-3deg" },
                  { text: "Video", left: "14%", top: "58%", rotate: "6deg" },
                  { text: "Analitik", left: "36%", top: "66%", rotate: "-5deg" },
                ].map((tag) => (
                  <div
                    key={tag.text}
                    className="absolute px-3.5 py-1.5 text-white text-xs font-extrabold rounded-xl shadow-lg"
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
              {/* text */}
              <div>
                <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest mb-4 block">
                  Platform Becerileri
                </span>
                <h2 className="text-3xl lg:text-[40px] font-extrabold text-slate-900 mb-5 leading-tight">
                  Daha akıllı bir içerik asistanı oluşturun
                </h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-[15px]">
                  Platformumuzdaki araçları kullanarak içerik tabanlı iş akışlarını hızlandırın ve kaliteli materyaller üretin.
                </p>
                <Link
                  href="/uygulama"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-extrabold rounded-full hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25 transition-all"
                  style={{ background: "linear-gradient(135deg,#FBBF24,#F97316)" }}
                >
                  Daha fazla bilgi →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. 3-COL COMMUNITY — full-gradient kartlar ── */}
        <section style={{ background: "#0f172a" }} className="border-t border-white/[0.06] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">Topluluğa Katılın</h2>
              <p className="text-slate-400 text-sm">Binlerce içerik üreticisiyle büyüyün.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {COMMUNITY_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl overflow-hidden relative group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col"
                  style={{ background: card.gradient, minHeight: 260 }}
                >
                  {/* dot texture */}
                  <div className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.9) 1px,transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative z-10 p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-lg font-extrabold text-white mb-2.5 leading-tight">{card.title}</h3>
                      <p className="text-sm text-white/70 leading-relaxed">{card.desc}</p>
                    </div>
                    <div className="mt-6">
                      <Link
                        href={card.href}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-white text-sm font-bold hover:bg-white/15 hover:border-white/50 transition-all"
                      >
                        {card.cta} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. SOCIAL FOLLOW — platform renkli kartlar ── */}
        <section style={{ background: "#0f172a" }} className="border-t border-white/[0.06] pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-extrabold text-white text-center mb-10">
              Kurumsal&apos;ı takip edin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  gradient: "linear-gradient(145deg,#7f0000,#c00000)",
                  iconBg: "rgba(255,255,255,0.15)",
                  icon: (
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                  name: "YouTube",
                  handle: "@KurumsalPlatformu",
                  desc: "Yapay zeka ile içerik üretimine dair videolar, eğitimler ve topluluk haberleri.",
                  href: "https://youtube.com",
                },
                {
                  gradient: "linear-gradient(145deg,#0a0a0a,#1a1a1a)",
                  iconBg: "rgba(255,255,255,0.1)",
                  icon: (
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                  name: "Twitter / X",
                  handle: "@KurumsalAI",
                  desc: "En son platform haberleri, güncellemeler ve geliştirici ipuçları anlık olarak.",
                  href: "https://twitter.com",
                },
                {
                  gradient: "linear-gradient(145deg,#003f6b,#0077b5)",
                  iconBg: "rgba(255,255,255,0.15)",
                  icon: (
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                  name: "LinkedIn",
                  handle: "Kurumsal Platformu",
                  desc: "Geliştirici etkinlikleri, platform güncellemeleri ve ilham verici başarı hikayeleri.",
                  href: "https://linkedin.com",
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl overflow-hidden block group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                  style={{ background: s.gradient }}
                >
                  <div className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: s.iconBg }}
                    >
                      {s.icon}
                    </div>
                    <p className="text-xs text-white/50 font-semibold mb-1 tracking-wide">{s.handle}</p>
                    <h3 className="text-lg font-extrabold text-white mb-2">{s.name}</h3>
                    <p className="text-sm text-white/65 leading-relaxed mb-5">{s.desc}</p>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/25 text-white text-xs font-bold hover:bg-white/15 hover:border-white/45 transition-all">
                      Takip Et →
                    </span>
                  </div>
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
