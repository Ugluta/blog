"use client";

import { useState } from "react";

// ─── Eye icon ─────────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────

const INPUT_CLS = "w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500";

function SecretInput({
  label,
  id,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || label}
          id={id}
          className={`${INPUT_CLS} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className={INPUT_CLS}
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={INPUT_CLS}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SectionSaveButton({ sectionKey, fields }: { sectionKey: string; fields: Record<string, string> }) {
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
    <div className="flex justify-end pt-2 border-t border-slate-700/30 mt-4">
      <button
        onClick={save}
        disabled={saving}
        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-500 text-white" : "bg-amber-500 hover:bg-amber-400 text-slate-900 disabled:opacity-50"}`}
        data-key={sectionKey}
      >
        {saving ? "Kaydediliyor…" : saved ? "✓ Kaydedildi" : "Kaydet"}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function APISettingsPage() {
  // Section 1: AI Sağlayıcılar
  const [openaiKey, setOpenaiKey] = useState("");
  const [openaiOrg, setOpenaiOrg] = useState("");
  const [openaiModel, setOpenaiModel] = useState("gpt-4o");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [anthropicModel, setAnthropicModel] = useState("claude-sonnet-4-6");
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("gemini-2.0-flash");
  const [grokKey, setGrokKey] = useState("");
  const [deepseekKey, setDeepseekKey] = useState("");

  // Section 2: Sosyal Medya OAuth
  const [twitterId, setTwitterId] = useState("");
  const [twitterSecret, setTwitterSecret] = useState("");
  const [metaAppId, setMetaAppId] = useState("");
  const [metaSecret, setMetaSecret] = useState("");
  const [linkedinId, setLinkedinId] = useState("");
  const [linkedinSecret, setLinkedinSecret] = useState("");
  const [tiktokKey, setTiktokKey] = useState("");
  const [tiktokSecret, setTiktokSecret] = useState("");
  const [googleOauthId, setGoogleOauthId] = useState("");
  const [googleOauthSecret, setGoogleOauthSecret] = useState("");
  const [pinterestId, setPinterestId] = useState("");
  const [pinterestSecret, setPinterestSecret] = useState("");
  const [redditId, setRedditId] = useState("");
  const [redditSecret, setRedditSecret] = useState("");

  // Section 3: Ödeme
  const [stripePublic, setStripePublic] = useState("");
  const [stripeSecret, setStripeSecret] = useState("");
  const [stripeWebhook, setStripeWebhook] = useState("");
  const [paytrMerchantId, setPaytrMerchantId] = useState("");
  const [paytrKey, setPaytrKey] = useState("");
  const [paytrSalt, setPaytrSalt] = useState("");
  const [iyzicoKey, setIyzicoKey] = useState("");
  const [iyzicoSecret, setIyzicoSecret] = useState("");
  const [iyzicoUrl, setIyzicoUrl] = useState("https://sandbox.iyzipay.com");

  // Section 4: Diğer Servisler
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFrom, setSmtpFrom] = useState("");
  const [recaptchaSite, setRecaptchaSite] = useState("");
  const [recaptchaSecret, setRecaptchaSecret] = useState("");
  const [cfZone, setCfZone] = useState("");
  const [cfToken, setCfToken] = useState("");
  const [s3Endpoint, setS3Endpoint] = useState("");
  const [s3Bucket, setS3Bucket] = useState("");
  const [s3Access, setS3Access] = useState("");
  const [s3Secret, setS3Secret] = useState("");
  const [s3Region, setS3Region] = useState("");

  const sectionCls = "bg-slate-800/40 rounded-xl border border-slate-700/50 p-5 space-y-4";
  const sectionTitle = "text-sm font-bold uppercase tracking-wider text-slate-300 mb-1";

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">API Ayarları</h1>
        <p className="text-sm text-slate-400 mt-0.5">Üçüncü taraf entegrasyon anahtarları</p>
      </div>

      {/* Section 1: AI */}
      <section className={sectionCls}>
        <h2 className={sectionTitle}>AI Sağlayıcılar</h2>

        <div className="border-b border-slate-700/30 pb-4">
          <p className="text-xs font-semibold text-slate-400 mb-3">🟢 OpenAI</p>
          <div className="space-y-3">
            <SecretInput label="API Key" id="openai-key" value={openaiKey} onChange={setOpenaiKey} placeholder="sk-..." />
            <TextInput label="Organization ID" value={openaiOrg} onChange={setOpenaiOrg} placeholder="org-..." />
            <SelectInput label="Default Model" value={openaiModel} onChange={setOpenaiModel} options={["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"]} />
          </div>
        </div>

        <div className="border-b border-slate-700/30 pb-4">
          <p className="text-xs font-semibold text-slate-400 mb-3">🟠 Anthropic Claude</p>
          <div className="space-y-3">
            <SecretInput label="API Key" id="anthropic-key" value={anthropicKey} onChange={setAnthropicKey} placeholder="sk-ant-..." />
            <SelectInput label="Default Model" value={anthropicModel} onChange={setAnthropicModel} options={["claude-opus-4-8", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"]} />
          </div>
        </div>

        <div className="border-b border-slate-700/30 pb-4">
          <p className="text-xs font-semibold text-slate-400 mb-3">🔵 Google Gemini</p>
          <div className="space-y-3">
            <SecretInput label="API Key" id="gemini-key" value={geminiKey} onChange={setGeminiKey} placeholder="AIza..." />
            <SelectInput label="Model" value={geminiModel} onChange={setGeminiModel} options={["gemini-2.0-flash", "gemini-1.5-pro"]} />
          </div>
        </div>

        <div className="border-b border-slate-700/30 pb-4">
          <p className="text-xs font-semibold text-slate-400 mb-3">⚫ Grok (xAI)</p>
          <SecretInput label="API Key" id="grok-key" value={grokKey} onChange={setGrokKey} placeholder="xai-..." />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 mb-3">🟣 DeepSeek</p>
          <SecretInput label="API Key" id="deepseek-key" value={deepseekKey} onChange={setDeepseekKey} placeholder="sk-..." />
        </div>

        <SectionSaveButton
          sectionKey="ai"
          fields={{
            OPENAI_API_KEY: openaiKey,
            OPENAI_ORG_ID: openaiOrg,
            OPENAI_DEFAULT_MODEL: openaiModel,
            ANTHROPIC_API_KEY: anthropicKey,
            ANTHROPIC_DEFAULT_MODEL: anthropicModel,
            GEMINI_API_KEY: geminiKey,
            GEMINI_DEFAULT_MODEL: geminiModel,
            GROK_API_KEY: grokKey,
            DEEPSEEK_API_KEY: deepseekKey,
          }}
        />
      </section>

      {/* Section 2: Social OAuth */}
      <section className={sectionCls}>
        <h2 className={sectionTitle}>Sosyal Medya OAuth</h2>

        {[
          { label: "Twitter/X", id1: twitterId, set1: setTwitterId, id2: twitterSecret, set2: setTwitterSecret, l1: "Client ID", l2: "Client Secret" },
          { label: "Meta (Instagram/Facebook)", id1: metaAppId, set1: setMetaAppId, id2: metaSecret, set2: setMetaSecret, l1: "App ID", l2: "App Secret" },
          { label: "LinkedIn", id1: linkedinId, set1: setLinkedinId, id2: linkedinSecret, set2: setLinkedinSecret, l1: "Client ID", l2: "Client Secret" },
          { label: "TikTok", id1: tiktokKey, set1: setTiktokKey, id2: tiktokSecret, set2: setTiktokSecret, l1: "Client Key", l2: "Client Secret" },
          { label: "Google OAuth (YouTube)", id1: googleOauthId, set1: setGoogleOauthId, id2: googleOauthSecret, set2: setGoogleOauthSecret, l1: "Client ID", l2: "Client Secret" },
          { label: "Pinterest", id1: pinterestId, set1: setPinterestId, id2: pinterestSecret, set2: setPinterestSecret, l1: "App ID", l2: "App Secret" },
          { label: "Reddit", id1: redditId, set1: setRedditId, id2: redditSecret, set2: setRedditSecret, l1: "Client ID", l2: "Client Secret" },
        ].map(({ label, id1, set1, id2, set2, l1, l2 }) => (
          <div key={label} className="border-b border-slate-700/30 pb-4 last:border-0 last:pb-0">
            <p className="text-xs font-semibold text-slate-400 mb-3">{label}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextInput label={l1} value={id1} onChange={set1} />
              <SecretInput label={l2} id={`${label}-secret`} value={id2} onChange={set2} />
            </div>
          </div>
        ))}

        <SectionSaveButton
          sectionKey="social"
          fields={{
            TWITTER_CLIENT_ID: twitterId,
            TWITTER_CLIENT_SECRET: twitterSecret,
            META_APP_ID: metaAppId,
            META_APP_SECRET: metaSecret,
            LINKEDIN_CLIENT_ID: linkedinId,
            LINKEDIN_CLIENT_SECRET: linkedinSecret,
            TIKTOK_CLIENT_KEY: tiktokKey,
            TIKTOK_CLIENT_SECRET: tiktokSecret,
            GOOGLE_OAUTH_CLIENT_ID: googleOauthId,
            GOOGLE_OAUTH_CLIENT_SECRET: googleOauthSecret,
            PINTEREST_APP_ID: pinterestId,
            PINTEREST_APP_SECRET: pinterestSecret,
            REDDIT_CLIENT_ID: redditId,
            REDDIT_CLIENT_SECRET: redditSecret,
          }}
        />
      </section>

      {/* Section 3: Ödeme */}
      <section className={sectionCls}>
        <h2 className={sectionTitle}>Ödeme</h2>

        <div className="border-b border-slate-700/30 pb-4">
          <p className="text-xs font-semibold text-slate-400 mb-3">Stripe</p>
          <div className="space-y-3">
            <TextInput label="Publishable Key" value={stripePublic} onChange={setStripePublic} placeholder="pk_..." />
            <SecretInput label="Secret Key" id="stripe-secret" value={stripeSecret} onChange={setStripeSecret} placeholder="sk_..." />
            <SecretInput label="Webhook Secret" id="stripe-webhook" value={stripeWebhook} onChange={setStripeWebhook} placeholder="whsec_..." />
          </div>
        </div>

        <div className="border-b border-slate-700/30 pb-4">
          <p className="text-xs font-semibold text-slate-400 mb-3">PayTR</p>
          <div className="space-y-3">
            <TextInput label="Merchant ID" value={paytrMerchantId} onChange={setPaytrMerchantId} />
            <SecretInput label="Merchant Key" id="paytr-key" value={paytrKey} onChange={setPaytrKey} />
            <SecretInput label="Merchant Salt" id="paytr-salt" value={paytrSalt} onChange={setPaytrSalt} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 mb-3">İyzico</p>
          <div className="space-y-3">
            <SecretInput label="API Key" id="iyzico-key" value={iyzicoKey} onChange={setIyzicoKey} />
            <SecretInput label="Secret Key" id="iyzico-secret" value={iyzicoSecret} onChange={setIyzicoSecret} />
            <TextInput label="Base URL" value={iyzicoUrl} onChange={setIyzicoUrl} placeholder="https://sandbox.iyzipay.com" />
          </div>
        </div>

        <SectionSaveButton
          sectionKey="payment"
          fields={{
            STRIPE_PUBLISHABLE_KEY: stripePublic,
            STRIPE_SECRET_KEY: stripeSecret,
            STRIPE_WEBHOOK_SECRET: stripeWebhook,
            PAYTR_MERCHANT_ID: paytrMerchantId,
            PAYTR_MERCHANT_KEY: paytrKey,
            PAYTR_MERCHANT_SALT: paytrSalt,
            IYZICO_API_KEY: iyzicoKey,
            IYZICO_SECRET_KEY: iyzicoSecret,
            IYZICO_BASE_URL: iyzicoUrl,
          }}
        />
      </section>

      {/* Section 4: Diğer Servisler */}
      <section className={sectionCls}>
        <h2 className={sectionTitle}>Diğer Servisler</h2>

        <div className="border-b border-slate-700/30 pb-4">
          <p className="text-xs font-semibold text-slate-400 mb-3">SMTP</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput label="Host" value={smtpHost} onChange={setSmtpHost} placeholder="smtp.example.com" />
            <TextInput label="Port" value={smtpPort} onChange={setSmtpPort} placeholder="587" />
            <TextInput label="Kullanıcı" value={smtpUser} onChange={setSmtpUser} placeholder="user@example.com" />
            <SecretInput label="Şifre" id="smtp-pass" value={smtpPass} onChange={setSmtpPass} />
            <div className="sm:col-span-2">
              <TextInput label="From Name" value={smtpFrom} onChange={setSmtpFrom} placeholder="Site Adı" />
            </div>
          </div>
        </div>

        <div className="border-b border-slate-700/30 pb-4">
          <p className="text-xs font-semibold text-slate-400 mb-3">Google reCAPTCHA v3</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput label="Site Key" value={recaptchaSite} onChange={setRecaptchaSite} />
            <SecretInput label="Secret Key" id="recaptcha-secret" value={recaptchaSecret} onChange={setRecaptchaSecret} />
          </div>
        </div>

        <div className="border-b border-slate-700/30 pb-4">
          <p className="text-xs font-semibold text-slate-400 mb-3">Cloudflare</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput label="Zone ID" value={cfZone} onChange={setCfZone} />
            <SecretInput label="API Token" id="cf-token" value={cfToken} onChange={setCfToken} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 mb-3">S3 / Depolama</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput label="Endpoint" value={s3Endpoint} onChange={setS3Endpoint} placeholder="https://s3.amazonaws.com" />
            <TextInput label="Bucket" value={s3Bucket} onChange={setS3Bucket} />
            <TextInput label="Access Key" value={s3Access} onChange={setS3Access} />
            <SecretInput label="Secret Key" id="s3-secret" value={s3Secret} onChange={setS3Secret} />
            <div className="sm:col-span-2">
              <TextInput label="Region" value={s3Region} onChange={setS3Region} placeholder="us-east-1" />
            </div>
          </div>
        </div>

        <SectionSaveButton
          sectionKey="other"
          fields={{
            SMTP_HOST: smtpHost,
            SMTP_PORT: smtpPort,
            SMTP_USER: smtpUser,
            SMTP_PASS: smtpPass,
            SMTP_FROM_NAME: smtpFrom,
            RECAPTCHA_SITE_KEY: recaptchaSite,
            RECAPTCHA_SECRET_KEY: recaptchaSecret,
            CF_ZONE_ID: cfZone,
            CF_API_TOKEN: cfToken,
            S3_ENDPOINT: s3Endpoint,
            S3_BUCKET: s3Bucket,
            S3_ACCESS_KEY: s3Access,
            S3_SECRET_KEY: s3Secret,
            S3_REGION: s3Region,
          }}
        />
      </section>
    </div>
  );
}
