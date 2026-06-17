"use client";

import { useState, useEffect, useCallback } from "react";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  createdAt: string;
};

type Invite = {
  id: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
  invitedBy: { name: string | null; email: string };
};

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Süper Admin",
  ADMIN: "Admin",
  EDITOR: "Editör",
  PUBLISHER: "Yayıncı",
  VIEWER: "Görüntüleyici",
};

const ROLE_STYLE: Record<string, string> = {
  SUPER_ADMIN: "bg-red-500/20 text-red-400",
  ADMIN: "bg-amber-500/20 text-amber-400",
  EDITOR: "bg-blue-500/20 text-blue-400",
  PUBLISHER: "bg-purple-500/20 text-purple-400",
  VIEWER: "bg-slate-600/30 text-slate-400",
};

const INVITE_ROLES = [
  { value: "EDITOR", label: "Editör" },
  { value: "PUBLISHER", label: "Yayıncı" },
  { value: "VIEWER", label: "Görüntüleyici" },
];

export default function EkipPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm] = useState({ email: "", role: "EDITOR" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/team/invites").catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setMembers(data.members ?? []);
      setInvites(data.invites ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const sendInvite = async () => {
    if (!form.email) return;
    setSending(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/team/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Hata"); return; }
      setSuccess(`Davet gönderildi: ${form.email}`);
      setForm({ email: "", role: "EDITOR" });
      setShowInvite(false);
      load();
    } finally { setSending(false); }
  };

  const revokeInvite = async (id: string) => {
    await fetch(`/api/team/invites/${id}`, { method: "DELETE" });
    load();
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/davet/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Ekip Yönetimi</h1>
          <p className="text-sm text-slate-400 mt-1">Takım üyelerini yönetin ve yeni üye davet edin</p>
        </div>
        <button
          onClick={() => { setShowInvite(true); setError(""); setSuccess(""); }}
          className="px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg transition-colors flex items-center gap-1.5"
        >
          + Üye Davet Et
        </button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm">
          ✓ {success}
        </div>
      )}

      {/* Members */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Aktif Üyeler</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />)}
          </div>
        ) : members.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center">Henüz ekip üyesi yok</p>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="bg-slate-800/40 border border-slate-700/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                  {m.image
                    ? <img src={m.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                    : (m.name?.[0] ?? m.email[0]).toUpperCase()
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{m.name ?? m.email}</p>
                  {m.name && <p className="text-xs text-slate-500 truncate">{m.email}</p>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_STYLE[m.role] ?? "bg-slate-700 text-slate-400"}`}>
                  {ROLE_LABEL[m.role] ?? m.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Invites */}
      {(invites.length > 0 || !loading) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Bekleyen Davetler</h2>
          {invites.length === 0 ? (
            <p className="text-slate-600 text-sm py-3 text-center">Bekleyen davet yok</p>
          ) : (
            <div className="space-y-2">
              {invites.map((inv) => (
                <div key={inv.id} className="bg-slate-800/40 border border-slate-700/30 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-sm flex-shrink-0">
                    ✉
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">{inv.email}</p>
                    <p className="text-xs text-slate-500">
                      {ROLE_LABEL[inv.role] ?? inv.role} · {inv.invitedBy.name ?? inv.invitedBy.email} tarafından ·{" "}
                      {new Date(inv.expiresAt).toLocaleDateString("tr-TR")} sona erer
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => copyLink(inv.token)}
                      className="text-xs px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    >
                      {copiedToken === inv.token ? "✓ Kopyalandı" : "🔗 Link"}
                    </button>
                    <button
                      onClick={() => revokeInvite(inv.id)}
                      className="text-xs px-2.5 py-1.5 text-slate-500 hover:text-red-400 border border-slate-700/50 rounded-lg transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowInvite(false)} />
          <div className="relative bg-[#0F172A] border border-slate-700/50 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
              <h3 className="font-bold text-white">Üye Davet Et</h3>
              <button onClick={() => setShowInvite(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">E-posta *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="ornek@sirket.com"
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Rol</label>
                <select
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                >
                  {INVITE_ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-600 mt-1">
                  Editör: yazı oluşturabilir. Yayıncı: yayınlayabilir. Görüntüleyici: sadece okuyabilir.
                </p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={sendInvite}
                disabled={sending || !form.email}
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold text-sm transition-colors"
              >
                {sending ? "Gönderiliyor…" : "Davet Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
