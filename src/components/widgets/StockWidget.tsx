import { stockIndices, stocks } from "@/lib/mockData";

export default function StockWidget() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
        <span className="text-lg">📈</span>
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200 font-inter">
          Borsa
        </h3>
      </div>

      {/* Indices */}
      <div className="grid grid-cols-2 gap-0 border-b border-slate-700/50">
        {stockIndices.map((idx) => (
          <div
            key={idx.name}
            className="px-4 py-3 border-r last:border-r-0 border-slate-700/50 hover:bg-slate-700/30 transition-colors"
          >
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400 font-inter mb-0.5">
              {idx.name}
            </div>
            <div className="text-lg font-black text-slate-100 font-inter">
              {idx.value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            </div>
            <div
              className={`text-xs font-bold flex items-center gap-0.5 font-inter mt-0.5 ${
                idx.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {idx.changePercent >= 0 ? "▲" : "▼"}
              {Math.abs(idx.changePercent).toFixed(2)}%
              <span className="text-slate-500 font-normal ml-1">
                ({idx.change >= 0 ? "+" : ""}
                {idx.change.toFixed(2)})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Individual Stocks */}
      <div>
        {stocks.map((stock, idx) => (
          <div
            key={stock.symbol}
            className={`flex items-center justify-between px-4 py-2.5 hover:bg-slate-700/30 transition-colors ${
              idx < stocks.length - 1 ? "border-b border-slate-700/30" : ""
            }`}
          >
            <div>
              <div className="text-xs font-bold text-slate-200 font-inter">{stock.symbol}</div>
              <div className="text-[10px] text-slate-500 font-inter truncate max-w-[110px]">
                {stock.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-200 font-inter">
                {stock.price.toFixed(2)} ₺
              </div>
              <div
                className={`text-[10px] font-bold flex items-center justify-end gap-0.5 font-inter ${
                  stock.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stock.changePercent >= 0 ? (
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
                %{Math.abs(stock.changePercent).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 border-t border-slate-700/30">
        <a href="/borsa" className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-inter">
          Tüm hisse senetleri →
        </a>
      </div>
    </div>
  );
}
