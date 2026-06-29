'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, Pencil, X, Check, Eye, EyeOff, Search, Database, CircleCheck, CircleSlash, Upload } from 'lucide-react';
import { PageHeader } from './PageHeader';

export type Field = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'number' | 'checkbox' | 'code' | 'image';
  placeholder?: string;
  required?: boolean;
  help?: string;
};

type Item = Record<string, unknown> & { id: string; title: string; isActive?: boolean; sortOrder?: number };

export function CrudManager({
  endpoint, title, subtitle, fields,
}: {
  endpoint: string;
  title: string;
  subtitle: string;
  fields: Field[];
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${endpoint}?admin=1`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(
    () => items.filter((i) => (i.title ?? '').toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );
  const activeCount = items.filter((i) => i.isActive !== false).length;
  const passiveCount = items.length - activeCount;

  function resetForm() { setForm({}); setEditId(null); setShowForm(false); setError(''); }
  function openNew() { setForm({}); setEditId(null); setError(''); setShowForm(true); }

  function startEdit(item: Item) {
    const f: Record<string, unknown> = {};
    for (const fl of fields) {
      const v = item[fl.name];
      f[fl.name] = Array.isArray(v) ? (v as string[]).join(fl.name === 'features' ? '\n' : ', ') : v ?? '';
    }
    f.isActive = item.isActive !== false;
    setForm(f);
    setEditId(item.id);
    setError('');
    setShowForm(true);
  }

  async function uploadImage(name: string, file: File) {
    setUploading(name);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (d.success && d.data?.filePath) {
        setForm((f) => ({ ...f, [name]: d.data.filePath }));
      } else {
        alert(d.error || 'Yükleme hatası');
      }
    } catch {
      alert('Yükleme hatası');
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editId ?? undefined }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Kaydedilemedi');
      }
      resetForm();
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hata');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Silinsin mi?')) return;
    await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
    load();
  }

  async function toggleActive(item: Item) {
    const body: Record<string, unknown> = { id: item.id, isActive: !(item.isActive !== false) };
    for (const fl of fields) body[fl.name] = item[fl.name];
    await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    load();
  }

  const stats = [
    { label: 'Toplam', value: items.length, Icon: Database, color: 'text-blue-600 bg-blue-50' },
    { label: 'Aktif', value: activeCount, Icon: CircleCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pasif', value: passiveCount, Icon: CircleSlash, color: 'text-gray-500 bg-gray-100' },
  ];

  return (
    <div>
      <PageHeader title={title} breadcrumb={[{ label: title }]} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
            <div><p className="text-2xl font-bold text-gray-900 leading-none">{value}</p><p className="text-xs text-gray-500 mt-1">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 mr-auto">{subtitle}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara..."
              className="w-full sm:w-56 h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
          </div>
          <button onClick={openNew} className="inline-flex items-center justify-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Yeni Ekle
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">{q ? 'Sonuç bulunamadı.' : 'Henüz kayıt yok. “Yeni Ekle” ile başla.'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-4 py-3 w-12">#</th>
                  <th className="px-4 py-3">Başlık</th>
                  <th className="px-4 py-3 hidden sm:table-cell w-28">Durum</th>
                  <th className="px-4 py-3 hidden md:table-cell w-20">Sıra</th>
                  <th className="px-4 py-3 w-32 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item, i) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3"><p className="text-sm font-medium text-gray-800">{item.title}</p></td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${item.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isActive !== false ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {item.isActive !== false ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{item.sortOrder ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleActive(item)} title="Aktiflik" className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">{item.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                        <button onClick={() => startEdit(item)} title="Düzenle" className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(item.id)} title="Sil" className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto bg-black/50" onClick={resetForm}>
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editId ? 'Düzenle' : 'Yeni Kayıt'}</h2>
              <button onClick={resetForm} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {fields.map((fl) => (
                <div key={fl.name} className={fl.type === 'textarea' || fl.type === 'code' || fl.type === 'image' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {fl.label}{fl.required && <span className="text-red-500"> *</span>}
                  </label>
                  {fl.type === 'textarea' || fl.type === 'code' ? (
                    <textarea value={String(form[fl.name] ?? '')} onChange={(e) => setForm({ ...form, [fl.name]: e.target.value })} placeholder={fl.placeholder} rows={fl.type === 'code' ? 8 : 3}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fl.type === 'code' ? 'font-mono' : ''}`} />
                  ) : fl.type === 'image' ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input type="text" value={String(form[fl.name] ?? '')} onChange={(e) => setForm({ ...form, [fl.name]: e.target.value })} placeholder={fl.placeholder ?? 'URL veya dosya yükle'}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer shrink-0">
                          <Upload className="w-4 h-4" /> {uploading === fl.name ? 'Yükleniyor...' : 'Yükle'}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(fl.name, f); }} />
                        </label>
                      </div>
                      {form[fl.name] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={String(form[fl.name])} alt="önizleme" className="h-28 rounded-lg border border-gray-200 object-cover" />
                      ) : null}
                    </div>
                  ) : fl.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 mt-2">
                      <input type="checkbox" checked={!!form[fl.name]} onChange={(e) => setForm({ ...form, [fl.name]: e.target.checked })} className="w-4 h-4" />
                      <span className="text-sm text-gray-600">{fl.placeholder ?? fl.label}</span>
                    </label>
                  ) : (
                    <input type={fl.type === 'number' ? 'number' : 'text'} value={String(form[fl.name] ?? '')} onChange={(e) => setForm({ ...form, [fl.name]: e.target.value })} placeholder={fl.placeholder}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  )}
                  {fl.help && <p className="text-xs text-gray-400 mt-1">{fl.help}</p>}
                </div>
              ))}
              {error && <p className="sm:col-span-2 text-sm text-red-500">{error}</p>}
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
                <Check className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button onClick={resetForm} className="px-5 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg">İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
