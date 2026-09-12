"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = (await res.json()) as { error?: string };
        setErrorMsg(data.error ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStatus("error");
    }
  };

  return (
    <section
      className="py-12"
      style={{
        backgroundColor: "#0F172A",
        borderTop: "1px solid rgba(51,65,85,0.4)",
        borderBottom: "1px solid rgba(51,65,85,0.4)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center">
          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Haftalık Bülten
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Platform güncellemeleri ve en iyi içerikleri haftada bir e-postanıza getiriyoruz.
          </p>

          {status === "success" ? (
            <div className="max-w-md mx-auto">
              <div
                className="flex items-center gap-3 px-5 py-4 text-sm text-emerald-400"
                style={{
                  backgroundColor: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: "2px",
                }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Harika! Bültene başarıyla abone oldunuz.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  required
                  disabled={status === "loading"}
                  className="flex-1 bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 disabled:opacity-60 transition-colors"
                  style={{ borderRadius: "2px" }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ backgroundColor: "#F59E0B", borderRadius: "2px" }}
                >
                  {status === "loading" ? "Gönderiliyor..." : "Abone Ol"}
                </button>
              </div>

              {status === "error" && (
                <p className="mt-2 text-xs text-red-400 text-left">{errorMsg}</p>
              )}

              <p className="mt-3 text-[11px] text-slate-500">
                Gizliliğinize saygı duyuyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
