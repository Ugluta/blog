import { historicalEvents } from "@/lib/mockData";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export default function OnThisDayWidget() {
  const today = new Date();
  const dayStr = `${today.getDate()} ${MONTHS[today.getMonth()]}`;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏛️</span>
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 font-inter">
            Tarihte Bugün
          </h3>
        </div>
        <span className="text-xs font-semibold text-amber-400 font-inter">{dayStr}</span>
      </div>

      {/* Events Timeline */}
      <div className="px-4 py-3 space-y-0">
        {historicalEvents.map((event, idx) => (
          <div key={event.year} className="flex gap-3 pb-0">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black font-inter"
                style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}
              >
                {event.year.toString().slice(-2)}
              </div>
              {idx < historicalEvents.length - 1 && (
                <div className="w-px flex-1 bg-slate-700/50 my-1 min-h-4" />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 ${idx < historicalEvents.length - 1 ? "pb-4" : "pb-1"}`}>
              <div className="text-xs font-bold text-amber-400 font-inter mb-0.5">
                {event.year}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-inter">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-slate-700/30">
        <a href="/tarihte-bugun" className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-inter">
          Tüm tarihi olaylar →
        </a>
      </div>
    </div>
  );
}
