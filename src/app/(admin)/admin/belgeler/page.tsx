'use client';
import { useState, useEffect, useCallback } from 'react';
import { FileEdit, Plus, Sparkles, Save, Trash2, Eye, Pencil, X, Search, Database, CircleCheck, FileClock } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { formatDate } from '@/lib/utils';

const TEMPLATES = [
  { id: 'yillik-plan', label: 'Yıllık Plan', emoji: '📅', desc: 'MEB formatında yıllık ders planı' },
  { id: 'unite-plan', label: 'Ünite Planı', emoji: '📋', desc: 'Kazanım bazlı ünite planı' },
  { id: 'ders-plan', label: 'Ders Planı', emoji: '✏️', desc: 'Günlük ders planı' },
  { id: 'rapor', label: 'Rapor', emoji: '📊', desc: 'Okul rapor şablonu' },
  { id: 'form', label: 'Form', emoji: '📝', desc: 'Resmi form şablonu' },
  { id: 'diger', label: 'Diğer', emoji: '📄', desc: 'Serbest doküman' },
];

interface DocItem {
  id: string;
  title: string;
  status: string;
  isAiGenerated: boolean;
  template?: string;
  content?: string;
  updatedAt: string;
}

export default function BelgelerPage() {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [form, setForm] = useState({ title: '', content: '', aiPrompt: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [q, setQ] = useState('');
  const [viewDoc, setViewDoc] = useState<DocItem | null>(null);

  const load = useCallback(() => {
    fetch('/api/belgeler').then((r) => r.json()).then((d) => setDocuments(d.data || []));
  }, []);

  useEffect(() => { load(); }, [load]);

  function startCreate(template = '') {
    setForm({ title: '', content: '', aiPrompt: '' });
    setSelectedTemplate(template);
    setUseAI(false);
    setEditId(null);
    setMode('create');
  }

  async function startEdit(id: string) {
    const res = await fetch(`/api/belgeler/${id}`);
    const data = await res.json();
    const doc = data.data ?? data;
    setForm({ title: doc.title ?? '', content: doc.content ?? '', aiPrompt: doc.aiPrompt ?? '' });
    setSelectedTemplate(doc.template ?? '');
    setUseAI(!!doc.isAiGenerated);
    setEditId(id);
    setMode('edit');
  }

  async function openView(id: string) {
    const res = await fetch(`/api/belgeler/${id}`);
    const data = await res.json();
    setViewDoc(data.data ?? data);
  }

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
    const payload = { ...form, template: selectedTemplate, status, isAiGenerated: useAI };
    if (editId) {
      await fetch(`/api/belgeler/${editId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      await fetch('/api/belgeler', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    setSaving(false);
    load();
    setMode('list');
    setEditId(null);
    setForm({ title: '', content: '', aiPrompt: '' });
  };

  const remove = async (id: string) => {
    if (!confirm('Belge silinsin mi?')) return;
    await fetch(`/api/belgeler/${id}`, { method: 'DELETE' });
    load();
  };

  const tplLabel = (id?: string) => TEMPLATES.find((t) => t.id === id)?.label ?? '—';
  const filtered = documents.filter((d) => d.title.toLowerCase().includes(q.toLowerCase()));
  const publishedCount = documents.filter((d) => d.status === 'PUBLISHED').length;

  // ---------- LIST ----------
  if (mode === 'list') {
    return (
      <div>
        <PageHeader title="Belge Yönetimi" breadcrumb={[{ label: 'Belgeler' }]} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Toplam Belge', value: documents.length, Icon: Database, color: 'text-blue-600 bg-blue-50' },
            { label: 'Yayında', value: publishedCount, Icon: CircleCheck, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Taslak', value: documents.length - publishedCount, Icon: FileClock, color: 'text-amber-600 bg-amber-50' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold text-gray-900 leading-none">{value}</p><p className="text-xs text-gray-500 mt-1">{label}</p></div>
            </div>
          ))}
        </div>

        {/* Template quick-create */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => startCreate(t.id)} title={t.desc}
              className="p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-center transition-all">
              <div className="text-2xl mb-1">{t.emoji}</div>
              <p className="text-xs font-medium text-gray-700">{t.label}</p>
            </button>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 mr-auto">Tüm Belgeler</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara..."
                className="w-full sm:w-56 h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
            </div>
            <button onClick={() => startCreate()} className="inline-flex items-center justify-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shrink-0">
              <Plus className="w-4 h-4" /> Yeni Belge
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <FileEdit className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              {q ? 'Sonuç bulunamadı.' : 'Henüz belge yok.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">
                    <th className="px-4 py-3 w-12">#</th>
                    <th className="px-4 py-3">Başlık</th>
                    <th className="px-4 py-3 hidden sm:table-cell w-32">Şablon</th>
                    <th className="px-4 py-3 hidden sm:table-cell w-28">Durum</th>
                    <th className="px-4 py-3 hidden md:table-cell w-32">Tarih</th>
                    <th className="px-4 py-3 w-32 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((doc, i) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-800">{doc.title}</p>
                          {doc.isAiGenerated && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">AI</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-500">{tplLabel(doc.template)}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          doc.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${doc.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {doc.status === 'PUBLISHED' ? 'Yayında' : doc.status === 'DRAFT' ? 'Taslak' : 'Arşiv'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{formatDate(doc.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openView(doc.id)} title="Görüntüle" className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => startEdit(doc.id)} title="Düzenle" className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => remove(doc.id)} title="Sil" className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View modal */}
        {viewDoc && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto bg-black/50" onClick={() => setViewDoc(null)}>
            <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">{viewDoc.title}</h2>
                <button onClick={() => setViewDoc(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">{viewDoc.content || 'Boş belge'}</pre>
              </div>
              <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
                <button onClick={() => { const id = viewDoc.id; setViewDoc(null); startEdit(id); }} className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"><Pencil className="w-4 h-4" /> Düzenle</button>
                <button onClick={() => setViewDoc(null)} className="px-5 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg">Kapat</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- CREATE / EDIT ----------
  return (
    <div>
      <PageHeader
        title={editId ? 'Belge Düzenle' : (selectedTemplate ? `${tplLabel(selectedTemplate)} Oluştur` : 'Yeni Belge')}
        breadcrumb={[{ label: 'Belgeler', href: '/admin/belgeler' }, { label: editId ? 'Düzenle' : 'Yeni' }]}
        action={
          <button onClick={() => { setMode('list'); setEditId(null); }} className="text-sm text-gray-500 hover:text-blue-600">← Listeye Dön</button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Belge Başlığı</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Belge başlığı girin..." />
            </div>

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
                <textarea value={form.aiPrompt} onChange={(e) => setForm({ ...form, aiPrompt: e.target.value })} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Örnek: 8. sınıf matematik trigonometri konusu için 10 kazanımlı yıllık plan oluştur..." />
                <button onClick={generateWithAI} disabled={!form.aiPrompt || generating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg">
                  <Sparkles className="w-4 h-4" /> {generating ? 'Üretiliyor...' : 'Belge Üret'}
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">İçerik</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={18}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                placeholder="Belge içeriğini buraya yazın..." />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Kaydet</h3>
            <button onClick={() => save('PUBLISHED')} disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg">
              <Eye className="w-4 h-4" /> Yayınla
            </button>
            <button onClick={() => save('DRAFT')} disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg">
              <Save className="w-4 h-4" /> Taslak Kaydet
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şablon</label>
            <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Şablon seç...</option>
              {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
