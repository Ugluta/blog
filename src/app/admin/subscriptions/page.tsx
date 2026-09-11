"use client";

import { useState, useEffect, useCallback } from "react";

type Subscription = {
  id: string; status: string; billingPeriod: string;
  startedAt: string; expiresAt?: string | null;
  user: { id: string; name?: string | null; email: string; image?: string | null };
  package: { name: string; price: number; currency: string };
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  TRIALING: "bg-blue-100 text-blue-700",
  PAST_DUE: "bg-amber-100 text-amber-700",
  CANCELED: "bg-[#EBF2FA] text-[#666666]",
  EXPIRED: "bg-red-100 text-red-700",
  PAUSED: "bg-[#EBF2FA] text-[#666666]",
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
        <h1 className="text-xl font-bold text-[#111111]">Abonelikler</h1>
        <p className="text-sm text-[#666666] mt-0.5">{total} abonelik</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Toplam", value: total },
          { label: "Aktif", value: activeCount },
          { label: "Gecikmiş", value: stats.find(s => s.status === "PAST_DUE")?._count ?? 0 },
        ].map(s => (
          <div key={s.label} className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-[#111111]">{s.value}</p>
            <p className="text-xs text-[#666666] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Kullanıcı ara…"
          className="flex-1 min-w-[180px] bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-[#FFFFFF] border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]">
          <option value="">Tüm Durumlar</option>
          {Object.keys(STATUS_LABELS).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-[#FFFFFF] animate-pulse" />)}</div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#E7E2D8]">
          <p className="text-3xl mb-2">💎</p>
          <p className="text-[#666666]">Abonelik bulunamadı</p>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E7E2D8]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Kullanıcı</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase hidden sm:table-cell">Paket</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Durum</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase hidden md:table-cell">Bitiş</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-[#EBF2FA] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#EBF2FA] flex-shrink-0 overflow-hidden">
                        {sub.user.image ? (
                          <img src={sub.user.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#666666]">
                            {(sub.user.name ?? sub.user.email)[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-[#111111]">{sub.user.name ?? "—"}</p>
                        <p className="text-xs text-[#666666]">{sub.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-sm text-[#444444]">{sub.package.name}</p>
                    <p className="text-xs text-[#666666]">
                      {sub.package.price} {sub.package.currency} / {sub.billingPeriod === "MONTHLY" ? "ay" : "yıl"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[sub.status] ?? STATUS_COLORS.ACTIVE}`}>
                      {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-[#666666]">
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
            className="px-3 py-1.5 text-xs rounded-lg bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#444444] disabled:opacity-40 transition-colors">← Önceki</button>
          <span className="text-xs text-[#666666]">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#EBF2FA] hover:bg-[#E7E2D8] text-[#444444] disabled:opacity-40 transition-colors">Sonraki →</button>
        </div>
      )}
    </div>
  );
}
