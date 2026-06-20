import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    color: "#f59e0b",
    title: "AI İçerik Üretimi",
    desc: "Tek tıkla makale, blog yazısı ve sosyal medya içerikleri oluşturun. GPT-4 ve Claude destekli.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    color: "#3b82f6",
    title: "Analitik Dashboard",
    desc: "Gerçek zamanlı okuyucu analizi, trafik kaynakları ve içerik performansını takip edin.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
    color: "#10b981",
    title: "Sosyal Medya Yönetimi",
    desc: "İçeriklerinizi Twitter, LinkedIn, Instagram'a otomatik olarak zamanlayın ve yayınlayın.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
    color: "#8b5cf6",
    title: "SEO Optimizasyonu",
    desc: "Meta etiketleri, sitemap ve yapısal veri otomatik oluşturulur. Google'da üst sıralarda yer alın.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
    color: "#ec4899",
    title: "Medya Yönetimi",
    desc: "Görsel, video ve dosyalarınızı bulutta depolayın. CDN ile dünyanın her yerine hızlıca iletin.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    color: "#f97316",
    title: "Geliştirici API",
    desc: "REST API ve webhook desteğiyle mevcut sistemlerinize entegre edin. Tam kontrol sizde.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24" style={{ background: "#09090b" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            Platform Özellikleri
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
            Her şey tek platformda
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            İçerik üretiminden yayınlamaya, analizden optimizasyona — tüm araçlar burada.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-all"
              style={{ background: "#111113" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}18`, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Tüm özellikleri gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
