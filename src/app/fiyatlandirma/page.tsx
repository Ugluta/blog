"use client";

import { useState } from "react";
import Link from "next/link";
import { PACKAGES } from "@/lib/packages";

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-[#0F172A]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-widest text-amber-400 uppercase">KURUMSAL</Link>
          <div className="flex items-center gap-3">
            <Link href="/giris" className="text-sm text-slate-400 hover:text-white transition-colors">Giriş Yap</Link>
            <Link href="/kayit" className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-semibold transition-colors">
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4">Basit, Şeffaf Fiyatlandırma</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            İstediğiniz zaman iptal edin. Kredi kartı zorunlu değil.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-8 bg-slate-800 rounded-full p-1.5">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!yearly ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"}`}
            >
              Aylık
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${yearly ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"}`}
            >
              Yıllık
              <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">%20 indirim</span>
            </button>
          </div>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => {
            const price = yearly && pkg.yearlyPrice ? Math.round(pkg.yearlyPrice / 12) : pkg.price;
            const isPopular = pkg.isFeatured;

            return (
              <div
                key={pkg.slug}
                className={`relative rounded-2xl border p-6 flex flex-col transition-all
                  ${isPopular
                    ? "border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10 scale-105"
                    : "border-slate-700/50 bg-[#1E293B] hover:border-slate-600"
                  }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
                    En Popüler
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-bold text-white">{pkg.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">{pkg.description}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className={`text-4xl font-black ${isPopular ? "text-amber-400" : "text-white"}`}>
                      {price === 0 ? "₺0" : `₺${price}`}
                    </span>
                    <span className="text-slate-500 text-sm mb-1">/ay</span>
                  </div>
                  {yearly && pkg.yearlyPrice && pkg.price > 0 && (
                    <p className="text-xs text-green-400 mt-1">
                      Yıllık ₺{pkg.yearlyPrice} — ₺{pkg.price * 12 - pkg.yearlyPrice} tasarruf
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 text-xs ${isPopular ? "text-amber-400" : "text-green-400"}`}>✓</span>
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={pkg.price === 0 ? "/kayit" : `/kayit?plan=${pkg.slug}`}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors
                    ${isPopular
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-900"
                      : "bg-slate-700 hover:bg-slate-600 text-white"
                    }`}
                >
                  {pkg.price === 0 ? "Ücretsiz Başla" : "Planı Seç"}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Feature comparison */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Detaylı Karşılaştırma</h2>
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-6 py-4 text-slate-400 font-medium">Özellik</th>
                  {PACKAGES.map((p) => (
                    <th key={p.slug} className={`px-4 py-4 text-center font-bold ${p.isFeatured ? "text-amber-400" : "text-white"}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {[
                  { label: "Aylık Video", key: "videoPerMonth", format: (v: number) => v === -1 ? "Sınırsız" : `${v}` },
                  { label: "Depolama", key: "storageGb", format: (v: number) => v === -1 ? "Sınırsız" : v < 1 ? `${v * 1000} MB` : `${v} GB` },
                  { label: "Sosyal Hesap", key: "socialAccounts", format: (v: number) => v === -1 ? "Sınırsız" : `${v}` },
                  { label: "Ekip Üyesi", key: "teamMembers", format: (v: number) => v === -1 ? "Sınırsız" : `${v}` },
                  { label: "Max. Video Süresi", key: "maxVideoSeconds", format: (v: number) => v === -1 ? "Sınırsız" : v >= 60 ? `${v / 60} dk` : `${v} sn` },
                  { label: "Çözünürlük", key: "maxResolution", format: (v: string) => `${v}` },
                  { label: "Filigran", key: "watermark", format: (v: boolean) => v ? "✕" : "✓ Yok" },
                  { label: "Zamanlı Yayın", key: "scheduledPosting", format: (v: boolean) => v ? "✓" : "—" },
                  { label: "API Erişimi", key: "apiAccess", format: (v: boolean) => v ? "✓" : "—" },
                  { label: "Özel Marka", key: "customBranding", format: (v: boolean) => v ? "✓" : "—" },
                  { label: "Öncelikli Destek", key: "prioritySupport", format: (v: boolean) => v ? "✓" : "—" },
                ].map(({ label, key, format }) => (
                  <tr key={key} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-3 text-slate-300">{label}</td>
                    {PACKAGES.map((p) => {
                      const val = (p as Record<string, unknown>)[key];
                      const str = format(val as never);
                      return (
                        <td key={p.slug} className={`px-4 py-3 text-center font-medium ${
                          str === "✓" || str === "✓ Yok" || str === "Sınırsız" ? "text-green-400"
                          : str === "✕" || str === "—" ? "text-slate-600"
                          : p.isFeatured ? "text-amber-400" : "text-slate-300"
                        }`}>
                          {str}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <p className="text-slate-400">
            Sorunuz mu var?{" "}
            <Link href="/iletisim" className="text-amber-400 hover:text-amber-300 transition-colors">
              Bize ulaşın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
