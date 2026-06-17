import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-amber-500 mb-2">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Sayfa Bulunamadı</h1>
        <p className="text-slate-400 mb-8">
          Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/haberler"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl border border-slate-700 transition-colors"
          >
            Haberlere Bak
          </Link>
        </div>
        <div className="mt-12 text-slate-700 text-xs font-mono">
          ERR_PAGE_NOT_FOUND
        </div>
      </div>
    </div>
  );
}
