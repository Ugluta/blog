'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Library, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ARCHIVE_TYPES = [
  { value: 'CURRICULUM', label: 'Müfredat' },
  { value: 'ANNUAL_PLAN', label: 'Yıllık Plan' },
  { value: 'UNIT_PLAN', label: 'Ünite Planı' },
  { value: 'LESSON_PLAN', label: 'Ders Planı' },
  { value: 'TEMPLATE', label: 'Şablon' },
  { value: 'GUIDE', label: 'Kılavuz' },
];

const SCHOOL_TYPES = [
  { value: 'ANAOKULU', label: 'Anaokulu' },
  { value: 'ILKOKUL', label: 'İlkokul' },
  { value: 'ORTAOKUL', label: 'Ortaokul' },
  { value: 'LISE', label: 'Lise' },
  { value: 'IMAM_HATIP', label: 'İmam Hatip' },
  { value: 'MESLEK_LISESI', label: 'Meslek Lisesi' },
  { value: 'OZEL_EGITIM', label: 'Özel Eğitim' },
  { value: 'UNIVERSITE', label: 'Üniversite' },
  { value: 'GENEL', label: 'Genel' },
];

export default function ArsivYeniPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', description: '', type: 'CURRICULUM',
    content: '', fileUrl: '', schoolTypes: [] as string[],
    gradeLevel: '', subject: '', year: new Date().getFullYear(),
    isTemplate: false, isActive: true,
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const toggleSchoolType = (val: string) => {
    setForm((f) => ({
      ...f,
      schoolTypes: f.schoolTypes.includes(val)
        ? f.schoolTypes.filter((s) => s !== val)
        : [...f.schoolTypes, val],
    }));
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.type) return;
    setSaving(true);
    const payload = { ...form, slug: form.slug || generateSlug(form.title) };
    const res = await fetch('/api/arsiv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/arsiv');
    else { const err = await res.json(); alert(err.error || 'Hata'); }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Library className="w-5 h-5" /> Yeni Arşiv Öğesi
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık *</label>
          <input required value={form.title}
            onChange={(e) => { set('title', e.target.value); if (!form.slug) set('slug', generateSlug(e.target.value)); }}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Belge başlığı" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="url-slug" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tür *</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {ARCHIVE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
            rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kısa açıklama" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Dosya URL</label>
          <input value={form.fileUrl} onChange={(e) => set('fileUrl', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://…" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sınıf Seviyesi</label>
            <input value={form.gradeLevel} onChange={(e) => set('gradeLevel', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8. Sınıf" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ders</label>
            <input value={form.subject} onChange={(e) => set('subject', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Matematik" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Yıl</label>
            <input type="number" value={form.year} onChange={(e) => set('year', Number(e.target.value))}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Okul Türleri</label>
          <div className="flex flex-wrap gap-2">
            {SCHOOL_TYPES.map((s) => (
              <button key={s.value} type="button" onClick={() => toggleSchoolType(s.value)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  form.schoolTypes.includes(s.value)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}>{s.label}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isTemplate} onChange={(e) => set('isTemplate', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600" />
            <span className="text-sm">Şablon olarak işaretle</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600" />
            <span className="text-sm">Aktif</span>
          </label>
        </div>

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
