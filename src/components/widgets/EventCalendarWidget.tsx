import { events } from "@/lib/mockData";

const MONTHS_SHORT = [
  "OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ",
  "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA",
];

const typeColors: Record<string, string> = {
  Konferans: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  Forum: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  Demo: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  Hackathon: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  Seminer: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
};

export default function EventCalendarWidget() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
        <span className="text-lg">📅</span>
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 font-inter">
          Yaklaşan Etkinlikler
        </h3>
      </div>

      {/* Events List */}
      <div className="divide-y divide-slate-700/30">
        {events.map((event) => {
          const d = new Date(event.date);
          const day = d.getDate();
          const month = MONTHS_SHORT[d.getMonth()];
          const typeCls = typeColors[event.type] ?? "bg-slate-700 text-slate-400";

          return (
            <div
              key={event.id}
              className="flex items-start gap-3 px-4 py-3 hover:bg-slate-700/30 transition-colors group cursor-pointer"
            >
              {/* Date Badge */}
              <div className="flex-shrink-0 w-11 text-center">
                <div
                  className="text-xl font-black leading-none font-inter"
                  style={{ color: "#F59E0B" }}
                >
                  {day}
                </div>
                <div className="text-[10px] font-bold text-slate-500 font-inter uppercase">{month}</div>
              </div>

              {/* Divider */}
              <div className="flex-shrink-0 w-px bg-amber-500/30 self-stretch" />

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors leading-snug mb-1">
                  {event.title}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-inter mb-1.5">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </div>
                <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${typeCls}`}>
                  {event.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2.5 border-t border-slate-700/30">
        <a href="/etkinlikler" className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-inter">
          Tüm etkinlikleri gör →
        </a>
      </div>
    </div>
  );
}
