"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: "Zayıf", color: "bg-red-500", text: "text-red-400", width: "25%" };
    if (password.length < 8) return { label: "Orta", color: "bg-amber-500", text: "text-amber-400", width: "50%" };
    if (password.length < 12) return { label: "İyi", color: "bg-blue-500", text: "text-blue-400", width: "75%" };
    return { label: "Güçlü", color: "bg-emerald-500", text: "text-emerald-400", width: "100%" };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Şifre en az 8 karakter olmalıdır."); return; }
    if (password !== passwordConfirm) { setError("Şifreler eşleşmiyor."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bir hata oluştu.");
      } else {
        setDone(true);
        setTimeout(() => router.push("/giris"), 3000);
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
          <p className="text-slate-400 text-sm mt-2">Yeni şifrenizi belirleyin</p>
        </div>

        <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Şifreniz Güncellendi!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Yeni şifrenizle giriş yapabilirsiniz. Giriş sayfasına yönlendiriliyorsunuz...
              </p>
              <Link
                href="/giris"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl font-semibold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Yeni Şifre</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="En az 8 karakter"
                    className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                  />
                  {passwordStrength && (
                    <div className="mt-2">
                      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                      <p className={`text-[11px] mt-1 font-medium ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Şifre Tekrar</label>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    placeholder="Şifrenizi tekrar girin"
                    className={`w-full bg-slate-800 border text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                      passwordConfirm && password !== passwordConfirm
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-slate-900 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 transition-colors mt-2"
                >
                  {loading ? "Kaydediliyor..." : "Şifremi Güncelle"}
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
