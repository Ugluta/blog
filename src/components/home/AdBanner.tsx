interface AdBannerProps {
  size: "leaderboard" | "rectangle" | "skyscraper";
  label?: string;
}

const sizeConfig = {
  leaderboard: {
    width: "728px",
    height: "90px",
    label: "728 × 90",
    className: "w-full max-w-3xl mx-auto",
    style: { height: "90px" },
  },
  rectangle: {
    width: "300px",
    height: "250px",
    label: "300 × 250",
    className: "w-full max-w-xs mx-auto",
    style: { height: "250px" },
  },
  skyscraper: {
    width: "160px",
    height: "600px",
    label: "160 × 600",
    className: "w-full",
    style: { height: "600px" },
  },
};

export default function AdBanner({ size, label }: AdBannerProps) {
  const config = sizeConfig[size];

  return (
    <div className={`${config.className} my-5`}>
      <div
        className="border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center bg-slate-800/50 gap-2"
        style={config.style}
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-3 py-1 rounded border border-slate-600 bg-slate-800">
          REKLAM
        </span>
        <span className="text-xs text-slate-600 font-mono">{label ?? config.label}</span>
      </div>
    </div>
  );
}
