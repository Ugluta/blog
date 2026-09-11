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
  SUPER_ADMIN: "bg-red-500/20 text-red-600",
  ADMIN: "bg-[#EBF2FA] text-[#3A6EA8]",
  EDITOR: "bg-blue-500/20 text-blue-600",
  PUBLISHER: "bg-purple-500/20 text-purple-600",
  VIEWER: "bg-[#E7E2D8] text-[#666666]",
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
          <h1 className="text-2xl font-bold text-[#111111]">Ekip Yönetimi</h1>
          <p className="text-sm text-[#666666] mt-1">Takım üyelerini yönetin ve yeni üye davet edin</p>
        </div>
        <button
          onClick={() => { setShowInvite(true); setError(""); setSuccess(""); }}
          className="px-4 py-2 text-sm font-semibold bg-[#3A6EA8] hover:bg-[#2D5A8E] text-white rounded-lg transition-colors flex items-center gap-1.5"
        >
          + Üye Davet Et
        </button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-600 rounded-xl px-4 py-3 text-sm">
          ✓ {success}
        </div>
      )}

      {/* Members */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#666666] mb-3">Aktif Üyeler</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white rounded-xl animate-pulse" />)}
          </div>
        ) : members.length === 0 ? (
          <p className="text-[#666666] text-sm py-4 text-center">Henüz ekip üyesi yok</p>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="bg-white border border-[#E7E2D8] rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EBF2FA] flex items-center justify-center text-[#3A6EA8] font-bold text-sm flex-shrink-0">
                  {m.image
                    ? <img src={m.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                    : (m.name?.[0] ?? m.email[0]).toUpperCase()
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111111] truncate">{m.name ?? m.email}</p>
                  {m.name && <p className="text-xs text-[#666666] truncate">{m.email}</p>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_STYLE[m.role] ?? "bg-[#EBF2FA] text-[#666666]"}`}>
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#666666] mb-3">Bekleyen Davetler</h2>
          {invites.length === 0 ? (
            <p className="text-[#666666] text-sm py-3 text-center">Bekleyen davet yok</p>
          ) : (
            <div className="space-y-2">
              {invites.map((inv) => (
                <div key={inv.id} className="bg-white border border-[#E7E2D8] rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
                  <div className="w-8 h-8 rounded-full bg-[#EBF2FA] flex items-center justify-center text-[#666666] text-sm flex-shrink-0">
                    ✉
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#111111] truncate">{inv.email}</p>
                    <p className="text-xs text-[#666666]">
                      {ROLE_LABEL[inv.role] ?? inv.role} · {inv.invitedBy.name ?? inv.invitedBy.email} tarafından ·{" "}
                      {new Date(inv.expiresAt).toLocaleDateString("tr-TR")} sona erer
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => copyLink(inv.token)}
                      className="text-xs px-2.5 py-1.5 bg-[#EBF2FA] hover:bg-[#B5CDE8] text-[#444444] rounded-lg transition-colors"
                    >
                      {copiedToken === inv.token ? "✓ Kopyalandı" : "🔗 Link"}
                    </button>
                    <button
                      onClick={() => revokeInvite(inv.id)}
                      className="text-xs px-2.5 py-1.5 text-[#666666] hover:text-red-600 border border-[#E7E2D8] rounded-lg transition-colors"
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
          <div className="relative bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E2D8]">
              <h3 className="font-bold text-[#111111]">Üye Davet Et</h3>
              <button onClick={() => setShowInvite(false)} className="text-[#666666] hover:text-[#111111] text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              {error && <p className="text-xs text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">E-posta *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="ornek@sirket.com"
                  className="w-full bg-white border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1.5">Rol</label>
                <select
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full bg-white border border-[#E7E2D8] text-[#111111] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6EA8]"
                >
                  {INVITE_ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <p className="text-xs text-[#666666] mt-1">
                  Editör: yazı oluşturabilir. Yayıncı: yayınlayabilir. Görüntüleyici: sadece okuyabilir.
                </p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={sendInvite}
                disabled={sending || !form.email}
                className="w-full py-2.5 rounded-lg bg-[#3A6EA8] hover:bg-[#2D5A8E] disabled:opacity-50 text-white font-bold text-sm transition-colors"
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
