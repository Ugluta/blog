import Link from "next/link";

const stats = [
  { label: "Toplam Makale", value: "1,247", change: "+12 bu hafta", icon: "📰", color: "text-blue-700" },
  { label: "Aktif Kaynak", value: "34", change: "8 kuyrukta", icon: "🕷️", color: "text-green-700" },
  { label: "Yayın Kuyruğu", value: "18", change: "5 zamanlandı", icon: "📤", color: "text-[#3A6EA8]" },
  { label: "Aylık Görüntülenme", value: "842K", change: "+23% geçen ay", icon: "👁️", color: "text-purple-700" },
];

const quickActions = [
  { label: "Yeni Makale", href: "/admin/content/new", icon: "✏️", desc: "Manuel içerik ekle" },
  { label: "Scraper Çalıştır", href: "/admin/scraper", icon: "🕷️", desc: "Kaynak sitelerden çek" },
  { label: "Reklam Ayarları", href: "/admin/settings/ads", icon: "📢", desc: "Zone yönetimi" },
  { label: "Menü Düzenle", href: "/admin/menus/header", icon: "☰", desc: "Header navigasyon" },
  { label: "AI İşlemci", href: "/admin/settings/ai", icon: "🤖", desc: "Sağlayıcı seç & ayarla" },
  { label: "Sosyal Yayın", href: "/admin/publisher", icon: "🌐", desc: "Platform bağlantıları" },
];

const recentJobs = [
  { type: "scrape", source: "techcrunch.com", status: "success", time: "2 dk önce", count: "12 makale" },
  { type: "ai", source: "GPT-4 işleme", status: "success", time: "5 dk önce", count: "8 yeniden yazıldı" },
  { type: "publish", source: "Twitter/X", status: "success", time: "10 dk önce", count: "6 paylaşım" },
  { type: "scrape", source: "bbc.com/turkce", status: "pending", time: "15 dk önce", count: "kuyrukta" },
  { type: "publish", source: "Instagram", status: "error", time: "22 dk önce", count: "token hatası" },
];

const statusColors = {
  success: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111111] font-inter">Dashboard</h1>
        <p className="text-sm text-[#666666] mt-1">Hoş geldiniz. Sistem durumu normal.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#FFFFFF] rounded-xl p-4 border border-[#E7E2D8]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs text-[#666666] bg-[#EBF2FA] px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <div className={`text-2xl font-black font-inter ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[#666666] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#666666] mb-3">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-[#FFFFFF] hover:bg-[#EBF2FA] border border-[#E7E2D8] hover:border-[#3A6EA8]/50 rounded-xl p-4 transition-all group text-center"
            >
              <span className="text-2xl block mb-2">{action.icon}</span>
              <span className="text-xs font-semibold text-[#111111] group-hover:text-[#3A6EA8] transition-colors block">{action.label}</span>
              <span className="text-[10px] text-[#666666] mt-1 block">{action.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Jobs + Settings Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Recent Jobs */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E7E2D8]">
          <div className="px-5 py-4 border-b border-[#E7E2D8]">
            <h2 className="text-sm font-bold text-[#111111]">Son İşlemler</h2>
          </div>
          <div className="divide-y divide-[#E7E2D8]">
            {recentJobs.map((job, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {job.type === "scrape" ? "🕷️" : job.type === "ai" ? "🤖" : "📤"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#111111]">{job.source}</p>
                    <p className="text-xs text-[#666666]">{job.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-xs text-[#666666]">{job.count}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[job.status as keyof typeof statusColors]}`}>
                    {job.status === "success" ? "✓ Başarılı" : job.status === "pending" ? "⏳ Bekliyor" : "✗ Hata"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Shortcuts */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E7E2D8]">
          <div className="px-5 py-4 border-b border-[#E7E2D8]">
            <h2 className="text-sm font-bold text-[#111111]">Ayarlar</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { href: "/admin/settings/general", label: "Genel Ayarlar", icon: "⚙️" },
              { href: "/admin/settings/appearance", label: "Görünüm & Renkler", icon: "🎨" },
              { href: "/admin/settings/ads", label: "Reklam Yönetimi", icon: "📢" },
              { href: "/admin/settings/seo", label: "SEO Ayarları", icon: "🔍" },
              { href: "/admin/settings/ai", label: "AI Sağlayıcılar", icon: "🤖" },
              { href: "/admin/settings/social", label: "Sosyal Medya", icon: "🌐" },
              { href: "/admin/settings/performance", label: "Performans", icon: "⚡" },
              { href: "/admin/menus/header", label: "Menü Yönetimi", icon: "☰" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#EBF2FA] transition-colors group"
              >
                <span>{item.icon}</span>
                <span className="text-sm text-[#444444] group-hover:text-[#3A6EA8] transition-colors">{item.label}</span>
                <svg className="w-3.5 h-3.5 text-[#666666] ml-auto group-hover:text-[#3A6EA8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
