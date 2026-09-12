"use client";

import { useState } from "react";
import Link from "next/link";
import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import { products } from "@/lib/mockData";

const allCategories = ["Tümü", ...Array.from(new Set(products.map((p) => p.category)))];

const catIcons: Record<string, string> = {
  Altyapı: "☁️",
  Güvenlik: "🛡️",
  Analitik: "📊",
  Danışmanlık: "🚀",
  Entegrasyon: "🔗",
  "Yapay Zeka": "🤖",
};

const catColors: Record<string, string> = {
  Altyapı: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Güvenlik: "bg-red-500/20 text-red-400 border-red-500/30",
  Analitik: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Danışmanlık: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Entegrasyon: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Yapay Zeka": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const FEATURES: Record<number, string[]> = {
  1: ["99.99% SLA uptime", "Otomatik yedekleme", "Multi-region replikasyon", "7/24 NOC desteği"],
  2: ["Zero-trust mimari", "SOC as a Service", "Tehdit istihbaratı", "Uyumluluk raporlama"],
  3: ["Gerçek zamanlı işleme", "AI tahmin motoru", "200+ entegrasyon", "Özelleştirilebilir dashboard"],
  4: ["Ücretsiz ön değerlendirme", "Roadmap geliştirme", "Teknoloji seçimi", "Proje yönetimi"],
  5: ["REST & GraphQL", "Webhook yönetimi", "API gateway", "Sandbox ortamı"],
  6: ["Özel model eğitimi", "MLOps pipeline", "Model izleme", "Açıklanabilir AI"],
};

export default function UrunlerPage() {
  const [activeTab, setActiveTab] = useState("Tümü");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = activeTab === "Tümü" ? products : products.filter((p) => p.category === activeTab);
  const selectedProduct = products.find((p) => p.id === selected);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <MegaHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-slate-300">Ürünler &amp; Hizmetler</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ürünler &amp; Hizmetler
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Kurumsal ihtiyaçlarınıza özel çözümler. Güvenilir altyapıdan yapay zekaya kadar eksiksiz bir teknoloji portföyü.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Aktif Müşteri", value: "350+", icon: "🏢" },
            { label: "Uptime Garantisi", value: "99.99%", icon: "⚡" },
            { label: "Yıllık Destek", value: "7/24/365", icon: "🛟" },
            { label: "Ülke", value: "12", icon: "🌍" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeTab === cat
                  ? "bg-amber-500 border-amber-500 text-slate-900"
                  : "border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              {catIcons[cat] && <span>{catIcons[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
          {filtered.map((product) => {
            const cc = catColors[product.category];
            return (
              <div
                key={product.id}
                onClick={() => setSelected(selected === product.id ? null : product.id)}
                className={`group bg-slate-800 border rounded-xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 ${
                  selected === product.id
                    ? "border-amber-500/60 bg-amber-500/5"
                    : "border-slate-700/50 hover:border-amber-500/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-amber-500/10 border border-amber-500/20">
                    {product.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-100 group-hover:text-amber-300 transition-colors text-sm leading-snug">
                      {product.name}
                    </h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded border ${cc ?? "bg-slate-700 text-slate-400 border-slate-600"}`}>
                      {product.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed flex-1">{product.description}</p>

                {/* Features (when selected) */}
                {selected === product.id && (
                  <ul className="space-y-1.5">
                    {(FEATURES[product.id] ?? []).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-amber-400">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">Başlangıç Fiyatı</div>
                    <div className="text-sm font-bold text-amber-400">{product.startingPrice}</div>
                  </div>
                  <Link
                    href="/iletisim"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-700 text-slate-200 hover:bg-amber-500 hover:text-slate-900 transition-all"
                  >
                    Teklif Al →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/20 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">İhtiyacınıza özel çözüm mü arıyorsunuz?</h2>
          <p className="text-slate-400 text-sm mb-6">Uzman ekibimiz gereksinimlerinizi analiz ederek size özel bir teklif hazırlasın.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/iletisim" className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-colors">
              Bizimle İletişime Geçin
            </Link>
            <Link href="/fiyatlandirma" className="px-6 py-3 rounded-xl border border-slate-700/50 hover:border-amber-500/30 text-slate-300 hover:text-white font-medium text-sm transition-colors">
              Fiyat Planlarını İncele
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
