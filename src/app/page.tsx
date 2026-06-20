import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getRecentPosts() {
  try {
    if (!prisma) return [];
    return await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true, category: { select: { name: true } } },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getRecentPosts();

  return (
    <>
      <MegaHeader />
      <main>

        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white">
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60" />
          {/* Gradient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-[100px]" style={{ background: "radial-gradient(ellipse, #f59e0b, #ef4444, transparent)" }} />

          <div className="relative max-w-5xl mx-auto px-6 py-28 lg:py-40 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Yapay Zeka Destekli — Yeni Nesil Platform
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-[1.06] mb-6">
              İçerik yönetimi
              <br />
              <span style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                yeniden tanımlandı.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-500 leading-relaxed mb-10">
              Blog, makale ve dijital içeriklerinizi tek platformdan yönetin.
              Yapay zeka yazarken, siz büyüyün.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/uygulama"
                className="px-8 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:scale-105 transition-all"
                style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
              >
                Ücretsiz Başlayın →
              </Link>
              <Link
                href="/blog"
                className="px-8 py-3.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900 bg-white transition-all"
              >
                Blog'u İncele
              </Link>
            </div>
          </div>
        </section>

        {/* ── LOGO BAR ──────────────────────────────────────── */}
        <section className="border-y border-gray-100 bg-gray-50 py-8">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
              Güvenilen Teknolojiler
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale">
              {["Next.js", "Prisma", "TypeScript", "PostgreSQL", "Tailwind CSS", "Vercel"].map((name) => (
                <span key={name} className="text-sm font-bold text-gray-800">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 block">Platform</span>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">Her şey tek yerde</h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                İçerik üretiminden analize, sosyal medyadan SEO'ya — tüm araçlar dahil.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "✦", color: "#f59e0b", bg: "#fef3c7", title: "AI İçerik Üretimi", desc: "GPT-4 ve Claude ile saniyeler içinde makale, blog ve sosyal medya içerikleri oluşturun." },
                { icon: "◈", color: "#3b82f6", bg: "#dbeafe", title: "Analitik Dashboard", desc: "Gerçek zamanlı okuyucu verisi, trafik kaynakları ve içerik performans metrikleri." },
                { icon: "⇄", color: "#10b981", bg: "#d1fae5", title: "Sosyal Medya Yönetimi", desc: "Twitter, LinkedIn ve Instagram'a otomatik zamanlama ve çoklu hesap yönetimi." },
                { icon: "◎", color: "#8b5cf6", bg: "#ede9fe", title: "SEO Optimizasyonu", desc: "Otomatik meta etiket, sitemap ve yapısal veri. Google'da üst sıralara çıkın." },
                { icon: "▣", color: "#ec4899", bg: "#fce7f3", title: "Medya Kütüphanesi", desc: "Görsel ve videolarınızı CDN üzerinden dünyaya hızla iletin. Sınırsız depolama." },
                { icon: "⌥", color: "#f97316", bg: "#ffedd5", title: "Geliştirici API", desc: "REST API ve webhook ile mevcut sistemlerinize entegre edin. Tam esneklik." },
              ].map((f) => (
                <div key={f.title} className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-all bg-white">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4" style={{ background: f.bg, color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────── */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: "10K+", label: "İçerik Üretildi" },
                { value: "500+", label: "Aktif Kullanıcı" },
                { value: "99.9%", label: "Çalışma Süresi" },
                { value: "3 sn", label: "Ortalama Yükleme" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-black text-white mb-1">{s.value}</p>
                  <p className="text-sm text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 block">Nasıl Çalışır?</span>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900">3 adımda başlayın</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Hesap Oluşturun", desc: "Ücretsiz kayıt olun, kredi kartı gerekmez. 2 dakikada hazır." },
                { step: "02", title: "İçerik Üretin", desc: "AI destekli editörümüzle içerik oluşturun veya mevcut içeriklerinizi aktarın." },
                { step: "03", title: "Yayınlayın ve Büyüyün", desc: "Tek tıkla yayınlayın, analizlerle büyüyün, sosyal medyada paylaşın." },
              ].map((s) => (
                <div key={s.step} className="relative">
                  <div className="text-6xl font-black text-gray-100 mb-4 leading-none">{s.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────── */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 block">Fiyatlandırma</span>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">Şeffaf, basit fiyatlar</h2>
              <p className="text-gray-500 text-lg">Gizli ücret yok. İstediğin zaman iptal et.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Ücretsiz", price: "₺0", period: "/ay", features: ["3 içerik/ay", "1 sosyal hesap", "Temel analitik", "5 GB depolama"], cta: "Başlayın", highlight: false },
                { name: "Pro", price: "₺299", period: "/ay", features: ["Sınırsız içerik", "10 sosyal hesap", "Gelişmiş analitik", "50 GB depolama", "AI asistan", "Öncelikli destek"], cta: "Pro'ya Geç", highlight: true },
                { name: "Kurumsal", price: "Özel", period: "", features: ["Sınırsız her şey", "Özel entegrasyon", "Özel AI modeli", "SLA garantisi", "Dedike destek"], cta: "İletişime Geç", highlight: false },
              ].map((p) => (
                <div
                  key={p.name}
                  className={`rounded-2xl p-7 ${p.highlight ? "bg-gray-900 ring-2 ring-amber-500 shadow-xl shadow-amber-100" : "bg-white border border-gray-200"}`}
                >
                  <p className={`text-sm font-bold mb-1 ${p.highlight ? "text-amber-400" : "text-gray-500"}`}>{p.name}</p>
                  <div className="flex items-end gap-1 mb-6">
                    <span className={`text-4xl font-black ${p.highlight ? "text-white" : "text-gray-900"}`}>{p.price}</span>
                    <span className={`text-sm pb-1 ${p.highlight ? "text-gray-400" : "text-gray-400"}`}>{p.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${p.highlight ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="text-amber-500 font-bold">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={p.name === "Kurumsal" ? "/iletisim" : "/uygulama"}
                    className={`block text-center py-3 rounded-xl text-sm font-bold transition-all ${
                      p.highlight
                        ? "bg-amber-500 hover:bg-amber-400 text-black"
                        : "border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900 bg-white"
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RECENT POSTS ──────────────────────────────────── */}
        {posts.length > 0 && (
          <section className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 block">Blog</span>
                  <h2 className="text-3xl font-black text-gray-900">Son Yazılar</h2>
                </div>
                <Link href="/blog" className="text-sm font-semibold text-amber-600 hover:text-amber-500">
                  Tümünü Gör →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all">
                    {post.category && (
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{post.category.name}</span>
                    )}
                    <h3 className="font-bold text-gray-900 mt-2 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="py-24" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Bugün başlayın</h2>
            <p className="text-orange-100 text-lg mb-8">Kurulum yok, kredi kartı yok. 2 dakikada hazır.</p>
            <Link
              href="/uygulama"
              className="inline-block px-10 py-4 rounded-xl bg-white text-amber-600 text-sm font-black hover:bg-orange-50 transition-colors shadow-xl"
            >
              Ücretsiz Deneyin →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
