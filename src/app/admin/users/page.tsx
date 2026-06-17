"use client";

import { useState, useEffect, useCallback } from "react";

type User = {
  id: string; name?: string | null; email: string;
  image?: string | null; role: string;
  createdAt: string; emailVerified?: string | null;
  _count?: { posts: number };
};

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "PUBLISHER", "VIEWER"];

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
  ADMIN: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  EDITOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PUBLISHER: "bg-green-500/20 text-green-400 border-green-500/30",
  VIEWER: "bg-slate-600/40 text-slate-400 border-slate-600/40",
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Süper Admin", ADMIN: "Admin", EDITOR: "Editör",
  PUBLISHER: "Yayıncı", VIEWER: "Görüntüleyici",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, [search, roleFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateRole = async (userId: string, role: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      showToast("Rol güncellendi");
    } else {
      const d = await res.json();
      showToast(d.error ?? "Hata oluştu");
    }
  };

  const deleteUser = async (user: User) => {
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setTotal(t => t - 1);
      showToast("Kullanıcı silindi");
    } else {
      const d = await res.json();
      showToast(d.error ?? "Hata oluştu");
    }
    setConfirmDelete(null);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-5 max-w-5xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-amber-500/40 text-amber-400 px-4 py-2.5 rounded-xl text-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-slate-400 mt-0.5">{total} kullanıcı</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="İsim veya e-posta ara..."
            className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="">Tüm Roller</option>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 rounded-xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <p className="text-3xl mb-2">👥</p>
          <p className="text-slate-400">Kullanıcı bulunamadı</p>
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kullanıcı</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Kayıt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rol</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt={user.name ?? ""} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-400">
                            {(user.name ?? user.email)[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name ?? "—"}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={e => updateRole(user.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border bg-transparent cursor-pointer focus:outline-none ${ROLE_COLORS[user.role] ?? ROLE_COLORS.VIEWER}`}
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r} className="bg-slate-800 text-slate-200">{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setConfirmDelete(user)}
                      className="px-2 py-1 text-xs rounded-lg bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-40 transition-colors">
            ← Önceki
          </button>
          <span className="text-xs text-slate-500">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-40 transition-colors">
            Sonraki →
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-[#0F172A] border border-slate-700/50 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <p className="text-2xl mb-3">⚠️</p>
            <h3 className="font-bold text-white mb-2">Kullanıcıyı Sil</h3>
            <p className="text-sm text-slate-400 mb-5">
              <span className="text-white font-medium">{confirmDelete.name ?? confirmDelete.email}</span> kalıcı olarak silinecek.
              Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm transition-colors">
                İptal
              </button>
              <button onClick={() => deleteUser(confirmDelete)} className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-colors">
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
