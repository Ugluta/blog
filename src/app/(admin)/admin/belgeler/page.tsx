'use client';
import { useState, useEffect, useCallback } from 'react';
import { FileEdit, Plus, Sparkles, Bot, Save, Trash2, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const TEMPLATES = [
  { id: 'yillik-plan', label: 'Yıllık Plan', desc: 'MEB formatında yıllık ders planı' },
  { id: 'unite-plan', label: 'Ünite Planı', desc: 'Kazanım bazlı ünite planı' },
  { id: 'ders-plan', label: 'Ders Planı', desc: 'Günlük ders planı' },
  { id: 'rapor', label: 'Rapor', desc: 'Okul rapor şablonu' },
  { id: 'form', label: 'Form', desc: 'Resmi form şablonu' },
  { id: 'diger', label: 'Diğer', desc: 'Serbest doküman' },
];

interface Document {
  id: string;
  title: string;
  status: string;
  isAiGenerated: boolean;
  template?: string;
  updatedAt: string;
}

export default function BelgelerPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [form, setForm] = useState({ title: '', content: '', aiPrompt: '', template: '' });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const load = useCallback(() => {
    fetch('/api/belgeler').then((r) => r.json()).then((d) => setDocuments(d.data || []));
  }, []);

  useEffect(() => { load(); }, [load]);

  const generateWithAI = async () => {
    if (!form.aiPrompt) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/belge-olustur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: form.aiPrompt, template: selectedTemplate }),
      });
      const data = await res.json();
      if (data.content) setForm((f) => ({ ...f, content: data.content }));
    } catch {
      alert('AI belgesi üretilemedi');
    }
    setGenerating(false);
  };

  const save = async (status = 'DRAFT') => {
    setSaving(true);
    await fetch('/api/belgeler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, template: selectedTemplate, status, isAiGenerated: useAI }),
    });
    setSaving(false);
    load();
    setMode('list');
    setForm({ title: '', content: '', aiPrompt: '', template: '' });
  };

  const remove = async (id: string) => {
    if (!confirm('Belge silinsin mi?')) return;
    await fetch(`/api/belgeler/${id}`, { method: 'DELETE' });
    load();
  };

  if (mode === 'list') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileEdit className="w-5 h-5" /> Belge Yönetimi
            </h1>
            <p className="text-gray-500 text-sm">Manuel ve AI destekli belge oluşturma</p>
          </div>
          <Button onClick={() => setMode('create')}><Plus className="w-4 h-4" /> Yeni Belge</Button>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setSelectedTemplate(t.id); setMode('create'); }}
              className="p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 text-center transition-all"
            >
              <div className="text-2xl mb-1">
                {t.id === 'yillik-plan' ? '📅' : t.id === 'unite-plan' ? '📋' : t.id === 'ders-plan' ? '✏️' : t.id === 'rapor' ? '📊' : t.id === 'form' ? '📝' : '📄'}
              </div>
              <p className="text-xs font-medium text-gray-700">{t.label}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileEdit className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Henüz belge yok</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      {doc.isAiGenerated && <Badge variant="secondary"><Bot className="w-3 h-3 mr-1" />AI</Badge>}
                      <Badge variant={doc.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                        {doc.status === 'PUBLISHED' ? 'Yayında' : doc.status === 'DRAFT' ? 'Taslak' : 'Arşiv'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{formatDate(doc.updatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => remove(doc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Create / Edit mode
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          {selectedTemplate ? `${TEMPLATES.find((t) => t.id === selectedTemplate)?.label} Oluştur` : 'Yeni Belge'}
        </h1>
        <Button variant="outline" onClick={() => setMode('list')}>Listeye Dön</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Belge Başlığı</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Belge başlığı girin..."
              />
            </div>

            {/* AI Toggle */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">AI ile Oluştur</span>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" checked={useAI} onChange={(e) => setUseAI(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>

            {useAI && (
              <div className="space-y-3">
                <label className="block text-sm font-medium">AI Talimatı</label>
                <textarea
                  value={form.aiPrompt}
                  onChange={(e) => setForm({ ...form, aiPrompt: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Örnek: 8. sınıf matematik dersi trigonometri konusu için 10 kazanımlı yıllık plan oluştur..."
                />
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={generateWithAI}
                  loading={generating}
                  disabled={!form.aiPrompt}
                >
                  <Sparkles className="w-4 h-4" /> Belge Üret
                </Button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">İçerik</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={20}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                placeholder="Belge içeriğini buraya yazın..."
              />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Kaydet</h3>
            <Button className="w-full" onClick={() => save('PUBLISHED')} loading={saving}>
              <Eye className="w-4 h-4" /> Yayınla
            </Button>
            <Button variant="outline" className="w-full" onClick={() => save('DRAFT')} loading={saving}>
              <Save className="w-4 h-4" /> Taslak Kaydet
            </Button>
          </div>

          {selectedTemplate && (
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Şablon: {TEMPLATES.find((t) => t.id === selectedTemplate)?.label}</p>
              <p className="text-xs text-blue-700">{TEMPLATES.find((t) => t.id === selectedTemplate)?.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
