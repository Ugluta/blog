'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, X, CheckCircle, Loader2, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/utils';

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

export default function DosyaYuklePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<{ filePath: string; fileSize: number; fileType: string; mimeType: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    subjectId: '',
    gradeId: '',
    schoolTypes: [] as string[],
    tags: '',
    isPremium: false,
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) selectFile(dropped);
  };

  const selectFile = async (f: File) => {
    setFile(f);
    if (!form.title) setForm((prev) => ({ ...prev, title: f.name.replace(/\.[^/.]+$/, '') }));
    // Auto-upload
    setUploading(true);
    const fd = new FormData();
    fd.append('file', f);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.success) {
      setUploaded(data.data);
    } else {
      alert(data.error || 'Yükleme hatası');
      setFile(null);
    }
  };

  const toggleSchoolType = (value: string) => {
    setForm((prev) => ({
      ...prev,
      schoolTypes: prev.schoolTypes.includes(value)
        ? prev.schoolTypes.filter((s) => s !== value)
        : [...prev.schoolTypes, value],
    }));
  };

  const submit = async () => {
    if (!uploaded || !form.title) return;
    setSaving(true);
    const res = await fetch('/api/dosyalar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        ...uploaded,
        fileName: file?.name,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      router.push('/admin/dosyalar');
    } else {
      alert(data.error || 'Kaydetme hatası');
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Upload className="w-5 h-5" /> Dosya Yükle
        </h1>
        <p className="text-gray-500 text-sm">Maksimum 50MB, PDF, Word, Excel, PowerPoint, Resim, ZIP</p>
      </div>

      {/* Drop Zone */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && selectFile(e.target.files[0])}
          />
          <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-700">Dosyayı sürüklep bırakın</p>
          <p className="text-sm text-gray-400 mt-1">veya tıklayarak seçin</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              {uploading ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> : <FileText className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {uploaded && <CheckCircle className="w-5 h-5 text-green-500" />}
            <button onClick={() => { setFile(null); setUploaded(null); }} className="p-1 text-gray-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Metadata Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Başlık *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dosya başlığı" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Açıklama</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Kısa açıklama..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Okul Türü</label>
          <div className="flex flex-wrap gap-2">
            {SCHOOL_TYPES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleSchoolType(s.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  form.schoolTypes.includes(s.value)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Etiketler (virgülle ayırın)</label>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="matematik, sınav, 8.sınıf" />
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer">
            <input type="checkbox" checked={form.isPremium} onChange={(e) => setForm({ ...form, isPremium: e.target.checked })} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
          <span className="text-sm text-gray-700">Premium içerik (sadece ücretli üyeler indirebilir)</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={submit} disabled={!uploaded || !form.title} loading={saving}>
          <CheckCircle className="w-4 h-4" /> Onaya Gönder
        </Button>
        <Button variant="outline" onClick={() => router.push('/admin/dosyalar')}>İptal</Button>
      </div>
    </div>
  );
}
