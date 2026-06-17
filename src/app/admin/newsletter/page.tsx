"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Subscriber = {
  id: string; email: string; name?: string | null;
  status: string; source?: string | null; createdAt: string;
};

type Campaign = {
  id: string; title: string; subject: string; preheader?: string | null;
  content: string; status: string; sentAt?: string | null;
  sentCount: number; openCount: number; clickCount: number; createdAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Aktif", UNSUBSCRIBED: "İptal", BOUNCED: "Geri döndü",
  DRAFT: "Taslak", SCHEDULED: "Planlandı", SENDING: "Gönderiliyor", SENT: "Gönderildi",
};
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500/20 text-green-400",
  UNSUBSCRIBED: "bg-slate-600/40 text-slate-500",
  BOUNCED: "bg-red-500/20 text-red-400",
  DRAFT: "bg-slate-600/40 text-slate-400",
  SCHEDULED: "bg-blue-500/20 text-blue-400",
  SENDING: "bg-amber-500/20 text-amber-400",
  SENT: "bg-green-500/20 text-green-400",
};

const INPUT = "w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500";

// ─── Subscribers Tab ──────────────────────────────────────────────────────────

function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<{ status: string; _count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (statusFilter) p.set("status", statusFilter);
    const res = await fetch(`/api/admin/newsletter/subscribers?${p}`);
    const d = await res.json();
    setSubscribers(d.subscribers ?? []);
    setTotal(d.total ?? 0);
    setStats(d.stats ?? []);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const deleteSubscriber = async (id: string) => {
    await fetch("/api/admin/newsletter/subscribers", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSubscribers(p => p.filter(s => s.id !== id));
    setTotal(t => t - 1);
    showToast("Abone silindi");
  };

  const activeCount = stats.find(s => s.status === "ACTIVE")?._count ?? 0;

  return (
    <div className="space-y-4">
      {toast && <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-amber-500/40 text-amber-400 px-4 py-2.5 rounded-xl text-sm shadow-xl">{toast}</div>}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Toplam", value: total },
          { label: "Aktif", value: activeCount },
          { label: "İptal", value: stats.find(s => s.status === "UNSUBSCRIBED")?._count ?? 0 },
        ].map(s => (
          <div key={s.label} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="E-posta veya isim ara…"
          className="flex-1 bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500">
          <option value="">Tüm Durumlar</option>
          <option value="ACTIVE">Aktif</option>
          <option value="UNSUBSCRIBED">İptal</option>
          <option value="BOUNCED">Geri döndü</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 rounded-xl bg-slate-800/40 animate-pulse" />)}</div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <p className="text-3xl mb-2">📧</p>
          <p className="text-slate-400">Abone bulunamadı</p>
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">E-posta</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Kayıt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Durum</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-white">{sub.email}</p>
                    {sub.name && <p className="text-xs text-slate-500">{sub.name}</p>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-slate-500">{new Date(sub.createdAt).toLocaleDateString("tr-TR")}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[sub.status] ?? STATUS_COLORS.ACTIVE}`}>
                      {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteSubscriber(sub.id)}
                      className="text-xs text-slate-500 hover:text-red-400 transition-colors">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Campaigns Tab ────────────────────────────────────────────────────────────

function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState({ title: "", subject: "", preheader: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/newsletter/campaigns");
    const d = await res.json();
    setCampaigns(d.campaigns ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", subject: "", preheader: "", content: "" });
    setShowForm(true);
  };

  const openEdit = (c: Campaign) => {
    setEditing(c);
    setForm({ title: c.title, subject: c.subject, preheader: c.preheader ?? "", content: c.content });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title || !form.subject || !form.content) return;
    setSaving(true);
    try {
      const url = editing ? `/api/admin/newsletter/campaigns/${editing.id}` : "/api/admin/newsletter/campaigns";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      await load();
      setShowForm(false);
      showToast(editing ? "Kampanya güncellendi" : "Kampanya oluşturuldu");
    } catch { showToast("Hata oluştu"); }
    finally { setSaving(false); }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm("Kampanyayı silmek istiyor musunuz?")) return;
    await fetch(`/api/admin/newsletter/campaigns/${id}`, { method: "DELETE" });
    setCampaigns(p => p.filter(c => c.id !== id));
    showToast("Kampanya silindi");
  };

  const send = async (id: string) => {
    if (!confirm("Kampanya tüm aktif abonelere gönderilecek. Devam?")) return;
    setSending(id);
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${id}/send`, { method: "POST" });
      const d = await res.json();
      if (!res.ok) { showToast(d.error ?? "Gönderim hatası"); return; }
      showToast(`${d.sentCount} aboneye gönderildi`);
      await load();
    } catch { showToast("Hata oluştu"); }
    finally { setSending(null); }
  };

  return (
    <div className="space-y-4">
      {toast && <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-amber-500/40 text-amber-400 px-4 py-2.5 rounded-xl text-sm shadow-xl">{toast}</div>}

      <div className="flex justify-end">
        <button onClick={openNew}
          className="px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg transition-colors flex items-center gap-1.5">
          + Yeni Kampanya
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 rounded-xl bg-slate-800/40 animate-pulse" />)}</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <p className="text-3xl mb-2">📮</p>
          <p className="text-slate-400">Henüz kampanya yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status] ?? STATUS_COLORS.DRAFT}`}>
                      {STATUS_LABELS[c.status] ?? c.status}
                    </span>
                    {c.status === "SENT" && (
                      <span className="text-xs text-slate-500">{c.sentCount} gönderildi</span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-sm">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{c.subject}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {c.status === "DRAFT" && (
                    <>
                      <button onClick={() => openEdit(c)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-700 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors">
                        Düzenle
                      </button>
                      <button onClick={() => send(c.id)} disabled={sending === c.id}
                        className="px-2.5 py-1 text-xs rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-semibold transition-colors">
                        {sending === c.id ? "Gönderiliyor…" : "Gönder"}
                      </button>
                    </>
                  )}
                  <button onClick={() => deleteCampaign(c.id)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign form panel */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-xl bg-[#0F172A] border-l border-slate-700/50 h-full overflow-y-auto flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
              <h2 className="font-bold text-white text-sm">{editing ? "Kampanyayı Düzenle" : "Yeni Kampanya"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Başlık (dahili) *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">E-posta Konusu *</label>
                <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Preheader</label>
                <input value={form.preheader} onChange={e => setForm(p => ({ ...p, preheader: e.target.value }))}
                  placeholder="Kısa önizleme metni…" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">İçerik (HTML) *</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  rows={14} className={`${INPUT} resize-none font-mono text-xs`}
                  placeholder="<h1>Merhaba!</h1><p>İçerik buraya gelecek.</p>" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-700/50">
              <button onClick={save} disabled={saving || !form.title || !form.subject || !form.content}
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold text-sm transition-colors">
                {saving ? "Kaydediliyor…" : editing ? "Kaydet" : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminNewsletterPage() {
  const [tab, setTab] = useState<"subscribers" | "campaigns">("subscribers");

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white">Newsletter</h1>
        <p className="text-sm text-slate-400 mt-0.5">Abone yönetimi ve kampanyalar</p>
      </div>

      <div className="flex gap-1 bg-slate-800/60 rounded-xl p-1 border border-slate-700/50 w-fit">
        {(["subscribers", "campaigns"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              tab === t ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"
            }`}>
            {t === "subscribers" ? "Aboneler" : "Kampanyalar"}
          </button>
        ))}
      </div>

      {tab === "subscribers" ? <SubscribersTab /> : <CampaignsTab />}
    </div>
  );
}
