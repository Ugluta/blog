"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PACKAGES } from "@/lib/packages";

type SubscriptionData = {
  currentPlan: string;
  subscription: {
    id: string;
    status: string;
    billingPeriod: string;
    expiresAt: string | null;
    autoRenew: boolean;
    package: { slug: string; name: string; price: number; yearlyPrice: number | null };
  } | null;
  limits: { videoPerMonth: number; storageGb: number; socialAccounts: number };
  usage: { videosThisMonth: number; storageUsedGb: number; socialAccounts: number };
};

function fmt(n: number, unit: string) {
  if (n === -1) return "Sınırsız";
  return `${n}${unit}`;
}

function UsageBar({ used, total, label, unit = "" }: { used: number; total: number; label: string; unit?: string }) {
  const pct = total <= 0 ? 0 : Math.min(100, Math.round((used / total) * 100));
  const danger = pct >= 90;
  const warn = pct >= 70;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-400">{label}</span>
        <span className={`font-medium ${danger ? "text-red-400" : warn ? "text-amber-400" : "text-slate-300"}`}>
          {total === -1 ? "Sınırsız" : `${used}${unit} / ${total}${unit}`}
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${danger ? "bg-red-500" : warn ? "bg-amber-500" : "bg-green-500"}`}
          style={{ width: total === -1 ? "5%" : `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  const currentPlan = data?.currentPlan ?? "free";
  const currentPkgDef = PACKAGES.find((p) => p.slug === currentPlan) ?? PACKAGES[0];
  const currentPrice = yearly && currentPkgDef.yearlyPrice
    ? Math.round(currentPkgDef.yearlyPrice / 12)
    : currentPkgDef.price;

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
      const body = await res.json();
      if (!res.ok) {
        alert(body.error ?? "Ödeme sayfası oluşturulamadı.");
        return;
      }
      window.location.href = body.url;
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
      const body = await res.json();
      if (!res.ok) {
        alert(body.error ?? "Abonelik yönetimi sayfası açılamadı.");
        return;
      }
      window.location.href = body.url;
    } catch {
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setPortalLoading(false);
    }
  };

  const STATUS_LABEL: Record<string, string> = {
    ACTIVE: "Aktif",
    TRIALING: "Deneme",
    PAST_DUE: "Gecikmiş Ödeme",
    CANCELED: "İptal Edildi",
    EXPIRED: "Süresi Doldu",
    PAUSED: "Duraklatıldı",
  };

  const STATUS_COLOR: Record<string, string> = {
    ACTIVE: "text-green-400",
    TRIALING: "text-blue-400",
    PAST_DUE: "text-red-400",
    CANCELED: "text-slate-500",
    EXPIRED: "text-slate-500",
    PAUSED: "text-yellow-400",
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Abonelik Yönetimi</h1>
        <p className="text-sm text-slate-400 mt-1">Mevcut planınız ve kullanım durumunuz</p>
      </div>

      {/* Current Plan Card */}
      {loadingData ? (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 animate-pulse h-44" />
      ) : (
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Mevcut Plan</p>
                {data?.subscription && (
                  <span className={`text-xs font-semibold ${STATUS_COLOR[data.subscription.status] ?? "text-slate-400"}`}>
                    • {STATUS_LABEL[data.subscription.status] ?? data.subscription.status}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white">{currentPkgDef.name}</h2>
              {data?.subscription?.expiresAt && (
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(data.subscription.expiresAt) > new Date()
                    ? `Yenileme: ${new Date(data.subscription.expiresAt).toLocaleDateString("tr-TR")}`
                    : `Sona erdi: ${new Date(data.subscription.expiresAt).toLocaleDateString("tr-TR")}`}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-amber-400">
                ₺{currentPrice === 0 ? "0" : currentPrice}
              </p>
              <p className="text-xs text-slate-500">/ay</p>
              {data?.subscription && currentPlan !== "free" && (
                <button
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="mt-2 text-xs text-amber-400 hover:text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                >
                  {portalLoading ? "..." : "Faturayı Yönet"}
                </button>
              )}
            </div>
          </div>

          {/* Usage bars */}
          {data && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <UsageBar
                label="Video"
                used={data.usage.videosThisMonth}
                total={data.limits.videoPerMonth}
              />
              <UsageBar
                label="Depolama"
                used={parseFloat((data.usage.storageUsedGb * 1024).toFixed(1))}
                total={data.limits.storageGb === -1 ? -1 : data.limits.storageGb * 1024}
                unit=" MB"
              />
              <UsageBar
                label="Sosyal Hesap"
                used={data.usage.socialAccounts}
                total={data.limits.socialAccounts}
              />
            </div>
          )}
        </div>
      )}

      {/* Plan selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-white">Plan Seçin</h2>
        <div className="inline-flex items-center bg-slate-800 rounded-full p-1">
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!yearly ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"}`}
          >
            Aylık
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${yearly ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"}`}
          >
            Yıllık{" "}
            <span className="ml-1 text-[10px] bg-green-500/30 text-green-400 px-1.5 rounded-full">%20</span>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PACKAGES.map((pkg) => {
          const price = yearly && pkg.yearlyPrice ? Math.round(pkg.yearlyPrice / 12) : pkg.price;
          const isCurrent = pkg.slug === currentPlan;
          const isPopular = pkg.isFeatured;
          const isLoading = loading === pkg.slug;
          const isDowngrade = (pkg.price as number) < (currentPkgDef.price as number) && pkg.slug !== "free";

          return (
            <div
              key={pkg.slug}
              className={`relative rounded-2xl border p-5 flex flex-col transition-all
                ${isCurrent
                  ? "border-green-500/50 bg-green-500/5"
                  : isPopular
                  ? "border-amber-500 bg-amber-500/5"
                  : "border-slate-700/50 bg-[#1E293B] hover:border-slate-600"
                }`}
            >
              {/* Badge */}
              {isCurrent && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase whitespace-nowrap">
                  Mevcut Plan
                </div>
              )}
              {!isCurrent && isPopular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-[10px] font-black px-3 py-0.5 rounded-full uppercase whitespace-nowrap">
                  En Popüler
                </div>
              )}

              <h3 className="font-bold text-white text-base">{pkg.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">{pkg.description}</p>

              <div className="mb-4">
                <span className={`text-3xl font-black ${isPopular && !isCurrent ? "text-amber-400" : "text-white"}`}>
                  {price === 0 ? "₺0" : `₺${price}`}
                </span>
                <span className="text-slate-500 text-xs">/ay</span>
                {yearly && pkg.yearlyPrice && pkg.price > 0 && (
                  <p className="text-[10px] text-green-400 mt-0.5">
                    Yıllık ₺{pkg.yearlyPrice}
                  </p>
                )}
              </div>

              <ul className="space-y-1.5 flex-1 text-xs mb-5">
                {[
                  `${fmt(pkg.videoPerMonth, "")} video/ay`,
                  `${pkg.storageGb === -1 ? "Sınırsız" : pkg.storageGb < 1 ? `${pkg.storageGb * 1000} MB` : `${pkg.storageGb} GB`} depolama`,
                  `${fmt(pkg.socialAccounts, "")} sosyal hesap`,
                  pkg.scheduledPosting ? "Zamanlı yayın" : null,
                  pkg.apiAccess ? "API erişimi" : null,
                  pkg.prioritySupport ? "Öncelikli destek" : null,
                ]
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-green-400 text-[10px] flex-shrink-0">✓</span>
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
                  disabled={!!isLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50
                    ${isPopular ? "bg-amber-500 hover:bg-amber-400 text-slate-900" : "bg-slate-700 hover:bg-slate-600 text-white"}`}
                >
                  {isLoading
                    ? "Yönlendiriliyor…"
                    : isDowngrade
                    ? "Düşür"
                    : "Yükselt"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-400 flex items-start gap-3">
        <span className="text-lg flex-shrink-0">ℹ️</span>
        <div>
          <p>Plan değişikliği anında geçerli olur. Yıllık planlarda kalan süre orantılı olarak hesaplanır.</p>
          <p className="mt-1">Aboneliğinizi iptal etmek veya fatura geçmişinizi görmek için{" "}
            {currentPlan !== "free" ? (
              <button onClick={handlePortal} className="text-amber-400 hover:text-amber-300 underline">
                Stripe Portalını
              </button>
            ) : (
              "bir ücretli plan satın almanız"
            )}
            {" "}gerekmektedir.
          </p>
        </div>
      </div>
    </div>
  );
}
