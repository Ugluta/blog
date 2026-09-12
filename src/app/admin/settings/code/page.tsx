"use client";

import { useState, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const INPUT_CLS = "w-full bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]";
const TEXTAREA_CLS = `${INPUT_CLS} font-mono resize-y`;

const DANGEROUS_PATTERNS = [
  /document\.cookie/i,
  /localStorage\./i,
  /eval\s*\(/i,
  /window\.location\s*=/i,
  /fetch\s*\(/i,
  /XMLHttpRequest/i,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isDangerous(code: string): boolean {
  if (!code.includes("<script")) return false;
  return DANGEROUS_PATTERNS.some((re) => re.test(code));
}

// ─── Components ───────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? "bg-[#3A6EA8]" : "bg-[#E7E2D8]"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${enabled ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function CodeTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const danger = isDangerous(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-[#666666]">{label}</label>
        <span className="text-xs text-[#666666]">{value.length} karakter</span>
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={TEXTAREA_CLS}
      />
      {danger && (
        <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
          <span>⚠️</span>
          Bu kod potansiyel olarak tehlikeli kalıplar içeriyor. Yalnızca güvendiğiniz kodu ekleyin.
        </p>
      )}
    </div>
  );
}

function SectionSaveButton({ fields }: { fields: Record<string, string> }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex justify-end pt-2 border-t border-[#E7E2D8] mt-4">
      <button
        onClick={save}
        disabled={saving}
        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-500 text-white" : "bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white disabled:opacity-50"}`}
      >
        {saving ? "Kaydediliyor…" : saved ? "✓ Kaydedildi" : "Kaydet"}
      </button>
    </div>
  );
}

// ─── Analytics Item ───────────────────────────────────────────────────────────

function AnalyticsItem({
  label,
  idLabel,
  placeholder,
  value,
  enabled,
  onChange,
  onToggle,
}: {
  label: string;
  idLabel: string;
  placeholder: string;
  value: string;
  enabled: boolean;
  onChange: (v: string) => void;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#E7E2D8] last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-[#111111]">{label}</p>
        <div className="mt-2 flex items-center gap-2">
          <label className="text-xs text-[#666666] flex-shrink-0">{idLabel}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#3A6EA8]"
          />
        </div>
      </div>
      <Toggle enabled={enabled} onChange={onToggle} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CodeInjectionPage() {
  // Analytics
  const [ga4Id, setGa4Id] = useState("");
  const [ga4Enabled, setGa4Enabled] = useState(false);
  const [gtmId, setGtmId] = useState("");
  const [gtmEnabled, setGtmEnabled] = useState(false);
  const [metaPixelId, setMetaPixelId] = useState("");
  const [metaPixelEnabled, setMetaPixelEnabled] = useState(false);
  const [hotjarId, setHotjarId] = useState("");
  const [hotjarEnabled, setHotjarEnabled] = useState(false);

  // Code injection
  const [headStart, setHeadStart] = useState("");
  const [bodyStart, setBodyStart] = useState("");
  const [bodyEnd, setBodyEnd] = useState("");

  // Custom styles/js
  const [customCss, setCustomCss] = useState("");
  const [customJs, setCustomJs] = useState("");

  const sectionCls = "bg-[#FFFFFF] rounded-xl border border-[#E7E2D8] p-5 space-y-4";
  const sectionTitle = "text-sm font-bold uppercase tracking-wider text-[#444444]";

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-[#111111]">Kod Enjeksiyonu</h1>
        <p className="text-sm text-[#666666] mt-0.5">Analitik araçları ve özel kod parçacıkları</p>
      </div>

      {/* Analytics */}
      <section className={sectionCls}>
        <h2 className={sectionTitle}>Analitik Kodları</h2>
        <AnalyticsItem
          label="Google Analytics 4"
          idLabel="Measurement ID"
          placeholder="G-XXXXXXXXXX"
          value={ga4Id}
          enabled={ga4Enabled}
          onChange={setGa4Id}
          onToggle={setGa4Enabled}
        />
        <AnalyticsItem
          label="Google Tag Manager"
          idLabel="Container ID"
          placeholder="GTM-XXXXXXX"
          value={gtmId}
          enabled={gtmEnabled}
          onChange={setGtmId}
          onToggle={setGtmEnabled}
        />
        <AnalyticsItem
          label="Meta Pixel"
          idLabel="Pixel ID"
          placeholder="123456789012345"
          value={metaPixelId}
          enabled={metaPixelEnabled}
          onChange={setMetaPixelId}
          onToggle={setMetaPixelEnabled}
        />
        <AnalyticsItem
          label="Hotjar"
          idLabel="Site ID"
          placeholder="1234567"
          value={hotjarId}
          enabled={hotjarEnabled}
          onChange={setHotjarId}
          onToggle={setHotjarEnabled}
        />
        <SectionSaveButton
          fields={{
            GA4_MEASUREMENT_ID: ga4Id,
            GA4_ENABLED: String(ga4Enabled),
            GTM_CONTAINER_ID: gtmId,
            GTM_ENABLED: String(gtmEnabled),
            META_PIXEL_ID: metaPixelId,
            META_PIXEL_ENABLED: String(metaPixelEnabled),
            HOTJAR_SITE_ID: hotjarId,
            HOTJAR_ENABLED: String(hotjarEnabled),
          }}
        />
      </section>

      {/* Code Injection */}
      <section className={sectionCls}>
        <h2 className={sectionTitle}>Kod Enjeksiyonu</h2>
        <CodeTextarea
          label="<head> Başı Kodu"
          value={headStart}
          onChange={setHeadStart}
          placeholder="<!-- head etiketine eklenecek kodlar -->"
        />
        <CodeTextarea
          label="<body> Başı Kodu"
          value={bodyStart}
          onChange={setBodyStart}
          placeholder="<!-- body açılış etiketinden hemen sonra -->"
        />
        <CodeTextarea
          label="</body> Sonu Kodu"
          value={bodyEnd}
          onChange={setBodyEnd}
          placeholder="<!-- body kapanış etiketinden hemen önce -->"
        />
        <SectionSaveButton
          fields={{
            CODE_HEAD_START: headStart,
            CODE_BODY_START: bodyStart,
            CODE_BODY_END: bodyEnd,
          }}
        />
      </section>

      {/* Custom Styles / JS */}
      <section className={sectionCls}>
        <h2 className={sectionTitle}>Özel Stiller / JS</h2>
        <CodeTextarea
          label="Özel CSS"
          value={customCss}
          onChange={setCustomCss}
          placeholder="/* Özel CSS stilleriniz */"
          rows={8}
        />
        <CodeTextarea
          label="Özel JavaScript"
          value={customJs}
          onChange={setCustomJs}
          placeholder="// Özel JavaScript kodunuz"
          rows={8}
        />
        <SectionSaveButton
          fields={{
            CUSTOM_CSS: customCss,
            CUSTOM_JS: customJs,
          }}
        />
      </section>
    </div>
  );
}
