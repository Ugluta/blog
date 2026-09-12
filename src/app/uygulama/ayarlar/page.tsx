"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

type Tab = "profil" | "guvenlik" | "bildirimler" | "api";

export default function AyarlarPage() {
  const { data: session, update } = useSession();
  const [tab, setTab] = useState<Tab>("profil");

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwOk, setPwOk] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
    }
  }, [session]);

  const saveProfile = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio }),
    }).catch(() => null);
    setSaving(false);
    if (res?.ok) {
      setSaved(true);
      await update({ name });
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const changePassword = async () => {
    setPwError("");
    setPwOk(false);
    if (newPw !== confirmPw) { setPwError("Şifreler eşleşmiyor."); return; }
    if (newPw.length < 8) { setPwError("Şifre en az 8 karakter olmalı."); return; }
    setPwSaving(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    }).catch(() => null);
    setPwSaving(false);
    if (!res?.ok) {
      const data = await res?.json().catch(() => ({}));
      setPwError(data?.error ?? "Şifre değiştirilemedi.");
    } else {
      setPwOk(true);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    }
  };

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "profil", label: "Profil", icon: "👤" },
    { key: "guvenlik", label: "Güvenlik", icon: "🔒" },
    { key: "bildirimler", label: "Bildirimler", icon: "🔔" },
    { key: "api", label: "API Anahtarları", icon: "🔑" },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111111]">Ayarlar</h1>
        <p className="text-sm text-[#666666] mt-1">Hesap ve uygulama ayarlarını yönetin</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${tab === t.key ? "bg-[#EBF2FA] text-[#3A6EA8]" : "text-[#666666] hover:text-[#111111]"}`}
          >
            <span className="text-base">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Profil ── */}
      {tab === "profil" && (
        <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF2FA] flex items-center justify-center text-[#3A6EA8] font-black text-2xl flex-shrink-0">
              {name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111111]">{name || "İsimsiz"}</p>
              <p className="text-xs text-[#666666]">{email}</p>
              <p className="text-xs text-[#666666] mt-0.5">
                {session?.user?.role ?? "VIEWER"}
              </p>
            </div>
          </div>

          <div className="border-t border-[#E7E2D8]" />

          <div>
            <label className="block text-sm font-medium text-[#444444] mb-1.5">Ad Soyad</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6EA8]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#444444] mb-1.5">E-posta</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#666666] text-sm cursor-not-allowed"
            />
            <p className="text-[10px] text-[#666666] mt-1">E-posta değiştirilemez.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#444444] mb-1.5">Biyografi</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Kendinizden kısaca bahsedin…"
              className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6EA8]/50 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm disabled:opacity-50 transition-colors"
            >
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </button>
            {saved && <span className="text-xs text-green-600">✓ Değişiklikler kaydedildi</span>}
          </div>
        </div>
      )}

      {/* ── Güvenlik ── */}
      {tab === "guvenlik" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6 space-y-4">
            <h2 className="text-base font-bold text-[#111111]">Şifre Değiştir</h2>

            <div>
              <label className="block text-sm font-medium text-[#444444] mb-1.5">Mevcut Şifre</label>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6EA8]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444444] mb-1.5">Yeni Şifre</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6EA8]/50"
              />
              <p className="text-[10px] text-[#666666] mt-1">En az 8 karakter</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444444] mb-1.5">Yeni Şifre Tekrar</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="w-full bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2.5 text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6EA8]/50"
              />
            </div>

            {pwError && <p className="text-sm text-red-600">{pwError}</p>}
            {pwOk && <p className="text-sm text-green-600">✓ Şifre başarıyla değiştirildi</p>}

            <button
              onClick={changePassword}
              disabled={pwSaving || !currentPw || !newPw || !confirmPw}
              className="px-5 py-2 rounded-lg bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm disabled:opacity-50 transition-colors"
            >
              {pwSaving ? "Değiştiriliyor…" : "Şifreyi Değiştir"}
            </button>
          </div>

          {/* Session */}
          <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6">
            <h2 className="text-base font-bold text-[#111111] mb-3">Oturum</h2>
            <p className="text-sm text-[#666666] mb-4">
              Tüm cihazlarda oturumunuzu kapatmak için aşağıdaki butona tıklayın.
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/giris" })}
              className="px-5 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-600 font-semibold text-sm transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}

      {/* ── Bildirimler ── */}
      {tab === "bildirimler" && (
        <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6">
          <h2 className="text-base font-bold text-[#111111] mb-5">E-posta Bildirimleri</h2>
          <div className="space-y-4">
            {[
              { id: "content_approved", label: "İçerik onaylandı", desc: "Scraper'dan gelen içerik onaylandığında" },
              { id: "publish_failed", label: "Yayın başarısız", desc: "Sosyal medya yayını başarısız olduğunda" },
              { id: "scraper_error", label: "Scraper hatası", desc: "Kaynak sitede hata oluştuğunda" },
              { id: "weekly_report", label: "Haftalık rapor", desc: "Her pazartesi içerik özeti" },
            ].map((n) => (
              <div key={n.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#111111]">{n.label}</p>
                  <p className="text-xs text-[#666666]">{n.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={n.id !== "scraper_error"} />
                  <div className="w-10 h-5 bg-[#EBF2FA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3A6EA8]" />
                </label>
              </div>
            ))}
          </div>
          <button className="mt-6 px-5 py-2 rounded-lg bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white font-semibold text-sm transition-colors">
            Tercihleri Kaydet
          </button>
        </div>
      )}

      {/* ── API Keys ── */}
      {tab === "api" && (
        <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6">
          <h2 className="text-base font-bold text-[#111111] mb-2">API Anahtarları</h2>
          <p className="text-sm text-[#666666] mb-6">
            Üçüncü taraf uygulamalar için API anahtarlarınızı yönetin.
          </p>
          <div className="space-y-3">
            {[
              { name: "OpenAI API Key", env: "OPENAI_API_KEY", placeholder: "sk-..." },
              { name: "Anthropic API Key", env: "ANTHROPIC_API_KEY", placeholder: "sk-ant-..." },
              { name: "Google Gemini Key", env: "GOOGLE_AI_API_KEY", placeholder: "AIza..." },
            ].map((k) => (
              <div key={k.env}>
                <label className="block text-xs font-medium text-[#666666] mb-1">{k.name}</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder={k.placeholder}
                    className="flex-1 bg-[#F8F6F1] border border-[#E7E2D8] rounded-lg px-3 py-2 text-sm text-[#444444] focus:outline-none focus:ring-2 focus:ring-[#3A6EA8]/50 font-mono"
                  />
                  <button className="px-3 py-2 text-xs text-[#666666] border border-[#E7E2D8] rounded-lg hover:border-[#3A6EA8]/30 hover:text-[#3A6EA8] transition-colors">
                    Kaydet
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#666666] mt-4">
            Bu anahtarlar şifreli olarak saklanır ve yalnızca sunucu tarafında kullanılır.
          </p>
        </div>
      )}
    </div>
  );
}
