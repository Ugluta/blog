import Link from "next/link";

const quickStats = [
  { label: "Bu Ay Video", value: "0 / 3", icon: "🎬", limit: true },
  { label: "Depolama", value: "0 / 500 MB", icon: "💾", limit: true },
  { label: "Bağlı Hesap", value: "0 / 1", icon: "🌐", limit: true },
  { label: "Toplam Yayın", value: "0", icon: "📤", limit: false },
];

export default function AppDashboard() {
  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hoş Geldiniz 👋</h1>
          <p className="text-sm text-slate-400 mt-1">İlk videonuzu oluşturmaya başlayın</p>
        </div>
        <Link
          href="/uygulama/video-olustur"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors"
        >
          + Yeni Video
        </Link>
      </div>

      {/* Upgrade banner */}
      <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-amber-400 font-bold">🚀 Ücretsiz Plan — 3 video/ay, 1 hesap</p>
          <p className="text-sm text-slate-400 mt-1">Başlangıç planına geçin: 20 video + 5 hesap + 5 GB</p>
        </div>
        <Link
          href="/fiyatlandirma"
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors ml-4"
        >
          Yükselt
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
            <span className="text-2xl block mb-2">{s.icon}</span>
            <div className="text-xl font-black text-white">{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Hızlı Başlangıç</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/uygulama/video-olustur" className="bg-[#1E293B] hover:bg-slate-700/70 border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-5 transition-all group">
            <span className="text-3xl block mb-3">🎬</span>
            <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">Video Oluştur</h3>
            <p className="text-xs text-slate-400 mt-1">Müzik + görsel ile video yapın</p>
          </Link>
          <Link href="/uygulama/sosyal-hesaplar" className="bg-[#1E293B] hover:bg-slate-700/70 border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-5 transition-all group">
            <span className="text-3xl block mb-3">🔗</span>
            <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">Hesap Bağla</h3>
            <p className="text-xs text-slate-400 mt-1">Sosyal medya hesaplarınızı bağlayın</p>
          </Link>
          <Link href="/uygulama/medya" className="bg-[#1E293B] hover:bg-slate-700/70 border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-5 transition-all group">
            <span className="text-3xl block mb-3">🎵</span>
            <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">Müzik Yükle</h3>
            <p className="text-xs text-slate-400 mt-1">MP3/WAV dosyalarınızı ekleyin</p>
          </Link>
        </div>
      </div>

      {/* Recent projects empty state */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Son Projeler</h2>
        <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 border-dashed p-12 text-center">
          <span className="text-5xl block mb-4">🎬</span>
          <p className="text-slate-300 font-semibold">Henüz proje yok</p>
          <p className="text-sm text-slate-500 mt-1 mb-5">İlk videonuzu oluşturun ve sosyal medyada paylaşın</p>
          <Link
            href="/uygulama/video-olustur"
            className="inline-flex px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors"
          >
            + İlk Videoyu Oluştur
          </Link>
        </div>
      </div>
    </div>
  );
}
