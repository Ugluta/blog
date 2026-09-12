import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#09090b" }}>
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-28 lg:py-40 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Yapay Zeka Destekli Platform — Şimdi Dene
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
          İçerik üretin,
          <br />
          <span
            className="inline-block"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            hızla yayınlayın.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-zinc-400 leading-relaxed mb-10">
          Blog, makale ve dijital içeriklerinizi tek platformdan yönetin.
          Yapay zeka yazarken siz büyüyün.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/uygulama"
            className="px-8 py-3.5 rounded-xl text-sm font-bold text-black transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}
          >
            Ücretsiz Başlayın →
          </Link>
          <Link
            href="/blog"
            className="px-8 py-3.5 rounded-xl text-sm font-semibold text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white transition-all"
          >
            Blog'u Keşfet
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 max-w-2xl mx-auto gap-px bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-800">
          {[
            { value: "10K+", label: "İçerik Üretildi" },
            { value: "500+", label: "Aktif Kullanıcı" },
            { value: "99.9%", label: "Uptime" },
          ].map((s) => (
            <div key={s.label} className="py-5 px-4 text-center" style={{ background: "#111113" }}>
              <p className="text-2xl font-black text-white mb-1">{s.value}</p>
              <p className="text-xs text-zinc-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
