import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sistem Logları | Admin" };

const MOCK_LOGS = [
  { id: 1, level: "info", message: "Scraper çalıştırıldı: techcrunch.com", source: "scraper", ts: "2026-06-17 14:32:11", detail: "12 makale bulundu, 8 yeni" },
  { id: 2, level: "info", message: "AI işleme tamamlandı", source: "ai", ts: "2026-06-17 14:30:05", detail: "8 makale GPT-4 ile yeniden yazıldı" },
  { id: 3, level: "success", message: "Sosyal medya yayını: Twitter/X", source: "publisher", ts: "2026-06-17 14:25:44", detail: "6 gönderi başarıyla yayınlandı" },
  { id: 4, level: "warning", message: "Yüksek bellek kullanımı", source: "system", ts: "2026-06-17 14:20:18", detail: "Worker süreci %85 RAM kullanıyor" },
  { id: 5, level: "error", message: "Instagram API token süresi doldu", source: "publisher", ts: "2026-06-17 14:15:02", detail: "Token yenilenmesi gerekiyor: /uygulama/sosyal-hesaplar" },
  { id: 6, level: "info", message: "Kullanıcı giriş yaptı", source: "auth", ts: "2026-06-17 13:58:30", detail: "admin@kurumsal.com — IP: 195.x.x.x" },
  { id: 7, level: "info", message: "Prisma migration uygulandı", source: "db", ts: "2026-06-17 12:00:00", detail: "Migration: add_site_settings" },
  { id: 8, level: "warning", message: "Rate limit uyarısı: OpenAI API", source: "ai", ts: "2026-06-17 11:45:20", detail: "Dakika başı 60 istek limitine yaklaşıldı" },
  { id: 9, level: "success", message: "Yedekleme tamamlandı", source: "system", ts: "2026-06-17 06:00:00", detail: "Günlük veritabanı yedeği başarıyla oluşturuldu" },
  { id: 10, level: "info", message: "Site ayarları güncellendi", source: "settings", ts: "2026-06-17 05:30:00", detail: "primary_color, font_heading değiştirildi" },
];

const LEVEL_STYLES: Record<string, string> = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
};

const SOURCE_ICONS: Record<string, string> = {
  scraper: "🕷️",
  ai: "🤖",
  publisher: "📤",
  system: "⚙️",
  auth: "🔐",
  db: "🗄️",
  settings: "🎨",
};

export default function LogsPage() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111111]">Sistem Logları</h1>
          <p className="text-sm text-[#666666] mt-1">Son 24 saatin aktivite kaydı</p>
        </div>
        <div className="flex gap-2">
          {["Tümü","Hata","Uyarı","Bilgi"].map((f) => (
            <button key={f} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E7E2D8] text-[#666666] hover:border-[#E7E2D8] hover:text-[#111111] transition-colors">
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto] gap-0 text-xs font-semibold text-[#666666] uppercase tracking-widest px-4 py-3 border-b border-[#E7E2D8]">
          <span className="w-20">Seviye</span>
          <span>Mesaj</span>
          <span className="w-36 text-right">Zaman</span>
        </div>
        <div className="divide-y divide-[#E7E2D8]">
          {MOCK_LOGS.map((log) => (
            <details key={log.id} className="group">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#EBF2FA] transition-colors list-none">
                <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase w-20 text-center ${LEVEL_STYLES[log.level]}`}>
                  {log.level}
                </span>
                <span className="text-xs mr-2">{SOURCE_ICONS[log.source] ?? "📋"}</span>
                <span className="flex-1 text-sm text-[#111111] truncate">{log.message}</span>
                <span className="flex-shrink-0 text-xs text-[#666666] font-mono">{log.ts}</span>
                <span className="text-[#666666] group-open:rotate-90 transition-transform ml-2">▶</span>
              </summary>
              <div className="px-4 pb-3 pt-1 bg-[#F8F6F1] text-xs text-[#666666] font-mono border-t border-[#E7E2D8]">
                {log.detail}
              </div>
            </details>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#666666] text-center">Son 10 kayıt gösteriliyor. Gerçek log sistemi için bir logging servisi entegrasyonu gerekir.</p>
    </div>
  );
}
