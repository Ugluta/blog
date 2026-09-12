"use client";

import { useState } from "react";
import { products } from "@/lib/mockData";

const allCategories = ["Tümü", ...Array.from(new Set(products.map((p) => p.category)))];

function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <div className="group bg-slate-800 border border-slate-700/50 rounded-xl p-6 flex flex-col gap-4 gold-glow hover:border-amber-500/40 transition-all duration-300 news-card-hover">
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
        >
          {product.icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-amber-300 transition-colors">
            {product.name}
          </h3>
          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-slate-700 text-slate-400 rounded font-inter">
            {product.category}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed flex-1 font-inter">
        {product.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div>
          <div className="text-[10px] text-slate-500 font-inter uppercase tracking-wide">Başlangıç Fiyatı</div>
          <div className="text-sm font-bold text-amber-400 font-inter">{product.startingPrice}</div>
        </div>
        <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-700 text-slate-200 hover:bg-amber-500 hover:text-slate-900 transition-all duration-200 font-inter">
          Detaylar →
        </button>
      </div>
    </div>
  );
}

export default function ProductsServices() {
  const [activeTab, setActiveTab] = useState("Tümü");

  const filtered =
    activeTab === "Tümü" ? products : products.filter((p) => p.category === activeTab);

  return (
    <section className="my-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold section-header" style={{ fontFamily: "'Playfair Display', serif" }}>
          Ürünler &amp; Hizmetler
        </h2>
        <a
          href="/urunler"
          className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-inter flex items-center gap-1"
        >
          Tümünü İncele
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 font-inter ${
              activeTab === cat
                ? "text-slate-900"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700"
            }`}
            style={activeTab === cat ? { backgroundColor: "#F59E0B" } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
