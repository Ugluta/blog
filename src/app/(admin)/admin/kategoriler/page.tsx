'use client';
import { useState, useEffect } from 'react';
import { Tag, Plus, ChevronRight, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
  _count?: { files: number };
}

export default function KategorilerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', icon: '', color: '#3b82f6', parentId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/kategoriler').then((r) => r.json()).then((d) => setCategories(d.data || []));
  }, []);

  const save = async () => {
    setLoading(true);
    const method = editItem ? 'PATCH' : 'POST';
    const url = editItem ? `/api/kategoriler/${editItem.id}` : '/api/kategoriler';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setShowForm(false);
    setEditItem(null);
    setForm({ name: '', icon: '', color: '#3b82f6', parentId: '' });
    fetch('/api/kategoriler').then((r) => r.json()).then((d) => setCategories(d.data || []));
  };

  const remove = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/kategoriler/${id}`, { method: 'DELETE' });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const roots = categories.filter((c) => !c.parentId);
  const getChildren = (id: string) => categories.filter((c) => c.parentId === id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-5 h-5" /> Kategoriler
        </h1>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="w-4 h-4" /> Kategori Ekle
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">{editItem ? 'Kategori Düzenle' : 'Yeni Kategori'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad</label>
              <input className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Kategori adı" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Simge (Emoji)</label>
              <input className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="📁" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Renk</label>
              <div className="flex gap-2">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                <input className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ust Kategori</label>
              <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
                <option value="">Ana Kategori</option>
                {roots.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={save} loading={loading}>Kaydet</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditItem(null); }}>İptal</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {roots.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Henüz kategori yok</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {roots.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {cat.icon && <span className="text-xl">{cat.icon}</span>}
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#3b82f6' }} />
                    <span className="font-medium text-gray-900">{cat.name}</span>
                    <span className="text-xs text-gray-400">/{cat.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditItem(cat); setForm({ name: cat.name, icon: cat.icon || '', color: cat.color || '#3b82f6', parentId: '' }); setShowForm(true); }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(cat.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {getChildren(cat.id).map((child) => (
                  <div key={child.id} className="flex items-center justify-between px-4 py-2.5 pl-12 bg-gray-50/50 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      {child.icon && <span>{child.icon}</span>}
                      <span className="text-sm text-gray-700">{child.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => remove(child.id)} className="p-1 rounded hover:bg-red-50 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
