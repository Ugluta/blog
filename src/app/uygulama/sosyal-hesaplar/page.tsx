"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type ConnectedAccount = {
  id: string;
  platform: string;
  displayName: string;
  username?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
};

const PLATFORMS = [
  { id: "tiktok",         name: "TikTok",         icon: "🎵", color: "from-pink-500/20 to-rose-500/10",    border: "border-pink-500/30",   desc: "Video + Ses içerikler",    envKey: "TIKTOK_CLIENT_KEY" },
  { id: "instagram",      name: "Instagram",       icon: "📷", color: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/30", desc: "Reels, Feed, Stories",     envKey: "META_APP_ID" },
  { id: "youtube",        name: "YouTube",         icon: "▶️", color: "from-red-500/20 to-red-600/10",     border: "border-red-500/30",    desc: "Shorts + Uzun video",      envKey: "GOOGLE_CLIENT_ID" },
  { id: "twitter",        name: "Twitter / X",     icon: "🐦", color: "from-sky-500/20 to-blue-500/10",   border: "border-sky-500/30",    desc: "Video + Tweet",            envKey: "TWITTER_CLIENT_ID" },
  { id: "facebook_page",  name: "Facebook Sayfa",  icon: "📘", color: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/30",  desc: "Sayfa paylaşımları",       envKey: "META_APP_ID" },
  { id: "facebook_group", name: "Facebook Grup",   icon: "👥", color: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/30",  desc: "Grup paylaşımları",        envKey: "META_APP_ID" },
  { id: "linkedin",       name: "LinkedIn",        icon: "💼", color: "from-blue-600/20 to-cyan-500/10",  border: "border-blue-600/30",   desc: "Profesyonel içerik",       envKey: "LINKEDIN_CLIENT_ID" },
  { id: "pinterest",      name: "Pinterest",       icon: "📌", color: "from-red-500/20 to-rose-500/10",   border: "border-red-500/30",    desc: "Pin + Board",              envKey: "PINTEREST_APP_ID" },
  { id: "reddit",         name: "Reddit",          icon: "🤖", color: "from-orange-500/20 to-red-500/10", border: "border-orange-500/30", desc: "Subreddit paylaşımı",      envKey: "REDDIT_CLIENT_ID" },
  { id: "medium",         name: "Medium",          icon: "✍️", color: "from-slate-500/20 to-slate-600/10", border: "border-slate-500/30", desc: "Blog yazıları",            envKey: "MEDIUM_CLIENT_ID" },
];

const PLATFORM_LABEL: Record<string, string> = {
  TIKTOK: "TikTok",
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  TWITTER: "Twitter / X",
  FACEBOOK_PAGE: "Facebook Sayfa",
  FACEBOOK_GROUP: "Facebook Grup",
  LINKEDIN: "LinkedIn",
  PINTEREST: "Pinterest",
  REDDIT: "Reddit",
  MEDIUM: "Medium",
};

const PLATFORM_ICON: Record<string, string> = {
  TIKTOK: "🎵", INSTAGRAM: "📷", YOUTUBE: "▶️", TWITTER: "🐦",
  FACEBOOK_PAGE: "📘", FACEBOOK_GROUP: "👥", LINKEDIN: "💼",
  PINTEREST: "📌", REDDIT: "🤖", MEDIUM: "✍️",
};

const MAX_FREE_ACCOUNTS = 1;

function SearchParamsHandler({ onToast }: { onToast: (type: "success" | "error", text: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    if (connected) onToast("success", `${PLATFORM_LABEL[connected.toUpperCase()] ?? connected} başarıyla bağlandı!`);
    if (error) onToast("error", `Bağlantı başarısız: ${error}`);
  }, [searchParams, onToast]);
  return null;
}

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch("/api/social/accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(d.accounts ?? []))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }, []);

  const disconnect = async (id: string) => {
    setDisconnecting(id);
    await fetch("/api/social/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setDisconnecting(null);
    showToast("success", "Hesap bağlantısı kesildi");
  };

  const connectedPlatformIds = new Set(accounts.map((a) => a.platform.toLowerCase().replace("_", "_")));
  const atLimit = accounts.length >= MAX_FREE_ACCOUNTS;

  const availablePlatforms = PLATFORMS.filter(
    (p) => !connectedPlatformIds.has(p.id.toUpperCase()) && !accounts.some((a) => a.platform === p.id.toUpperCase())
  );

  return (
    <div className="p-4 lg:p-6 max-w-4xl space-y-6">
      <Suspense fallback={null}>
        <SearchParamsHandler onToast={showToast} />
      </Suspense>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${toast.type === "success" ? "bg-green-500/20 border border-green-500/40 text-green-300" : "bg-red-500/20 border border-red-500/40 text-red-300"}`}>
          {toast.type === "success" ? "✓ " : "✕ "}{toast.text}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Sosyal Hesaplar</h1>
        <p className="text-sm text-slate-400 mt-1">
          Platformları bağlayın ve içeriklerinizi otomatik paylaşın.
          <span className="text-amber-400 ml-1">Ücretsiz planda 1 hesap</span>
        </p>
      </div>

      {/* Limit bar */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Bağlı Hesap: {loading ? "…" : accounts.length} / {MAX_FREE_ACCOUNTS}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Daha fazla hesap için Başlangıç planına geçin</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${Math.min((accounts.length / MAX_FREE_ACCOUNTS) * 100, 100)}%` }}
            />
          </div>
          <a href="/fiyatlandirma" className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap">
            Yükselt →
          </a>
        </div>
      </div>

      {/* Connected accounts */}
      {accounts.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Bağlı Hesaplar</h2>
          <div className="space-y-2">
            {accounts.map((account) => {
              const p = PLATFORMS.find((pl) => pl.id === account.platform.toLowerCase()) ??
                { color: "from-slate-500/20 to-slate-600/10", border: "border-slate-500/30" };
              const icon = PLATFORM_ICON[account.platform] ?? "📋";
              const label = PLATFORM_LABEL[account.platform] ?? account.platform;
              return (
                <div
                  key={account.id}
                  className={`flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r ${p.color} ${p.border}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-slate-400">
                        {account.username ? `@${account.username}` : account.displayName} · Bağlandı
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">✓ Aktif</span>
                    <button
                      onClick={() => disconnect(account.id)}
                      disabled={disconnecting === account.id}
                      className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded disabled:opacity-50"
                    >
                      {disconnecting === account.id ? "…" : "Bağlantıyı Kes"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skeleton while loading */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      )}

      {/* Available platforms */}
      {!loading && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Kullanılabilir Platformlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availablePlatforms.map((platform) => (
              <div
                key={platform.id}
                className={`flex items-center justify-between p-4 rounded-xl border bg-[#1E293B] ${platform.border} hover:bg-slate-700/30 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{platform.name}</p>
                    <p className="text-xs text-slate-500">{platform.desc}</p>
                  </div>
                </div>
                {atLimit ? (
                  <a
                    href="/fiyatlandirma"
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10"
                  >
                    Yükselt
                  </a>
                ) : (
                  <a
                    href={`/api/social/connect/${platform.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors whitespace-nowrap"
                  >
                    Bağla
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600">
        OAuth 2.0 ile güvenli bağlantı. Şifreniz hiçbir zaman saklanmaz. Her platformun geliştirici hesabı ve API anahtarı gereklidir.
      </p>
    </div>
  );
}
