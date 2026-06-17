"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Şifre en az 8 karakter olmalıdır."); return; }
    if (password !== passwordConfirm) { setError("Şifreler eşleşmiyor."); return; }
    if (!agreed) { setError("Kullanım şartlarını kabul etmelisiniz."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setDone(true);
  };

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: "Zayıf", color: "bg-red-500", width: "25%" };
    if (password.length < 8) return { label: "Orta", color: "bg-amber-500", width: "50%" };
    if (password.length < 12) return { label: "İyi", color: "bg-blue-500", width: "75%" };
    return { label: "Güçlü", color: "bg-emerald-500", width: "100%" };
  })();

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-black tracking-widest text-amber-400 uppercase">KURUMSAL</span>
          </Link>
          <p className="text-slate-400 text-sm mt-2">Ücretsiz hesap oluşturun</p>
        </div>

        {done ? (
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Hesabınız Oluşturuldu!</h2>
            <p className="text-slate-400 text-sm mb-6">
              <span className="text-amber-400 font-medium">{email}</span> adresine doğrulama
              bağlantısı gönderildi.
            </p>
            <Link
              href="/giris"
              className="inline-flex items-center justify-center w-full py-3 rounded-xl font-semibold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        ) : (
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step >= s
                        ? "bg-amber-500 text-slate-900"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {step > s ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s}
                  </div>
                  <span className={`text-xs font-medium ${step >= s ? "text-amber-400" : "text-slate-500"}`}>
                    {s === 1 ? "Bilgiler" : "Şifre"}
                  </span>
                  {s < 2 && <div className={`flex-1 h-px ${step > s ? "bg-amber-500/50" : "bg-slate-700"}`} />}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Ad Soyad</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                  />
                </div>
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
                  className="w-full py-3 rounded-xl font-semibold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors mt-2"
                >
                  Devam Et →
                </button>
              </form>
            ) : (
              <form onSubmit={handleStep2} className="space-y-4">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors mb-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {email}
                </button>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Şifre</label>
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
                      <p className={`text-[11px] mt-1 font-medium ${
                        passwordStrength.color.includes("red") ? "text-red-400" :
                        passwordStrength.color.includes("amber") ? "text-amber-400" :
                        passwordStrength.color.includes("blue") ? "text-blue-400" : "text-emerald-400"
                      }`}>{passwordStrength.label}</p>
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
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      agreed ? "bg-amber-500 border-amber-500" : "border-slate-500 group-hover:border-amber-500/60"
                    }`}
                    onClick={() => setAgreed(!agreed)}
                  >
                    {agreed && (
                      <svg className="w-2.5 h-2.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 leading-relaxed">
                    <Link href="/kullanim-sartlari" className="text-amber-400 hover:underline">Kullanım Şartları</Link> ve{" "}
                    <Link href="/gizlilik-politikasi" className="text-amber-400 hover:underline">Gizlilik Politikası</Link>'nı
                    okudum ve kabul ediyorum.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-slate-900 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 transition-colors mt-2"
                >
                  {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
                </button>
              </form>
            )}

            {!done && step === 1 && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs text-slate-500">
                    <span className="bg-[#1E293B] px-3">veya</span>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-medium transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google ile Kayıt Ol
                </button>
              </>
            )}
          </div>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
