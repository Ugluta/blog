"use client";

import { useState } from "react";

type AspectRatio = "9:16" | "1:1" | "16:9" | "4:5";
type Scene = { id: string; imageUrl: string; text: string; duration: number };

const RATIOS: { id: AspectRatio; label: string; icon: string; desc: string }[] = [
  { id: "9:16", label: "Dikey", icon: "📱", desc: "TikTok, Reels, Shorts" },
  { id: "1:1", label: "Kare", icon: "⬜", desc: "Instagram Feed" },
  { id: "16:9", label: "Yatay", icon: "🖥️", desc: "YouTube" },
  { id: "4:5", label: "Portre", icon: "🖼️", desc: "Instagram Portre" },
];

const PLATFORMS = [
  { id: "tiktok", label: "TikTok", icon: "🎵", connected: false },
  { id: "instagram", label: "Instagram", icon: "📷", connected: false },
  { id: "youtube", label: "YouTube Shorts", icon: "▶️", connected: false },
  { id: "twitter", label: "Twitter/X", icon: "🐦", connected: false },
  { id: "linkedin", label: "LinkedIn", icon: "💼", connected: false },
  { id: "facebook", label: "Facebook", icon: "👍", connected: false },
];

let sceneCounter = 1;

export default function VideoCreatorPage() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [ratio, setRatio] = useState<AspectRatio>("9:16");
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([
    { id: "s1", imageUrl: "https://picsum.photos/400/700?random=1", text: "Sahne 1", duration: 3 },
  ]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("#içerik #video");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleMode, setScheduleMode] = useState<"now" | "later">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [rendering, setRendering] = useState(false);

  const addScene = () => {
    sceneCounter++;
    setScenes((prev) => [
      ...prev,
      { id: `s${sceneCounter}`, imageUrl: `https://picsum.photos/400/700?random=${sceneCounter + 10}`, text: `Sahne ${sceneCounter}`, duration: 3 },
    ]);
  };

  const removeScene = (id: string) => setScenes((prev) => prev.filter((s) => s.id !== id));

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const startRender = () => {
    setRendering(true);
    setTimeout(() => { setRendering(false); setStep(4); }, 3000);
  };

  const ratioClass: Record<AspectRatio, string> = {
    "9:16": "aspect-[9/16] w-24",
    "1:1": "aspect-square w-28",
    "16:9": "aspect-video w-40",
    "4:5": "aspect-[4/5] w-24",
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {["Temel Bilgiler", "Sahneler & Müzik", "Yayın Ayarları", "Tamamlandı"].map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => step > i + 1 && setStep(i + 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                step === i + 1
                  ? "bg-amber-500 text-slate-900"
                  : step > i + 1
                  ? "bg-green-500/20 text-green-400 cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-current/20">
                {step > i + 1 ? "✓" : i + 1}
              </span>
              <span className="hidden sm:block">{s}</span>
            </button>
            {i < 3 && <span className="text-slate-700 text-xs">→</span>}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold text-white">Temel Bilgiler</h1>

          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Video Başlığı</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Videona bir isim ver..."
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-3">En-Boy Oranı</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {RATIOS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRatio(r.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      ratio === r.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-slate-600 hover:border-slate-500 bg-slate-800/50"
                    }`}
                  >
                    <div className={`mx-auto bg-slate-600 rounded mb-2 ${ratioClass[r.id]}`} />
                    <p className={`text-xs font-bold ${ratio === r.id ? "text-amber-400" : "text-slate-300"}`}>{r.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!title}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-900 font-semibold transition-colors"
          >
            Devam Et →
          </button>
        </div>
      )}

      {/* Step 2: Scenes & Music */}
      {step === 2 && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold text-white">Sahneler &amp; Müzik</h1>

          {/* Music Upload */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-bold text-slate-300 mb-3">🎵 Arka Plan Müziği</h2>
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => setMusicFile(e.target.files?.[0] ?? null)}
              />
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                musicFile ? "border-green-500/50 bg-green-500/5" : "border-slate-600 hover:border-amber-500/50"
              }`}>
                {musicFile ? (
                  <>
                    <span className="text-3xl block mb-2">🎵</span>
                    <p className="text-sm font-semibold text-green-400">{musicFile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(musicFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  </>
                ) : (
                  <>
                    <span className="text-3xl block mb-2">📁</span>
                    <p className="text-sm text-slate-300">MP3, WAV, M4A yükleyin</p>
                    <p className="text-xs text-slate-500 mt-1">Maks. 50 MB</p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Scenes */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-300">🖼️ Sahneler ({scenes.length})</h2>
              <button
                onClick={addScene}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold transition-colors"
              >
                + Sahne Ekle
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {scenes.map((scene, i) => (
                <div key={scene.id} className="relative group rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                  <img src={scene.imageUrl} alt="" className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-1.5 rounded-lg bg-white/20 text-white text-xs">✏️</button>
                    <button onClick={() => removeScene(scene.id)} className="p-1.5 rounded-lg bg-red-500/50 text-white text-xs">✕</button>
                  </div>
                  <div className="p-2">
                    <input
                      value={scene.text}
                      onChange={(e) => setScenes((prev) => prev.map((s) => s.id === scene.id ? { ...s, text: e.target.value } : s))}
                      className="w-full text-xs bg-transparent text-slate-300 focus:outline-none"
                    />
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-slate-500">#{i + 1}</span>
                      <input
                        type="number"
                        value={scene.duration}
                        min={1}
                        max={10}
                        onChange={(e) => setScenes((prev) => prev.map((s) => s.id === scene.id ? { ...s, duration: Number(e.target.value) } : s))}
                        className="w-10 text-[10px] bg-slate-700 rounded px-1 text-slate-300 focus:outline-none text-center"
                      />
                      <span className="text-[10px] text-slate-500">sn</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Add scene placeholder */}
              <button onClick={addScene} className="rounded-xl border-2 border-dashed border-slate-600 hover:border-amber-500/50 aspect-square flex items-center justify-center text-slate-500 hover:text-amber-400 transition-colors text-2xl">
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors">
              ← Geri
            </button>
            <button onClick={() => setStep(3)} className="flex-2 flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors">
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Publish Settings */}
      {step === 3 && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold text-white">Yayın Ayarları</h1>

          {/* Caption */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Açıklama / Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                placeholder="Video açıklaması..."
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Hashtagler</label>
              <input
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#video #içerik #trend"
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Platforms */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-bold text-slate-300 mb-4">Paylaşım Platformları</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map((p) => {
                const selected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => p.connected ? togglePlatform(p.id) : null}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                      ${selected ? "border-amber-500 bg-amber-500/10" : "border-slate-600 bg-slate-800/50"}
                      ${!p.connected ? "opacity-50 cursor-not-allowed" : "hover:border-slate-500 cursor-pointer"}`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <div>
                      <p className={`text-xs font-semibold ${selected ? "text-amber-400" : "text-slate-300"}`}>{p.label}</p>
                      <p className="text-[10px] text-slate-500">{p.connected ? "Bağlı" : "Bağlı değil"}</p>
                    </div>
                    {!p.connected && (
                      <a
                        href="/uygulama/sosyal-hesaplar"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-1.5 right-1.5 text-[9px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded"
                      >
                        Bağla
                      </a>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-bold text-slate-300 mb-4">Zamanlama</h2>
            <div className="flex gap-3 mb-4">
              {(["now", "later"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setScheduleMode(m)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    scheduleMode === m ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-slate-600 text-slate-400"
                  }`}
                >
                  {m === "now" ? "🚀 Hemen Yayınla" : "🕐 Zamanla"}
                </button>
              ))}
            </div>
            {scheduleMode === "later" && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors">
              ← Geri
            </button>
            <button
              onClick={startRender}
              disabled={rendering}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-semibold transition-colors"
            >
              {rendering ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Video Hazırlanıyor...
                </span>
              ) : "🎬 Videoyu Oluştur"}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <div className="text-center py-12">
          <span className="text-7xl block mb-6">🎉</span>
          <h1 className="text-2xl font-bold text-white mb-2">Video Hazır!</h1>
          <p className="text-slate-400 mb-8">Videonuz başarıyla oluşturuldu ve yayın kuyruğuna eklendi.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors flex items-center gap-2"
            >
              ⬇️ İndir
            </a>
            <button
              onClick={() => { setStep(1); setTitle(""); setMusicFile(null); setScenes([{ id: "s1", imageUrl: "https://picsum.photos/400/700?random=1", text: "Sahne 1", duration: 3 }]); }}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors"
            >
              + Yeni Video Oluştur
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
