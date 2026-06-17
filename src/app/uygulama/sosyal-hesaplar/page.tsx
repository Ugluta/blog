"use client";

import { useState } from "react";

const PLATFORMS = [
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "from-pink-500/20 to-rose-500/10", border: "border-pink-500/30", desc: "Video + Ses içerikler", authUrl: "#" },
  { id: "instagram", name: "Instagram", icon: "📷", color: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/30", desc: "Reels, Feed, Stories", authUrl: "#" },
  { id: "youtube", name: "YouTube", icon: "▶️", color: "from-red-500/20 to-red-600/10", border: "border-red-500/30", desc: "Shorts + Uzun video", authUrl: "#" },
  { id: "twitter", name: "Twitter / X", icon: "🐦", color: "from-sky-500/20 to-blue-500/10", border: "border-sky-500/30", desc: "Video + Tweet", authUrl: "#" },
  { id: "facebook_page", name: "Facebook Sayfa", icon: "📘", color: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/30", desc: "Sayfa paylaşımları", authUrl: "#" },
  { id: "facebook_group", name: "Facebook Grup", icon: "👥", color: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/30", desc: "Grup paylaşımları", authUrl: "#" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "from-blue-600/20 to-cyan-500/10", border: "border-blue-600/30", desc: "Profesyonel içerik", authUrl: "#" },
  { id: "pinterest", name: "Pinterest", icon: "📌", color: "from-red-500/20 to-rose-500/10", border: "border-red-500/30", desc: "Pin + Board", authUrl: "#" },
  { id: "reddit", name: "Reddit", icon: "🤖", color: "from-orange-500/20 to-red-500/10", border: "border-orange-500/30", desc: "Subreddit paylaşımı", authUrl: "#" },
  { id: "medium", name: "Medium", icon: "✍️", color: "from-slate-500/20 to-slate-600/10", border: "border-slate-500/30", desc: "Blog yazıları", authUrl: "#" },
];

export default function SocialAccountsPage() {
  const [connected, setConnected] = useState<string[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  const connect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setConnected((prev) => [...prev, id]);
      setConnecting(null);
    }, 1500);
  };

  const disconnect = (id: string) => {
    setConnected((prev) => prev.filter((p) => p !== id));
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sosyal Hesaplar</h1>
        <p className="text-sm text-slate-400 mt-1">
          Platformları bağlayın ve videolarınızı otomatik paylaşın.
          <span className="text-amber-400 ml-1">Ücretsiz planda 1 hesap</span>
        </p>
      </div>

      {/* Limit bar */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Bağlı Hesap: {connected.length} / 1</p>
          <p className="text-xs text-slate-500 mt-0.5">Daha fazla hesap için Başlangıç planına geçin</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(connected.length / 1) * 100}%` }} />
          </div>
          <a href="/fiyatlandirma" className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap">Yükselt →</a>
        </div>
      </div>

      {/* Connected accounts */}
      {connected.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Bağlı Hesaplar</h2>
          <div className="space-y-2">
            {connected.map((id) => {
              const p = PLATFORMS.find((pl) => pl.id === id)!;
              return (
                <div key={id} className={`flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r ${p.color} ${p.border}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{p.name}</p>
                      <p className="text-xs text-slate-400">@kullanici_adi · Bağlandı</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">✓ Aktif</span>
                    <button
                      onClick={() => disconnect(id)}
                      className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded"
                    >
                      Bağlantıyı Kes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available platforms */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Kullanılabilir Platformlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLATFORMS.filter((p) => !connected.includes(p.id)).map((platform) => {
            const isConnecting = connecting === platform.id;
            const atLimit = connected.length >= 1;

            return (
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
                  <a href="/fiyatlandirma" className="text-xs text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10">
                    Yükselt
                  </a>
                ) : (
                  <button
                    onClick={() => connect(platform.id)}
                    disabled={isConnecting}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {isConnecting ? (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Bağlanıyor
                      </span>
                    ) : "Bağla"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
