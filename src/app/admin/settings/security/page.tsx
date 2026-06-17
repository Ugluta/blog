"use client";

import { useState } from "react";

export default function SecurityPage() {
  const [saved, setSaved] = useState(false);
  const [s, setS] = useState({
    twoFactor: false,
    loginNotify: true,
    sessionTimeout: "60",
    maxLoginAttempts: "5",
    ipWhitelist: "",
    maintenanceMode: false,
    apiRateLimit: "100",
    requireEmailVerification: true,
  });

  const set = (k: keyof typeof s, v: boolean | string) =>
    setS((p) => ({ ...p, [k]: v }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white">Güvenlik Ayarları</h1>
        <p className="text-sm text-slate-400 mt-1">Oturum, erişim ve koruma seçenekleri</p>
      </div>

      {/* Auth */}
      <Card title="Kimlik Doğrulama">
        <Toggle label="İki Faktörlü Doğrulama (2FA)" desc="Tüm admin kullanıcıları için zorunlu hale getir" value={s.twoFactor} onChange={(v) => set("twoFactor", v)} />
        <Toggle label="Giriş bildirimi" desc="Yeni oturum açıldığında e-posta gönder" value={s.loginNotify} onChange={(v) => set("loginNotify", v)} />
        <Toggle label="E-posta doğrulaması zorunlu" desc="Kayıtta e-posta onayı iste" value={s.requireEmailVerification} onChange={(v) => set("requireEmailVerification", v)} />
      </Card>

      {/* Session */}
      <Card title="Oturum Yönetimi">
        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Oturum zaman aşımı (dakika)</label>
          <select
            value={s.sessionTimeout}
            onChange={(e) => set("sessionTimeout", e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          >
            {["15","30","60","120","240","480","1440"].map((v) => (
              <option key={v} value={v}>{v} dakika</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Maksimum hatalı giriş denemesi</label>
          <select
            value={s.maxLoginAttempts}
            onChange={(e) => set("maxLoginAttempts", e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          >
            {["3","5","10","20"].map((v) => (
              <option key={v} value={v}>{v} deneme</option>
            ))}
          </select>
        </div>
      </Card>

      {/* API */}
      <Card title="API Güvenliği">
        <div>
          <label className="block text-sm text-slate-300 mb-1.5">API Rate Limit (istek/dakika)</label>
          <input
            type="number"
            value={s.apiRateLimit}
            onChange={(e) => set("apiRateLimit", e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1.5">IP Beyaz Listesi</label>
          <textarea
            value={s.ipWhitelist}
            onChange={(e) => set("ipWhitelist", e.target.value)}
            rows={3}
            placeholder="Her satıra bir IP adresi (boş = herkese açık)"
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none font-mono placeholder:text-slate-500"
          />
        </div>
      </Card>

      {/* Maintenance */}
      <Card title="Site Durumu">
        <Toggle
          label="Bakım Modu"
          desc="Aktif olduğunda ziyaretçilere bakım mesajı gösterilir"
          value={s.maintenanceMode}
          onChange={(v) => set("maintenanceMode", v)}
          danger
        />
      </Card>

      <div className="flex items-center gap-3">
        <button onClick={save} className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors">
          Kaydet
        </button>
        {saved && <span className="text-xs text-green-400">✓ Kaydedildi</span>}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-4">
      <h2 className="text-sm font-semibold text-white border-b border-slate-700/50 pb-3">{title}</h2>
      {children}
    </div>
  );
}

function Toggle({ label, desc, value, onChange, danger }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void; danger?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={`text-sm font-medium ${danger ? "text-red-400" : "text-slate-200"}`}>{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
        <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <div className={`w-10 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${danger ? "peer-checked:bg-red-500" : "peer-checked:bg-amber-500"}`} />
      </label>
    </div>
  );
}
