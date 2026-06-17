"use client";

import { useState, useEffect, useCallback } from "react";

type Subscription = {
  id: string; status: string; billingPeriod: string;
  startedAt: string; expiresAt?: string | null;
  user: { id: string; name?: string | null; email: string; image?: string | null };
  package: { name: string; price: number; currency: string };
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500/20 text-green-400",
  TRIALING: "bg-blue-500/20 text-blue-400",
  PAST_DUE: "bg-amber-500/20 text-amber-400",
  CANCELED: "bg-slate-600/40 text-slate-500",
  EXPIRED: "bg-red-500/20 text-red-400",
  PAUSED: "bg-slate-600/40 text-slate-400",
};
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Aktif", TRIALING: "Deneme", PAST_DUE: "Gecikmiş",
  CANCELED: "İptal", EXPIRED: "Süresi Doldu", PAUSED: "Duraklatıldı",
};

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<{ status: string; _count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("search", search);
    if (statusFilter) p.set("status", statusFilter);
    const res = await fetch(`/api/admin/subscriptions?${p}`);
    const d = await res.json();
    setSubscriptions(d.subscriptions ?? []);
    setTotal(d.total ?? 0);
    setStats(d.stats ?? []);
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 20);
  const activeCount = stats.find(s => s.status === "ACTIVE")?._count ?? 0;

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-white">Abonelikler</h1>
        <p className="text-sm text-slate-400 mt-0.5">{total} abonelik</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Toplam", value: total },
          { label: "Aktif", value: activeCount },
          { label: "Gecikmiş", value: stats.find(s => s.status === "PAST_DUE")?._count ?? 0 },
        ].map(s => (
          <div key={s.label} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Kullanıcı ara…"
          className="flex-1 min-w-[180px] bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500">
          <option value="">Tüm Durumlar</option>
          {Object.keys(STATUS_LABELS).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-slate-800/40 animate-pulse" />)}</div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <p className="text-3xl mb-2">💎</p>
          <p className="text-slate-400">Abonelik bulunamadı</p>
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Kullanıcı</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Paket</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Durum</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Bitiş</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
                        {sub.user.image ? (
                          <img src={sub.user.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                            {(sub.user.name ?? sub.user.email)[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-white">{sub.user.name ?? "—"}</p>
                        <p className="text-xs text-slate-500">{sub.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-sm text-slate-300">{sub.package.name}</p>
                    <p className="text-xs text-slate-500">
                      {sub.package.price} {sub.package.currency} / {sub.billingPeriod === "MONTHLY" ? "ay" : "yıl"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[sub.status] ?? STATUS_COLORS.ACTIVE}`}>
                      {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-slate-500">
                      {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString("tr-TR") : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-40 transition-colors">← Önceki</button>
          <span className="text-xs text-slate-500">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-40 transition-colors">Sonraki →</button>
        </div>
      )}
    </div>
  );
}
