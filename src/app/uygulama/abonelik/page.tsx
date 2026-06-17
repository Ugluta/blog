"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PACKAGES } from "@/lib/packages";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  // TODO: fetch real subscription from API
  const currentPlan: string = "free";

  const handleUpgrade = async (slug: string) => {
    if (!session) { router.push("/giris"); return; }
    if (slug === "free" || slug === currentPlan) return;

    setLoading(slug);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug: slug, billing: yearly ? "yearly" : "monthly" }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Ödeme sayfası oluşturulamadı.");
        return;
      }
      window.location.href = data.url;
    } catch {
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/customer-portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Abonelik yönetimi sayfası açılamadı.");
        return;
      }
      window.location.href = data.url;
    } catch {
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Abonelik Yönetimi</h1>
        <p className="text-sm text-slate-400 mt-1">Mevcut planınız ve kullanım durumunuz</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Mevcut Plan</p>
            <h2 className="text-2xl font-black text-white">Ücretsiz</h2>
            <p className="text-sm text-slate-400 mt-1">Sınırsız kullanım için bir plan seçin</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-amber-400">₺0</p>
            <p className="text-xs text-slate-500">/ay</p>
          </div>
        </div>

        {/* Usage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { label: "Video", used: 0, total: 3, unit: "" },
            { label: "Depolama", used: 0, total: 500, unit: "MB" },
            { label: "Sosyal Hesap", used: 0, total: 1, unit: "" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-slate-300">{item.used} / {item.total}{item.unit}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${(item.used / item.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-white">Plan Seçin</h2>
        <div className="inline-flex items-center bg-slate-800 rounded-full p-1">
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!yearly ? "bg-amber-500 text-slate-900" : "text-slate-400"}`}
          >
            Aylık
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${yearly ? "bg-amber-500 text-slate-900" : "text-slate-400"}`}
          >
            Yıllık <span className="ml-1 text-[10px] bg-green-500/30 text-green-400 px-1.5 rounded-full">%20</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PACKAGES.map((pkg) => {
          const price = yearly && pkg.yearlyPrice ? Math.round(pkg.yearlyPrice / 12) : pkg.price;
          const isCurrent = pkg.slug === currentPlan;
          const isPopular = pkg.isFeatured;
          const isLoading = loading === pkg.slug;

          return (
            <div
              key={pkg.slug}
              className={`relative rounded-2xl border p-5 flex flex-col transition-all
                ${isPopular ? "border-amber-500 bg-amber-500/5" : isCurrent ? "border-green-500/50 bg-green-500/5" : "border-slate-700/50 bg-[#1E293B]"}`}
            >
              {isPopular && !isCurrent && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                  Popüler
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                  Mevcut Plan
                </div>
              )}

              <h3 className="font-bold text-white text-base">{pkg.name}</h3>
              <div className="mt-3 mb-4">
                <span className={`text-3xl font-black ${isPopular ? "text-amber-400" : "text-white"}`}>
                  {price === 0 ? "₺0" : `₺${price}`}
                </span>
                <span className="text-slate-500 text-xs">/ay</span>
                {yearly && pkg.yearlyPrice ? (
                  <p className="text-[10px] text-slate-500 mt-0.5">₺{pkg.yearlyPrice} / yıl</p>
                ) : null}
              </div>

              <ul className="space-y-1.5 flex-1 text-xs mb-5">
                {pkg.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-green-400 text-[10px]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="text-center text-xs text-green-400 font-semibold py-2.5 rounded-xl border border-green-500/30 bg-green-500/10">
                  Mevcut Planınız
                </div>
              ) : (pkg.price as number) === 0 ? (
                <div className="text-center text-xs text-slate-500 py-2.5 rounded-xl border border-slate-700/50">
                  Ücretsiz
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(pkg.slug)}
                  disabled={isLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50
                    ${isPopular ? "bg-amber-500 hover:bg-amber-400 text-slate-900" : "bg-slate-700 hover:bg-slate-600 text-white"}`}
                >
                  {isLoading ? "Yönlendiriliyor..." : (pkg.price as number) > (PACKAGES.find(p => p.slug === currentPlan)?.price ?? 0) ? "Yükselt" : "Düşür"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Manage / Cancel */}
      {currentPlan !== "free" && (
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-200">Aboneliği Yönet</p>
            <p className="text-xs text-slate-500 mt-0.5">Fatura geçmişi, ödeme yöntemi, iptal</p>
          </div>
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors border border-amber-500/30 px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            {portalLoading ? "Yükleniyor..." : "Stripe Portalı Aç →"}
          </button>
        </div>
      )}
    </div>
  );
}
