"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PACKAGES } from "@/lib/packages";

const PLAN_COLORS: Record<string, string> = {
  free: "border-slate-700/50",
  starter: "border-blue-500/40",
  pro: "border-amber-500/60",
  enterprise: "border-purple-500/40",
};

const PLAN_BADGES: Record<string, string | null> = {
  free: null,
  starter: null,
  pro: "En Popüler",
  enterprise: "Kurumsal",
};

const PLAN_BTN: Record<string, string> = {
  free: "bg-slate-700 hover:bg-slate-600 text-white",
  starter: "bg-blue-600 hover:bg-blue-500 text-white",
  pro: "bg-amber-500 hover:bg-amber-400 text-slate-900",
  enterprise: "bg-purple-600 hover:bg-purple-500 text-white",
};

function formatPrice(price: number, yearly: boolean, yearlyPrice: number) {
  if (price === 0) return "Ücretsiz";
  if (yearly) return `₺${Math.round(yearlyPrice / 12).toLocaleString("tr-TR")}/ay`;
  return `₺${price.toLocaleString("tr-TR")}/ay`;
}

const FAQS = [
  { q: "Ücretsiz plan sonsuza kadar ücretsiz mi?", a: "Evet. Ücretsiz plan herhangi bir zaman sınırı olmaksızın tamamen ücretsizdir. Kredi kartı girmenize gerek yok." },
  { q: "İstediğim zaman plan değiştirebilir miyim?", a: "Evet. Dilediğiniz zaman plan yükseltme veya düşürme yapabilirsiniz. Yükseltmeler anında aktif olur." },
  { q: "Yıllık ödeme yaparsam ne kadar tasarruf ederim?", a: "Yıllık ödemede yaklaşık %20 indirim uygulanmaktadır. Ödeme sayfasında net tutarı görebilirsiniz." },
  { q: "Kurumsal plan için özel fiyat alabilir miyim?", a: "Evet. 10'dan fazla kullanıcı veya özel gereksinimler için satış ekibimizle iletişime geçin." },
  { q: "Fatura/KDV belgesi alabilir miyim?", a: "Tüm planlar için KDV dahil e-fatura otomatik olarak e-posta adresinize iletilir." },
];

export default function AboneOlPage() {
  const { data: session } = useSession();
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Minimal header */}
      <div className="border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-6xl">
          <Link href="/" className="text-lg font-black tracking-widest text-amber-400 uppercase">KURUMSAL</Link>
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/uygulama/abonelik" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                Aboneliğimi Yönet
              </Link>
            ) : (
              <>
                <Link href="/giris" className="text-sm text-slate-400 hover:text-white transition-colors">Giriş Yap</Link>
                <Link href="/kayit" className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-semibold transition-colors">
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            İçerik Üretiminizi Güçlendirin
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            AI destekli otomasyon, sosyal medya yönetimi ve kurumsal analitik — tek platformda.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-slate-800 rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!yearly ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"}`}
            >
              Aylık
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${yearly ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"}`}
            >
              Yıllık
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${yearly ? "bg-emerald-600 text-white" : "bg-emerald-500/20 text-emerald-400"}`}>
                %20 indirim
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
          {PACKAGES.map((plan) => {
            const badge = PLAN_BADGES[plan.slug];
            const borderCls = PLAN_COLORS[plan.slug];
            const btnCls = PLAN_BTN[plan.slug];
            const isFeatured = plan.slug === "pro";

            return (
              <div
                key={plan.slug}
                className={`relative flex flex-col rounded-2xl border-2 p-6 ${borderCls} ${isFeatured ? "bg-amber-500/5" : "bg-slate-800/50"}`}
              >
                {badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isFeatured ? "bg-amber-500 text-slate-900" : "bg-purple-600 text-white"}`}>
                    {badge}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{plan.description}</p>
                </div>

                <div className="mb-5">
                  <span className="text-3xl font-black text-white">
                    {formatPrice(plan.price, yearly, plan.yearlyPrice ?? 0)}
                  </span>
                  {plan.price > 0 && yearly && (
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Yıllık ₺{plan.yearlyPrice?.toLocaleString("tr-TR")} faturalandırılır
                    </div>
                  )}
                </div>

                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-amber-400 flex-shrink-0 mt-px">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.slug === "enterprise" ? (
                  <Link
                    href="/iletisim"
                    className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${btnCls}`}
                  >
                    Teklif İste
                  </Link>
                ) : session ? (
                  <Link
                    href="/uygulama/abonelik"
                    className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${btnCls}`}
                  >
                    {plan.slug === "free" ? "Mevcut Plan" : "Yükselt"}
                  </Link>
                ) : (
                  <Link
                    href={`/kayit?plan=${plan.slug}`}
                    className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${btnCls}`}
                  >
                    {plan.slug === "free" ? "Ücretsiz Başla" : "Başla"}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature comparison */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Plan Karşılaştırması
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 pr-4 text-slate-400 font-medium">Özellik</th>
                  {PACKAGES.map((p) => (
                    <th key={p.slug} className={`text-center py-3 px-3 font-bold ${p.slug === "pro" ? "text-amber-400" : "text-white"}`}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Video / Ay", values: ["3", "20", "Sınırsız", "Sınırsız"] },
                  { label: "Sosyal Hesap", values: ["1", "5", "20", "Sınırsız"] },
                  { label: "Depolama", values: ["500 MB", "5 GB", "50 GB", "Sınırsız"] },
                  { label: "Video Süresi", values: ["30 sn", "60 sn", "5 dk", "Sınırsız"] },
                  { label: "Çözünürlük", values: ["720p", "1080p", "4K", "4K"] },
                  { label: "Filigran", values: ["✓", "—", "—", "—"] },
                  { label: "API Erişimi", values: ["—", "—", "✓", "✓"] },
                  { label: "Analitik", values: ["—", "Temel", "Gelişmiş", "Tam"] },
                  { label: "Ekip Üyesi", values: ["1", "1", "5", "Sınırsız"] },
                  { label: "Destek", values: ["Topluluk", "E-posta", "Öncelikli", "7/24 SLA"] },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-4 text-slate-400">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className={`text-center py-3 px-3 text-xs ${v === "—" ? "text-slate-700" : i === 2 ? "text-amber-400 font-medium" : "text-slate-300"}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Sık Sorulan Sorular</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-700/50 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  <span className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${openFaq === i ? "rotate-180" : ""}`}>▾</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-700/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/20 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Hâlâ karar veremediniz mi?</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Satış ekibimiz ile 30 dakikalık ücretsiz demo görüşmesi ayarlayın.
          </p>
          <Link href="/iletisim" className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold transition-colors">
            Demo Talep Et
          </Link>
        </div>
      </div>
    </div>
  );
}
