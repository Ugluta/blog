import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";

// ---------- static data ----------

const FEATURED = [
  {
    category: "Müzik",
    title: "Yeni beste: Piyano ve yaylılar için sonat çalışması",
    desc: "Farklı tonlara ve ritim kalıplarına dayanan bu yeni çalışma, minimalist bir yaklaşımla yazıldı.",
    href: "/blog",
  },
  {
    category: "Yazı",
    title: "Yapay zeka ile içerik üretiminde dikkat edilmesi gereken 7 şey",
    desc: "AI araçlarını kullanırken kaybetmemek gereken şey: kendi sesin ve bakış açın.",
    href: "/blog",
  },
  {
    category: "Teknoloji",
    title: "Platformdan en büyük güncellemeler ve yeni özellikler",
    desc: "Geliştirici araçlarından altyapıya kadar son değişikliklerin tam özeti.",
    href: "/changelog",
  },
];

const PLATFORM_CARDS = [
  {
    title: "İçerik Yönetimi",
    desc: "Blog ve makale oluşturun, düzenleyin, yayınlayın.",
    href: "/uygulama",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 10h10M4 14h12M4 18h8" stroke="#3A6EA8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Sosyal Medya",
    desc: "Tüm platformlara otomatik ve akıllı yayın yönetimi.",
    href: "/uygulama/sosyal-hesaplar",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="12" r="3" stroke="#3A6EA8" strokeWidth="2" />
        <circle cx="18" cy="6" r="3" stroke="#3A6EA8" strokeWidth="2" />
        <circle cx="18" cy="18" r="3" stroke="#3A6EA8" strokeWidth="2" />
        <path d="M9 11L15 7M9 13L15 17" stroke="#3A6EA8" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Analitik",
    desc: "Gerçek zamanlı performans ve istatistikler.",
    href: "/uygulama/analitik",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M4 18L8 13l4 3 4-7 4-5" stroke="#3A6EA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "AI Studio",
    desc: "Yapay zeka ile video ve görsel içerik üretin.",
    href: "/uygulama/video-olustur",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="#3A6EA8" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const COMMUNITY = [
  {
    title: "İçerik programlarını keşfedin",
    desc: "Ajanslar, medya şirketleri ve girişimcilerin büyük içerik problemlerini çözmesini sağlayan araç seti.",
    cta: "Daha fazla bilgi",
    href: "/cozumler",
  },
  {
    title: "Bir etkinlik bulun",
    desc: "Online ve yüz yüze düzenlenen etkinlikler aracılığıyla bilginizi geliştirin ve ağınızı büyütün.",
    cta: "Etkinlikleri gör",
    href: "/iletisim",
  },
  {
    title: "Topluluğa katılın",
    desc: "Yolculuğunuzun neresinde olursanız olun, deneyimlerini paylaşan içerik üreticilerinden oluşan bir ağ.",
    cta: "Keşfet",
    href: "/topluluk",
  },
];

const STATS = [
  { value: "10.000+", label: "İçerik üretildi" },
  { value: "%40", label: "Daha hızlı yayın" },
  { value: "50+", label: "Entegrasyon" },
  { value: "99.9%", label: "Uptime" },
];

const SOCIAL_CARDS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    name: "YouTube",
    handle: "@KurumsalPlatformu",
    desc: "Yapay zeka ile içerik üretimine dair videolar, eğitimler ve topluluk haberleri.",
    href: "https://youtube.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    name: "Twitter / X",
    handle: "@KurumsalAI",
    desc: "En son platform haberleri, güncellemeler ve geliştirici ipuçları anlık olarak.",
    href: "https://twitter.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    name: "LinkedIn",
    handle: "Kurumsal Platformu",
    desc: "Geliştirici etkinlikleri, platform güncellemeleri ve başarı hikayeleri.",
    href: "https://linkedin.com",
  },
];

// ---------- page ----------

export default function HomePage() {
  return (
    <>
      <MegaHeader />
      <main>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="bg-[#F8F6F1] pt-24 pb-20 lg:pt-32 lg:pb-28 relative overflow-hidden">
          {/* subtle dot pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: "radial-gradient(circle, #3A6EA8 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            {/* badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B5CDE8] bg-[#EBF2FA] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3A6EA8] animate-pulse block" />
              <span className="text-xs font-bold text-[#3A6EA8] tracking-widest uppercase">
                Yapay Zeka Destekli Platform
              </span>
            </div>

            <h1 className="text-[42px] lg:text-[70px] font-extrabold text-[#111] mb-6 leading-[1.06] tracking-tight">
              İçerik Üretimini<br />
              <span className="text-[#3A6EA8]">Dönüştürün</span>
            </h1>

            <p className="text-[17px] lg:text-xl text-[#555] max-w-xl mx-auto mb-10 leading-relaxed">
              Yapay zeka ile içerik üretin, sosyal medyada yayınlayın, analitiklerle büyüyün — tek platformda.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/kayit"
                className="px-8 py-3.5 text-[15px] font-bold text-white rounded-full transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[#3A6EA8]/25"
                style={{ background: "#3A6EA8" }}
              >
                Ücretsiz Başla →
              </Link>
              <Link
                href="/blog"
                className="px-8 py-3.5 text-[15px] font-semibold text-[#3A6EA8] border border-[#B5CDE8] rounded-full hover:bg-[#EBF2FA] transition-all"
              >
                Blog&apos;u Gör
              </Link>
            </div>

            {/* stats */}
            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-[#DDD8CF] pt-12 max-w-2xl mx-auto lg:max-w-none">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl lg:text-4xl font-extrabold text-[#111] tracking-tight">{s.value}</div>
                  <div className="text-sm text-[#888] mt-1.5 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ÖNE ÇIKAN İÇERİKLER ──────────────────────────────────── */}
        <section className="bg-white py-20 border-b border-[#EDE9E0]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label mb-3">Öne Çıkan</p>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-[#111]">Seçilmiş İçerikler</h2>
              </div>
              <Link href="/blog" className="text-sm font-semibold text-[#3A6EA8] hover:text-[#2D5A8E] flex items-center gap-1 transition-colors pb-1">
                Tümünü gör →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group bg-white border border-[#DDD8CF] rounded-2xl overflow-hidden hover:border-[#B5CDE8] hover:-translate-y-1 transition-all duration-300"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(58,110,168,0.10)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
                >
                  <div className="h-1 bg-[#3A6EA8]" />
                  <div className="p-7">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#3A6EA8] mb-4">
                      {card.category}
                    </span>
                    <h3 className="text-[15px] font-bold text-[#111] mb-3 leading-snug group-hover:text-[#3A6EA8] transition-colors line-clamp-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#666] leading-relaxed line-clamp-3 mb-5">{card.desc}</p>
                    <span className="text-xs font-bold text-[#3A6EA8] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Devamını oku →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BAŞARI HİKAYESİ ──────────────────────────────────────── */}
        <section
          className="py-24 lg:py-32 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#1A3A5C 0%,#2D5A8E 50%,#3A6EA8 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-3 text-[11px] font-bold text-white/60 uppercase tracking-widest mb-7">
                <span className="w-8 h-px bg-white/40" />
                Başarı Hikayesi
              </span>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Medya şirketi, AI platformuyla yayın sürelerini %40 azalttı
              </h2>
              <p className="text-white/70 text-base mb-10 leading-relaxed max-w-lg">
                Kurumsal platformu kullanarak içerik üretim akışını tamamen dönüştüren şirketin hikayesini okuyun.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#3A6EA8] text-sm font-extrabold rounded-full hover:bg-[#F8F6F1] transition-all shadow-lg shadow-black/20"
              >
                Hikayeyi oku →
              </Link>
            </div>
          </div>
        </section>

        {/* ── PLATFORM KARTLARI ────────────────────────────────────── */}
        <section className="bg-[#F8F6F1] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="section-label justify-center mb-4">Platform</p>
              <h2 className="text-3xl lg:text-[44px] font-extrabold text-[#111] mb-4 tracking-tight">
                Hemen başlayın
              </h2>
              <p className="text-[#666] text-base max-w-md mx-auto leading-relaxed">
                İçerik üretiminizi hızlandıracak araçlar, tek bir çatı altında.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {PLATFORM_CARDS.map((p) => (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group bg-white border border-[#DDD8CF] p-7 rounded-2xl hover:border-[#B5CDE8] hover:-translate-y-1 transition-all duration-300"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(58,110,168,0.10)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#EBF2FA] flex items-center justify-center mb-6">
                    {p.icon}
                  </div>
                  <h3 className="text-[14px] font-bold text-[#111] mb-2">{p.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed mb-5">{p.desc}</p>
                  <span className="text-xs font-bold text-[#3A6EA8] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Keşfet →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2-COL FEATURE ────────────────────────────────────────── */}
        <section className="bg-white py-24 border-t border-[#EDE9E0]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* illustration panel */}
              <div
                className="rounded-2xl h-72 relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg,#1A3A5C,#2D5A8E,#3A6EA8)",
                  boxShadow: "0 16px 48px rgba(58,110,168,0.25)",
                }}
              >
                <div className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {[
                  { text: "İçerik", left: "10%", top: "16%", rotate: "-5deg" },
                  { text: "SEO", left: "54%", top: "9%", rotate: "4deg" },
                  { text: "Sosyal", left: "60%", top: "44%", rotate: "-3deg" },
                  { text: "Video", left: "12%", top: "57%", rotate: "6deg" },
                  { text: "Analitik", left: "34%", top: "65%", rotate: "-4deg" },
                ].map((tag) => (
                  <div
                    key={tag.text}
                    className="absolute px-3.5 py-1.5 bg-white text-[#3A6EA8] text-[12px] font-extrabold rounded-xl"
                    style={{
                      left: tag.left,
                      top: tag.top,
                      transform: `rotate(${tag.rotate})`,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {tag.text}
                  </div>
                ))}
              </div>
              {/* text */}
              <div>
                <p className="section-label mb-5">Platform Becerileri</p>
                <h2 className="text-3xl lg:text-[40px] font-extrabold text-[#111] mb-5 leading-tight tracking-tight">
                  Daha akıllı bir içerik asistanı oluşturun
                </h2>
                <p className="text-[#555] mb-8 leading-relaxed text-[15px]">
                  Platformumuzdaki araçları kullanarak içerik tabanlı iş akışlarını hızlandırın ve kaliteli materyaller üretin.
                </p>
                <Link
                  href="/uygulama"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-white text-sm font-bold rounded-full transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[#3A6EA8]/25"
                  style={{ background: "#3A6EA8" }}
                >
                  Daha fazla bilgi →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TOPLULUK KARTLARI ────────────────────────────────────── */}
        <section className="bg-[#F8F6F1] py-24 border-t border-[#EDE9E0]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="section-label justify-center mb-4">Topluluk</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#111] mb-3 tracking-tight">Topluluğa Katılın</h2>
              <p className="text-[#666] text-sm">Binlerce içerik üreticisiyle büyüyün.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COMMUNITY.map((card) => (
                <div
                  key={card.title}
                  className="bg-white border border-[#DDD8CF] rounded-2xl p-7 flex flex-col hover:border-[#B5CDE8] hover:-translate-y-1 transition-all duration-300"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(58,110,168,0.10)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
                >
                  <div className="w-8 h-1 bg-[#3A6EA8] rounded-full mb-6" />
                  <h3 className="text-base font-extrabold text-[#111] mb-3 leading-snug">{card.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed flex-1">{card.desc}</p>
                  <div className="mt-7 pt-6 border-t border-[#EDE9E0]">
                    <Link
                      href={card.href}
                      className="text-xs font-bold text-[#3A6EA8] hover:text-[#2D5A8E] transition-colors flex items-center gap-1"
                    >
                      {card.cta} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOSYAL MEDYA ─────────────────────────────────────────── */}
        <section className="bg-white py-24 border-t border-[#EDE9E0]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="section-label justify-center mb-4">Sosyal Medya</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#111] tracking-tight">Takip Edin</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SOCIAL_CARDS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-[#DDD8CF] rounded-2xl p-7 block hover:border-[#B5CDE8] hover:-translate-y-1 transition-all duration-300"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(58,110,168,0.10)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
                >
                  <div className="w-11 h-11 bg-[#EBF2FA] rounded-xl flex items-center justify-center mb-5 text-[#3A6EA8]">
                    {s.icon}
                  </div>
                  <p className="text-xs text-[#AAA] font-semibold mb-1 tracking-wide">{s.handle}</p>
                  <h3 className="text-base font-bold text-[#111] mb-3 group-hover:text-[#3A6EA8] transition-colors">{s.name}</h3>
                  <p className="text-sm text-[#666] leading-relaxed mb-6">{s.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3A6EA8] border border-[#B5CDE8] rounded-full px-4 py-1.5 hover:bg-[#EBF2FA] transition-colors">
                    Takip Et →
                  </span>
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
