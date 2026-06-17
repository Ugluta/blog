"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-red-500 mb-2">500</p>
        <h1 className="text-2xl font-bold text-white mb-3">Bir Şeyler Ters Gitti</h1>
        <p className="text-slate-400 mb-8">
          Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-colors"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl border border-slate-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-slate-700 text-xs font-mono">
            {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
