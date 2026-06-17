"use client";

import { useState } from "react";

const AI_PROVIDERS = [
  { id: "claude", name: "Claude (Anthropic)", models: ["claude-opus-4-8", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"], icon: "🟠", color: "text-orange-400" },
  { id: "gemini", name: "Gemini (Google)", models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"], icon: "🔵", color: "text-blue-400" },
  { id: "grok", name: "Grok (xAI)", models: ["grok-2", "grok-beta"], icon: "⚫", color: "text-slate-300" },
  { id: "deepseek", name: "DeepSeek", models: ["deepseek-chat", "deepseek-reasoner"], icon: "🟣", color: "text-purple-400" },
  { id: "openai", name: "OpenAI / Copilot", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"], icon: "🟢", color: "text-green-400" },
];

const TASK_CONFIGS = [
  { id: "rewrite", label: "İçerik Yeniden Yazma", desc: "Çekilen içerikleri özgün hale getir" },
  { id: "seo", label: "SEO Meta Oluşturma", desc: "Title, description, keywords üret" },
  { id: "summary", label: "Özet Çıkarma", desc: "Uzun içerikleri özetle" },
  { id: "categorize", label: "Otomatik Kategorileme", desc: "İçeriği doğru kategoriye ata" },
  { id: "video_script", label: "Video Senaryosu", desc: "Makale → video scripti dönüştür" },
  { id: "social_caption", label: "Sosyal Medya Başlıkları", desc: "Platform'a özel caption oluştur" },
];

export default function AISettings() {
  const [activeProvider, setActiveProvider] = useState("claude");
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [models, setModels] = useState<Record<string, string>>({
    claude: "claude-sonnet-4-6",
    gemini: "gemini-2.0-flash",
    grok: "grok-2",
    deepseek: "deepseek-chat",
    openai: "gpt-4o",
  });
  const [taskProviders, setTaskProviders] = useState<Record<string, string>>({
    rewrite: "claude",
    seo: "claude",
    summary: "gemini",
    categorize: "gemini",
    video_script: "claude",
    social_caption: "openai",
  });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">AI Sağlayıcılar</h1>
          <p className="text-sm text-slate-400 mt-0.5">API anahtarları ve görev başına sağlayıcı ataması</p>
        </div>
        <button onClick={save} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-500 text-white" : "bg-amber-500 hover:bg-amber-400 text-slate-900"}`}>
          {saved ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {/* Default Provider */}
      <section className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Varsayılan Sağlayıcı</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {AI_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProvider(p.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                activeProvider === p.id
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-slate-600 hover:border-slate-500 bg-slate-800/50"
              }`}
            >
              <span className="text-2xl block mb-1">{p.icon}</span>
              <span className={`text-[11px] font-semibold ${activeProvider === p.id ? "text-amber-400" : "text-slate-400"}`}>
                {p.name.split(" (")[0]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* API Keys */}
      <section className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">API Anahtarları & Model Seçimi</h2>
        {AI_PROVIDERS.map((p) => (
          <div key={p.id} className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3 pb-4 border-b border-slate-700/30 last:border-0 last:pb-0">
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                <span>{p.icon}</span>
                <span className={p.color}>{p.name}</span>
                <span>— API Key</span>
              </label>
              <input
                type="password"
                value={apiKeys[p.id] || ""}
                onChange={(e) => setApiKeys({ ...apiKeys, [p.id]: e.target.value })}
                placeholder={`${p.name} API anahtarı`}
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-500 placeholder-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Model</label>
              <select
                value={models[p.id]}
                onChange={(e) => setModels({ ...models, [p.id]: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
              >
                {p.models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </section>

      {/* Task → Provider mapping */}
      <section className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-5 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Görev Başına Sağlayıcı</h2>
        <p className="text-xs text-slate-500">Her AI görevi için hangi sağlayıcı kullanılsın?</p>
        {TASK_CONFIGS.map((task) => (
          <div key={task.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
            <div>
              <p className="text-sm text-slate-200">{task.label}</p>
              <p className="text-xs text-slate-500">{task.desc}</p>
            </div>
            <select
              value={taskProviders[task.id]}
              onChange={(e) => setTaskProviders({ ...taskProviders, [task.id]: e.target.value })}
              className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 min-w-[130px]"
            >
              {AI_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>{p.icon} {p.name.split(" (")[0]}</option>
              ))}
            </select>
          </div>
        ))}
      </section>
    </div>
  );
}
