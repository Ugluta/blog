import Link from "next/link";

export default function OdemeIptalPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mx-auto">
          <span className="text-4xl">↩</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Ödeme İptal Edildi</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Ödeme işlemi tamamlanmadı. Hesabınızda herhangi bir ücret alınmadı.
          </p>
        </div>

        <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-5 text-left">
          <p className="text-slate-300 text-sm font-semibold mb-3">Sorun mu yaşadınız?</p>
          <div className="space-y-2 text-xs text-slate-500">
            <p>• Kart bilgilerinizin doğru girildiğinden emin olun</p>
            <p>• 3D Secure onayını tamamladığınızdan emin olun</p>
            <p>• Farklı bir ödeme yöntemi deneyebilirsiniz</p>
            <p>• Sorun devam ederse destek hattımızla iletişime geçin</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/uygulama/abonelik"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-colors text-center"
          >
            Tekrar Dene
          </Link>
          <Link
            href="/uygulama"
            className="w-full py-3 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors text-center border border-slate-700/50"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
