"use client";

import { useState } from "react";
import { STORE_PRODUCTS, REWARDED_AD_REWARDS } from "@/lib/monetization";

type Tab = "adsense" | "admob" | "revenuecat" | "products" | "analytics";

const mockRevenue = {
  mrr: 12450,
  arppu: 187,
  conversion: 4.2,
  churn: 1.8,
  ltv: 10389,
  adsense: 1230,
  admob: 890,
  direct: 3500,
};

export default function MonetizationPage() {
  const [tab, setTab] = useState<Tab>("analytics");
  const [saved, setSaved] = useState(false);

  // AdSense
  const [adsenseClient, setAdsenseClient] = useState("");
  const [autoAds, setAutoAds] = useState(true);

  // AdMob
  const [admobAndroid, setAdmobAndroid] = useState("");
  const [admobIos, setAdmobIos] = useState("");
  const [testMode, setTestMode] = useState(true);
  const [interstitialFreq, setInterstitialFreq] = useState(5);
  const [admobUnits, setAdmobUnits] = useState({
    bannerAndroid: "", bannerIos: "",
    interstitialAndroid: "", interstitialIos: "",
    rewardedAndroid: "", rewardedIos: "",
  });

  // RevenueCat
  const [rcAndroid, setRcAndroid] = useState("");
  const [rcIos, setRcIos] = useState("");
  const [rcWebhook, setRcWebhook] = useState("");

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "analytics", label: "Gelir Analizi", icon: "📊" },
    { id: "adsense", label: "Google AdSense", icon: "🌐" },
    { id: "admob", label: "AdMob (Mobil)", icon: "📱" },
    { id: "revenuecat", label: "RevenueCat", icon: "💰" },
    { id: "products", label: "Ürünler (IAP)", icon: "🛒" },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Monetizasyon</h1>
          <p className="text-sm text-slate-400 mt-0.5">Reklam ağları, uygulama içi satın alımlar ve gelir takibi</p>
        </div>
        <button onClick={save} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-500 text-white" : "bg-amber-500 hover:bg-amber-400 text-slate-900"}`}>
          {saved ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              tab === t.id ? "bg-amber-500 text-slate-900" : "bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700/50"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Analytics ── */}
      {tab === "analytics" && (
        <div className="space-y-5">
          {/* Revenue overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "MRR", value: `₺${mockRevenue.mrr.toLocaleString("tr-TR")}`, icon: "📈", color: "text-green-400" },
              { label: "ARPPU", value: `₺${mockRevenue.arppu}`, icon: "👤", color: "text-blue-400" },
              { label: "Dönüşüm", value: `%${mockRevenue.conversion}`, icon: "🎯", color: "text-amber-400" },
              { label: "Churn", value: `%${mockRevenue.churn}`, icon: "📉", color: "text-red-400" },
              { label: "LTV", value: `₺${mockRevenue.ltv.toLocaleString("tr-TR")}`, icon: "💎", color: "text-purple-400" },
            ].map((m) => (
              <div key={m.label} className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
                <span className="text-xl block mb-2">{m.icon}</span>
                <div className={`text-2xl font-black font-inter ${m.color}`}>{m.value}</div>
                <div className="text-xs text-slate-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Ad revenue breakdown */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-bold text-slate-300 mb-4">Reklam Geliri (Bu Ay)</h2>
            <div className="space-y-3">
              {[
                { label: "Google AdSense (Web)", value: mockRevenue.adsense, color: "bg-blue-500", icon: "🌐" },
                { label: "Google AdMob (Mobil)", value: mockRevenue.admob, color: "bg-green-500", icon: "📱" },
                { label: "Direkt Reklam Satışı", value: mockRevenue.direct, color: "bg-amber-500", icon: "🤝" },
              ].map((r) => {
                const total = mockRevenue.adsense + mockRevenue.admob + mockRevenue.direct;
                const pct = Math.round((r.value / total) * 100);
                return (
                  <div key={r.label} className="flex items-center gap-4">
                    <span className="w-5">{r.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{r.label}</span>
                        <span className="text-slate-200 font-semibold">₺{r.value.toLocaleString("tr-TR")} (%{pct})</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${r.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-slate-700/50 flex justify-between text-sm font-bold">
                <span className="text-slate-400">Toplam</span>
                <span className="text-amber-400">₺{(mockRevenue.adsense + mockRevenue.admob + mockRevenue.direct).toLocaleString("tr-TR")}</span>
              </div>
            </div>
          </div>

          {/* Rewarded ads */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-bold text-slate-300 mb-3">Ödüllü Reklam Ödülleri</h2>
            <p className="text-xs text-slate-500 mb-4">Kullanıcı reklam izlediğinde ne kazansın?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {REWARDED_AD_REWARDS.map((r) => (
                <div key={r.type} className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-4 text-center">
                  <span className="text-3xl block mb-2">{r.icon}</span>
                  <p className="text-sm font-semibold text-slate-200">{r.label}</p>
                  <p className="text-xs text-slate-500 mt-1">Miktar: {r.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AdSense ── */}
      {tab === "adsense" && (
        <div className="space-y-5">
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🌐</span>
              <div>
                <h2 className="text-sm font-bold text-white">Google AdSense</h2>
                <p className="text-xs text-slate-400">Web sitesi reklam geliri</p>
              </div>
              <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer"
                className="ml-auto text-xs text-amber-400 hover:text-amber-300">
                AdSense Console →
              </a>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Publisher ID</label>
              <input value={adsenseClient} onChange={(e) => setAdsenseClient(e.target.value)}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-amber-500" />
            </div>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <div>
                <span className="text-sm text-slate-200">Otomatik Reklam (Auto Ads)</span>
                <p className="text-xs text-slate-500">Google en iyi konuma otomatik yerleştirir</p>
              </div>
              <div onClick={() => setAutoAds(!autoAds)} className={`w-11 h-6 rounded-full cursor-pointer relative transition-colors ${autoAds ? "bg-amber-500" : "bg-slate-600"}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${autoAds ? "translate-x-6" : "translate-x-1"}`} />
              </div>
            </label>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-blue-300 font-semibold mb-1">📋 Kurulum Adımları</p>
            <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
              <li>AdSense hesabı oluşturun → sitenizi ekleyin</li>
              <li>Publisher ID&apos;yi buraya girin</li>
              <li>Onay sürecini tamamlayın (1-14 gün)</li>
              <li>Admin → Reklam Yönetimi&apos;nde zone&apos;ları aktif edin</li>
            </ol>
          </div>
        </div>
      )}

      {/* ── AdMob ── */}
      {tab === "admob" && (
        <div className="space-y-5">
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📱</span>
              <div>
                <h2 className="text-sm font-bold text-white">Google AdMob</h2>
                <p className="text-xs text-slate-400">iOS + Android mobil uygulama reklamları</p>
              </div>
              <a href="https://admob.google.com" target="_blank" rel="noopener noreferrer"
                className="ml-auto text-xs text-amber-400 hover:text-amber-300">AdMob Console →</a>
            </div>

            <label className="flex items-center justify-between py-2 cursor-pointer border-b border-slate-700/30">
              <div>
                <span className="text-sm text-slate-200">Test Modu</span>
                <p className="text-xs text-slate-500">Geliştirme sırasında test reklamları göster</p>
              </div>
              <div onClick={() => setTestMode(!testMode)} className={`w-11 h-6 rounded-full cursor-pointer relative transition-colors ${testMode ? "bg-amber-500" : "bg-slate-600"}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${testMode ? "translate-x-6" : "translate-x-1"}`} />
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">🤖 Android App ID</label>
                <input value={admobAndroid} onChange={(e) => setAdmobAndroid(e.target.value)}
                  placeholder="ca-app-pub-XXXXXXXX~XXXXXXXX"
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">🍎 iOS App ID</label>
                <input value={admobIos} onChange={(e) => setAdmobIos(e.target.value)}
                  placeholder="ca-app-pub-XXXXXXXX~XXXXXXXX"
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-amber-500" />
              </div>
            </div>
          </div>

          {/* Ad Unit IDs */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-300">Reklam Birimi ID&apos;leri</h2>
            {[
              { key: "bannerAndroid", label: "Banner — Android", icon: "📊" },
              { key: "bannerIos", label: "Banner — iOS", icon: "📊" },
              { key: "interstitialAndroid", label: "Tam Sayfa (Interstitial) — Android", icon: "🖥️" },
              { key: "interstitialIos", label: "Tam Sayfa (Interstitial) — iOS", icon: "🖥️" },
              { key: "rewardedAndroid", label: "Ödüllü Reklam — Android", icon: "🎁" },
              { key: "rewardedIos", label: "Ödüllü Reklam — iOS", icon: "🎁" },
            ].map(({ key, label, icon }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">{icon} {label}</label>
                <input
                  value={admobUnits[key as keyof typeof admobUnits]}
                  onChange={(e) => setAdmobUnits({ ...admobUnits, [key]: e.target.value })}
                  placeholder="ca-app-pub-XXXXXXXX/XXXXXXXXXX"
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            ))}
          </div>

          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-bold text-slate-300 mb-3">Frekans Ayarları</h2>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Tam Sayfa Reklam Sıklığı: Her <span className="text-amber-400 font-bold">{interstitialFreq}</span> aksiyonda bir
              </label>
              <input type="range" min={2} max={20} value={interstitialFreq}
                onChange={(e) => setInterstitialFreq(Number(e.target.value))}
                className="w-full accent-amber-500" />
              <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                <span>Sık (2)</span><span>Dengeli (10)</span><span>Seyrek (20)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RevenueCat ── */}
      {tab === "revenuecat" && (
        <div className="space-y-5">
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💰</span>
              <div>
                <h2 className="text-sm font-bold text-white">RevenueCat</h2>
                <p className="text-xs text-slate-400">iOS + Android abonelik ve IAP yönetimi</p>
              </div>
              <a href="https://app.revenuecat.com" target="_blank" rel="noopener noreferrer"
                className="ml-auto text-xs text-amber-400 hover:text-amber-300">Dashboard →</a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">🤖 Android API Key</label>
                <input value={rcAndroid} onChange={(e) => setRcAndroid(e.target.value)}
                  placeholder="goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">🍎 iOS API Key</label>
                <input value={rcIos} onChange={(e) => setRcIos(e.target.value)}
                  placeholder="appl_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-amber-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Webhook Secret</label>
              <input value={rcWebhook} onChange={(e) => setRcWebhook(e.target.value)}
                placeholder="rcwebhook_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-amber-500" />
              <p className="text-xs text-slate-500 mt-1">
                Webhook URL: <code className="text-amber-400 bg-slate-800 px-1 rounded">https://yourdomain.com/api/webhooks/revenuecat</code>
              </p>
            </div>
          </div>

          {/* Setup guide */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-bold text-slate-300 mb-4">Kurulum Akışı</h2>
            <div className="space-y-3">
              {[
                { step: 1, title: "RevenueCat Projesi Oluştur", desc: "app.revenuecat.com → New Project", status: "pending" },
                { step: 2, title: "App Store Connect — IAP Ekle", desc: "Product IDs girin (com.yourapp.starter_monthly vb.)", status: "pending" },
                { step: 3, title: "Google Play Console — IAP Ekle", desc: "Subscription products oluşturun", status: "pending" },
                { step: 4, title: "RevenueCat'e Entitlements Tanımla", desc: "'starter_access', 'pro_access', 'enterprise_access'", status: "pending" },
                { step: 5, title: "API Anahtarlarını Buraya Girin", desc: "Android + iOS anahtarları", status: "pending" },
                { step: 6, title: "Webhook'u Yapılandır", desc: "Abonelik olaylarını DB'ye senkronize et", status: "pending" },
                { step: 7, title: "Mobil Uygulamaya SDK Ekle", desc: "expo install react-native-purchases", status: "pending" },
              ].map((s) => (
                <div key={s.step} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-700 text-slate-400 text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm text-slate-200 font-medium">{s.title}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Products (IAP) ── */}
      {tab === "products" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Uygulama içi satın alım ürünleri — App Store ve Play Store&apos;da aynı ID&apos;ler kullanılmalıdır.</p>
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Ürün</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Tip</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">App Store ID</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Play Store ID</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase">Fiyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {STORE_PRODUCTS.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-slate-200 font-medium">{p.packageSlug} / {p.billingPeriod}</p>
                      <p className="text-xs text-slate-500 font-mono">{p.revenueCatId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.type === "subscription" ? "bg-blue-500/20 text-blue-400"
                        : p.type === "consumable" ? "bg-green-500/20 text-green-400"
                        : "bg-purple-500/20 text-purple-400"
                      }`}>
                        {p.type === "subscription" ? "Abonelik" : p.type === "consumable" ? "Tüketilebilir" : "Kalıcı"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400 truncate max-w-[160px]">
                      {p.appStoreProductId}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {p.playStoreProductId}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-amber-400">
                      ₺{p.priceTRY}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
