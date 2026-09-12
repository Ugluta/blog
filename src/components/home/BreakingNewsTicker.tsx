"use client";

import { breakingNewsItems } from "@/lib/mockData";

export default function BreakingNewsTicker() {
  // Duplicate items for seamless loop
  const doubled = [...breakingNewsItems, ...breakingNewsItems];

  return (
    <div className="bg-slate-800 border-b border-slate-700/50 overflow-hidden">
      <div className="flex items-center h-9">
        {/* Badge */}
        <div
          className="flex-shrink-0 flex items-center gap-1.5 px-4 h-full font-bold text-xs uppercase tracking-widest text-white"
          style={{ backgroundColor: "#DC2626" }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          SON DAKİKA
        </div>

        {/* Divider */}
        <div
          className="flex-shrink-0 w-0 h-0 border-t-[18px] border-b-[18px] border-l-[10px] border-transparent"
          style={{ borderLeftColor: "#DC2626" }}
        />

        {/* Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="ticker-inner whitespace-nowrap">
            {doubled.map((item, idx) => (
              <span
                key={`${item.id}-${idx}`}
                className="inline-flex items-center gap-2 pr-10 text-sm text-slate-200 cursor-pointer hover:text-amber-400 transition-colors"
              >
                <span
                  className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded"
                  style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}
                >
                  {item.category}
                </span>
                {item.title}
                <span className="text-slate-500 text-xs">{item.time}</span>
                <span className="text-slate-600 mx-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
