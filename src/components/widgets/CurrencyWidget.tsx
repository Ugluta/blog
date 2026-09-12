import { currencyData } from "@/lib/mockData";

export default function CurrencyWidget() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-lg">💱</span>
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 font-inter">
            Döviz Kurları
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-inter">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {timeStr}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-inter">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-4 py-2 text-slate-500 font-semibold uppercase tracking-wider">
                Döviz
              </th>
              <th className="text-right px-3 py-2 text-slate-500 font-semibold uppercase tracking-wider">
                Alış
              </th>
              <th className="text-right px-3 py-2 text-slate-500 font-semibold uppercase tracking-wider">
                Satış
              </th>
              <th className="text-right px-4 py-2 text-slate-500 font-semibold uppercase tracking-wider">
                Değ.
              </th>
            </tr>
          </thead>
          <tbody>
            {currencyData.map((c) => (
              <tr
                key={c.code}
                className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <div>
                      <div className="font-bold text-slate-200">{c.code}</div>
                      <div className="text-[10px] text-slate-500 hidden sm:block truncate max-w-[80px]">
                        {c.name.split(" ")[0]}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right font-semibold text-slate-300">
                  {c.buy.toFixed(c.buy < 1 ? 4 : 2)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold text-slate-300">
                  {c.sell.toFixed(c.sell < 1 ? 4 : 2)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold ${
                      c.change >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {c.change >= 0 ? "▲" : "▼"}
                    {Math.abs(c.change).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 text-[10px] text-slate-600 font-inter text-right">
        * Gösterge amaçlıdır, gerçek kur değildir.
      </div>
    </div>
  );
}
