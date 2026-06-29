'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AD_POSITIONS = [
  { value: 'HEADER', label: 'Header' },
  { value: 'SIDEBAR_LEFT', label: 'Sol Kenarçubuk' },
  { value: 'SIDEBAR_RIGHT', label: 'Sağ Kenarçubuk' },
  { value: 'CONTENT_TOP', label: 'İçerik Üstü' },
  { value: 'CONTENT_BOTTOM', label: 'İçerik Altı' },
  { value: 'FOOTER', label: 'Footer' },
  { value: 'POPUP', label: 'Pop-up' },
  { value: 'BETWEEN_CONTENT', label: 'İçerik Araları' },
];

export default function ReklamDuzenlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', position: 'SIDEBAR_RIGHT', imageUrl: '', linkUrl: '',
    htmlCode: '', adCode: '', width: '', height: '',
    startDate: '', endDate: '', isActive: true, sortOrder: 0,
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/reklamlar/${id}`).then((r) => r.json()).then((data) => {
      setForm({
        title: data.title || '',
        position: data.position || 'SIDEBAR_RIGHT',
        imageUrl: data.imageUrl || '',
        linkUrl: data.linkUrl || '',
        htmlCode: data.htmlCode || '',
        adCode: data.adCode || '',
        width: data.width?.toString() || '',
        height: data.height?.toString() || '',
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
        isActive: data.isActive !== false,
        sortOrder: data.sortOrder || 0,
      });
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/reklamlar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.push('/admin/reklamlar');
  };

  const handleDelete = async () => {
    if (!confirm('Bu reklamı silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/reklamlar/${id}`, { method: 'DELETE' });
    router.push('/admin/reklamlar');
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Yükleniyor…</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5" /> Reklam Düzenle
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-700">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık</label>
          <input value={form.title} onChange={(e) => set('title', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konum</label>
            <select value={form.position} onChange={(e) => set('position', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {AD_POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sıralama</label>
            <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Resim URL</label>
          <input value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bağlantı URL</label>
          <input value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">HTML Kodu</label>
          <textarea value={form.htmlCode} onChange={(e) => set('htmlCode', e.target.value)}
            rows={4} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Reklam Kodu</label>
          <textarea value={form.adCode} onChange={(e) => set('adCode', e.target.value)}
            rows={4} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Genişlik</label>
            <input type="number" value={form.width} onChange={(e) => set('width', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Yükseklik</label>
            <input type="number" value={form.height} onChange={(e) => set('height', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlangıç</label>
            <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bitiş</label>
            <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)}
            className="w-4 h-4 rounded text-blue-600" />
          <span className="text-sm">Aktif</span>
        </label>
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>İptal</Button>
      </div>
    </div>
  );
}
