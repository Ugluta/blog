"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bir hata oluştu.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-black tracking-widest text-amber-400 uppercase">KURUMSAL</span>
          </Link>
          <p className="text-slate-400 text-sm mt-2">Şifrenizi sıfırlayın</p>
        </div>

        <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">E-posta Gönderildi</h2>
              <p className="text-slate-400 text-sm mb-6">
                <span className="text-amber-400 font-medium">{email}</span> adresine şifre
                sıfırlama bağlantısı gönderdik. Gelen kutunuzu kontrol edin.
              </p>
              <p className="text-slate-500 text-xs mb-6">
                E-posta birkaç dakika içinde gelmezse spam klasörünü kontrol edin.
              </p>
              <Link
                href="/giris"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl font-semibold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors"
              >
                Giriş Sayfasına Dön
              </Link>
            </div>
          ) : (
            <>
              <p className="text-slate-400 text-sm mb-6">
                Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
              </p>

              {error && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">E-posta</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="ornek@email.com"
                    className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-slate-900 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/giris" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
            ← Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </div>
  );
}
