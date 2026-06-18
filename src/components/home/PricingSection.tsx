import Link from "next/link";

const plans = [
  {
    id: "basic",
    name: "Temel Plan",
    price: "₺499",
    period: "/ay",
    features: ["Stratejik Planlama", "Süreç Optimizasyonu", "Teknoloji Analizi", "Destek Saatleri"],
    cta: "Satın Al",
    highlight: false,
  },
  {
    id: "standard",
    name: "Standart Plan",
    price: "₺999",
    period: "/ay",
    features: ["Stratejik Planlama", "Süreç Optimizasyonu", "Teknoloji Entegrasyonu", "Üç Aylık İnceleme", "Öncelikli Destek"],
    cta: "Satın Al",
    highlight: true,
    badge: "Popüler",
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "₺1.999",
    period: "/ay",
    features: ["Stratejik Planlama", "Süreç Optimizasyonu", "Teknoloji Entegrasyonu", "Yenilikçi Çözümler", "Özel Danışman", "Sınırsız Destek"],
    cta: "Satın Al",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-16" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">FİYATLANDIRMA</span>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            İhtiyacınıza Uygun Plan
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-6 rounded-sm border transition-all ${
                plan.highlight
                  ? "bg-slate-700/60 border-amber-500/50 shadow-lg shadow-amber-500/10"
                  : "border-slate-700/50 hover:border-slate-600"
              }`}
              style={{ backgroundColor: plan.highlight ? "#1E293B" : "#0F172A" }}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className="mb-6">
                <p className="text-slate-400 text-sm mb-1">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/iletisim"
                className={`flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-bold transition-colors ${
                  plan.highlight
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-900"
                    : "border border-slate-600 hover:border-amber-500 text-slate-200 hover:text-amber-400"
                }`}
              >
                {plan.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
