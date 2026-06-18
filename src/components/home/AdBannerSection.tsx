interface AdBannerSectionProps {
  position?: "top" | "mid" | "bottom";
}

export default function AdBannerSection({ position = "mid" }: AdBannerSectionProps) {
  return (
    <div className="py-3" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div
          className="w-full flex items-center justify-center overflow-hidden border border-slate-700/30"
          style={{ minHeight: 90, backgroundColor: "#0F172A" }}
        >
          <div className="flex flex-col items-center gap-1 py-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 border border-slate-700 px-2 py-0.5 rounded-sm">
              REKLAM
            </span>
            <span className="text-xs text-slate-700 font-mono">728 × 90 — {position === "top" ? "Üst" : position === "mid" ? "Orta" : "Alt"} Reklam Alanı</span>
          </div>
        </div>
      </div>
    </div>
  );
}
