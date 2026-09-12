import Link from "next/link";

export default function OdemeBasariliPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto">
          <span className="text-4xl">✓</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Ödeme Başarılı!</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Aboneliğiniz aktif edildi. Tüm premium özelliklere erişebilirsiniz.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-5 text-left space-y-3">
          {[
            "Video oluşturma kotanız yenilendi",
            "Sosyal hesap limitleriniz artırıldı",
            "Filigransız içerik üretebilirsiniz",
            "Öncelikli destek hattınız açıldı",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="text-emerald-400 text-sm font-bold">✓</span>
              <span className="text-slate-300 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/uygulama/video-olustur"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-colors text-center"
          >
            Video Oluşturmaya Başla
          </Link>
          <Link
            href="/uygulama/abonelik"
            className="w-full py-3 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors text-center border border-slate-700/50"
          >
            Abonelik Detayları
          </Link>
        </div>
      </div>
    </div>
  );
}
