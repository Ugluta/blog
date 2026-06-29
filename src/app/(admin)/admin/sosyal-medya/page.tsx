'use client';
import { useState, useEffect } from 'react';
import { Twitter, Facebook, Instagram, Plus, Trash2, CheckCircle } from 'lucide-react';

type Account = {
  id: string; platform: string; accountName: string;
  accountId: string | null; isActive: boolean;
  tokenExpiry: string | null; createdAt: string;
};

const PLATFORMS = [
  { value: 'TWITTER', label: 'Twitter / X', icon: <Twitter className="w-5 h-5" />, color: 'bg-black text-white' },
  { value: 'FACEBOOK', label: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'bg-[#1877F2] text-white' },
  { value: 'INSTAGRAM', label: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' },
];

export default function SosyalMedyaPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    platform: 'TWITTER', accountName: '', accountId: '',
    accessToken: '', refreshToken: '', pageId: '', igUserId: '',
  });

  const loadAccounts = async () => {
    const res = await fetch('/api/publisher/accounts');
    if (res.ok) setAccounts(await res.json());
  };

  useEffect(() => { loadAccounts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const metadata: Record<string, string> = {};
    if (form.pageId) metadata.pageId = form.pageId;
    if (form.igUserId) metadata.igUserId = form.igUserId;

    await fetch('/api/publisher/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: form.platform, accountName: form.accountName,
        accountId: form.accountId || undefined,
        accessToken: form.accessToken,
        refreshToken: form.refreshToken || undefined,
        metadata,
      }),
    });
    setLoading(false);
    setShowForm(false);
    setForm({ platform: 'TWITTER', accountName: '', accountId: '', accessToken: '', refreshToken: '', pageId: '', igUserId: '' });
    loadAccounts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hesabı silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/publisher/accounts?id=${id}`, { method: 'DELETE' });
    loadAccounts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sosyal Medya Hesapları</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Hesap Ekle
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Yeni Hesap Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
                >
                  {PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Adı</label>
                  <input required value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                    placeholder="@kullaniciadi" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account / User ID</label>
                  <input value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                    placeholder="Opsiyonel" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <input required type="password" value={form.accessToken} onChange={(e) => setForm({ ...form, accessToken: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refresh Token (Opsiyonel)</label>
                <input type="password" value={form.refreshToken} onChange={(e) => setForm({ ...form, refreshToken: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
              </div>
              {form.platform === 'FACEBOOK' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page ID</label>
                  <input required={form.platform === 'FACEBOOK'} value={form.pageId}
                    onChange={(e) => setForm({ ...form, pageId: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
                </div>
              )}
              {form.platform === 'INSTAGRAM' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram User ID (Business)</label>
                  <input required={form.platform === 'INSTAGRAM'} value={form.igUserId}
                    onChange={(e) => setForm({ ...form, igUserId: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
                </div>
              )}
              <div className="flex gap-3">
                <button type="submit" disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60">
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">İptal</button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {accounts.map((acc) => {
            const p = PLATFORMS.find((x) => x.value === acc.platform);
            return (
              <div key={acc.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p?.color ?? 'bg-gray-200'}`}>
                  {p?.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{acc.accountName}</span>
                    {acc.isActive && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className="text-xs text-gray-400">
                    {p?.label}{acc.accountId ? ` · ${acc.accountId}` : ''}
                    {acc.tokenExpiry ? ` · Token: ${new Date(acc.tokenExpiry).toLocaleDateString('tr')}` : ''}
                  </p>
                </div>
                <button onClick={() => handleDelete(acc.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {accounts.length === 0 && !showForm && (
            <div className="text-center py-12 text-gray-400">Henüz hesap eklenmedi</div>
          )}
        </div>
      </div>
    </div>
  );
}
