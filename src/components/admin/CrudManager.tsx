'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Pencil, X, Check, Eye, EyeOff } from 'lucide-react';

export type Field = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'number' | 'checkbox' | 'code';
  placeholder?: string;
  required?: boolean;
  help?: string;
};

type Item = Record<string, unknown> & { id: string; title: string; isActive?: boolean };

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
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${endpoint}?admin=1`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm({});
    setEditId(null);
    setShowForm(false);
    setError('');
  }

  function startEdit(item: Item) {
    const f: Record<string, unknown> = { id: item.id };
    for (const fl of fields) {
      const v = item[fl.name];
      f[fl.name] = Array.isArray(v) ? (v as string[]).join(fl.name === 'features' ? '\n' : ', ') : v ?? '';
    }
    f.isActive = item.isActive !== false;
    setForm(f);
    setEditId(item.id);
    setShowForm(true);
    setError('');
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
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Kapat' : 'Yeni Ekle'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">{editId ? 'Düzenle' : 'Yeni Kayıt'}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map((fl) => (
              <div key={fl.name} className={fl.type === 'textarea' || fl.type === 'code' ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {fl.label}{fl.required && <span className="text-red-500"> *</span>}
                </label>
                {fl.type === 'textarea' || fl.type === 'code' ? (
                  <textarea
                    value={String(form[fl.name] ?? '')}
                    onChange={(e) => setForm({ ...form, [fl.name]: e.target.value })}
                    placeholder={fl.placeholder}
                    rows={fl.type === 'code' ? 8 : 3}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fl.type === 'code' ? 'font-mono' : ''}`}
                  />
                ) : fl.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={!!form[fl.name]}
                      onChange={(e) => setForm({ ...form, [fl.name]: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">{fl.placeholder ?? fl.label}</span>
                  </label>
                ) : (
                  <input
                    type={fl.type === 'number' ? 'number' : 'text'}
                    value={String(form[fl.name] ?? '')}
                    onChange={(e) => setForm({ ...form, [fl.name]: e.target.value })}
                    placeholder={fl.placeholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {fl.help && <p className="text-xs text-gray-400 mt-1">{fl.help}</p>}
              </div>
            ))}
          </div>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          <div className="flex gap-2 mt-5">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button onClick={resetForm} className="px-5 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg">
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Yükleniyor...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-400">Henüz kayıt yok.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {item.isActive !== false ? 'Aktif' : 'Pasif'}
                  </p>
                </div>
                <button onClick={() => toggleActive(item)} title="Aktiflik" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  {item.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(item)} title="Düzenle" className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(item.id)} title="Sil" className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
