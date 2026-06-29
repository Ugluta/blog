'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Option {
  label: string;
  text: string;
  isCorrect: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  MULTIPLE_CHOICE: 'Çoktan Seçmeli', TRUE_FALSE: 'Doğru-Yanlış',
  SHORT_ANSWER: 'Kısa Cevap', ESSAY: 'Uzun Cevap',
  FILL_BLANK: 'Boşluk Doldurma', MATCHING: 'Eşleştirme',
};

export default function YeniSoruPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [grades, setGrades] = useState<Array<{ id: string; name: string }>>([]);
  const [form, setForm] = useState({
    content: '', type: 'MULTIPLE_CHOICE', difficulty: 'MEDIUM',
    answer: '', explanation: '', subjectId: '', gradeId: '',
    tags: '', isPublic: true,
  });
  const [options, setOptions] = useState<Option[]>([
    { label: 'A', text: '', isCorrect: false },
    { label: 'B', text: '', isCorrect: false },
    { label: 'C', text: '', isCorrect: false },
    { label: 'D', text: '', isCorrect: false },
  ]);

  useEffect(() => {
    fetch('/api/kategoriler').then((r) => r.json()).then(setSubjects);
    fetch('/api/kategoriler?type=grades').then((r) => r.json()).then(setGrades);
  }, []);

  const addOption = () => {
    const labels = 'ABCDEFGHIJ';
    setOptions([...options, { label: labels[options.length] || String(options.length + 1), text: '', isCorrect: false }]);
  };

  const setCorrect = (i: number) => setOptions(options.map((o, idx) => ({ ...o, isCorrect: idx === i })));

  const handleAiGenerate = async () => {
    const subject = subjects.find((s) => s.id === form.subjectId)?.name || '';
    const grade = grades.find((g) => g.id === form.gradeId)?.name || '';
    if (!subject) { alert('Lütfen önce bir ders seçin'); return; }
    setAiLoading(true);
    try {
      const res = await fetch('/api/sorular/ai-olustur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject, grade, topic: form.content || 'genel',
          count: 1, type: form.type, difficulty: form.difficulty,
        }),
      });
      const data = await res.json();
      if (data.questions?.[0]) {
        const q = data.questions[0];
        setForm((f) => ({ ...f, content: q.content || f.content, answer: q.answer || '', explanation: q.explanation || '' }));
        if (q.options) setOptions(q.options);
      }
    } catch { alert('AI hatası'); }
    setAiLoading(false);
  };

  const handleSave = async () => {
    if (!form.content) { alert('Soru metni zorunlu'); return; }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      options: form.type === 'MULTIPLE_CHOICE' || form.type === 'TRUE_FALSE' ? options : null,
    };
    const res = await fetch('/api/sorular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/sorular');
    else alert('Kayıt başarısız');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-xl font-bold text-gray-900">Yeni Soru Ekle</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Soru Tipi</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Zorluk</label>
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="EASY">Kolay</option>
              <option value="MEDIUM">Orta</option>
              <option value="HARD">Zor</option>
              <option value="EXPERT">Uzman</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ders</label>
            <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seçin…</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sınıf</label>
            <select value={form.gradeId} onChange={(e) => setForm({ ...form, gradeId: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seçin…</option>
              {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">Soru Metni *</label>
            <button onClick={handleAiGenerate} disabled={aiLoading}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-50">
              {aiLoading
                ? <span className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                : <Sparkles className="w-3 h-3" />}
              AI Oluştur
            </button>
          </div>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={4} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Soru metnini buraya yazın…" />
        </div>

        {(form.type === 'MULTIPLE_CHOICE' || form.type === 'TRUE_FALSE') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Seçenekler</label>
              <button onClick={addOption} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Ekle
              </button>
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button onClick={() => setCorrect(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      opt.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-green-50'
                    }`}>{opt.label}</button>
                  <input value={opt.text}
                    onChange={(e) => setOptions(options.map((o, idx) => idx === i ? { ...o, text: e.target.value } : o))}
                    className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`${opt.label} şıkkı`} />
                  <button onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                    className="p-1.5 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Yeşil = doğru cevap</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cevap</label>
            <input value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Doğru şık / kısa cevap" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Etiketler</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="virgülle ayırın" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
          <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cevap açıklaması…" />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
            className="w-4 h-4 rounded text-blue-600" />
          <span className="text-sm text-gray-700">Herkese açık</span>
        </label>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor…' : 'Soru Kaydet'}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>İptal</Button>
      </div>
    </div>
  );
}
