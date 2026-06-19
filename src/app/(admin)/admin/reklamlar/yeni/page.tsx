'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Megaphone } from 'lucide-react';
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

export default function YeniReklamPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', position: 'SIDEBAR_RIGHT', imageUrl: '', linkUrl: '',
    htmlCode: '', adCode: '', width: '', height: '',
    startDate: '', endDate: '', isActive: true, sortOrder: 0,
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/reklamlar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        width: form.width ? Number(form.width) : null,
        height: form.height ? Number(form.height) : null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      }),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/reklamlar');
    else { const err = await res.json(); alert(err.error || 'Hata'); }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Megaphone className="w-5 h-5" /> Yeni Reklam
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık *</label>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Reklam başlığı" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Konum *</label>
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
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://…" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bağlantı URL</label>
          <input value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://…" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">HTML Kodu</label>
          <textarea value={form.htmlCode} onChange={(e) => set('htmlCode', e.target.value)}
            rows={4} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="&lt;div&gt;...&lt;/div&gt;" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Reklam Kodu (AdSense vb.)</label>
          <textarea value={form.adCode} onChange={(e) => set('adCode', e.target.value)}
            rows={4} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="&lt;ins class=\"adsbygoogle\"..." />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Genişlik (px)</label>
            <input type="number" value={form.width} onChange={(e) => set('width', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="728" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Yükseklik (px)</label>
            <input type="number" value={form.height} onChange={(e) => set('height', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="90" />
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

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
        </div>
      </form>
    </div>
  );
}
