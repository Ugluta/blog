'use client';
import { useState, useEffect } from 'react';
import { Bot, Plus, Play, Globe, CheckCircle, XCircle, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface ScraperSource {
  id: string;
  name: string;
  url: string;
  selector?: string;
  isActive: boolean;
  autoPublish: boolean;
  contentType: string;
  lastScraped?: string;
  jobs: Array<{ id: string; status: string; itemsFound: number; itemsSaved: number; createdAt: string }>;
}

export default function ScraperPage() {
  const [sources, setSources] = useState<ScraperSource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', url: '', selector: '', titleSelector: '', autoPublish: false, contentType: 'NEWS',
  });

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = () => {
    fetch('/api/scraper').then((r) => r.json()).then((d) => setSources(d.data || []));
  };

  const save = async () => {
    await fetch('/api/scraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ name: '', url: '', selector: '', titleSelector: '', autoPublish: false, contentType: 'NEWS' });
    loadSources();
  };

  const runScraper = async (sourceId: string) => {
    setRunning(sourceId);
    try {
      const res = await fetch('/api/scraper/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      });
      const data = await res.json();
      alert(`Tamamlandı! Bulunan: ${data.found}, Kaydedilen: ${data.saved}`);
    } catch {
      alert('Hata oluştu');
    }
    setRunning(null);
    loadSources();
  };

  const toggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/scraper/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    loadSources();
  };

  const remove = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/scraper/${id}`, { method: 'DELETE' });
    loadSources();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5" /> AI Scraper
          </h1>
          <p className="text-gray-500 text-sm">Hedef siteleri tarayıp içerik çek</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm"><Plus className="w-4 h-4" /> Kaynak Ekle</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold mb-4">Yeni Scraper Kaynağı</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Kaynak Adı</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MEB Haberler" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">URL</label>
              <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">CSS Selector (içerik)</label>
              <input value={form.selector} onChange={(e) => setForm({ ...form, selector: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="article, .haber-item" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Başlık Selector</label>
              <input value={form.titleSelector} onChange={(e) => setForm({ ...form, titleSelector: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="h2, .baslik" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">İçerik Türü</label>
              <select value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="NEWS">Haber</option>
                <option value="ANNOUNCEMENT">Duyuru</option>
                <option value="LEGISLATION">Mevzuat</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" checked={form.autoPublish}
                  onChange={(e) => setForm({ ...form, autoPublish: e.target.checked })}
                  className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
              <span className="text-sm text-gray-700">Otomatik yayınla</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={save}>Kaydet</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>İptal</Button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {sources.map((source) => (
          <div key={source.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${source.isActive ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <Globe className={`w-5 h-5 ${source.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{source.name}</p>
                  <a href={source.url} target="_blank" className="text-xs text-blue-600 hover:underline">{source.url}</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(source.id, source.isActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${source.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {source.isActive ? 'Aktif' : 'Pasif'}
                </button>
                <Button
                  size="sm"
                  onClick={() => runScraper(source.id)}
                  loading={running === source.id}
                  disabled={!source.isActive}
                >
                  <Play className="w-3.5 h-3.5" /> Çalıştır
                </Button>
                <button onClick={() => remove(source.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span className="text-gray-500">
                Son tarama: {source.lastScraped ? formatDate(source.lastScraped) : 'Hiç yapılmadı'}
              </span>
              {source.autoPublish && <span className="text-green-600 text-xs">Otomatik yayın açık</span>}
            </div>

            {source.jobs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-xs font-semibold text-gray-500 mb-2">Son İşler</p>
                <div className="space-y-1">
                  {source.jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center gap-3 text-xs">
                      {job.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                      {job.status === 'failed' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                      {job.status === 'running' && <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
                      {job.status === 'pending' && <Clock className="w-3.5 h-3.5 text-gray-400" />}
                      <span className="text-gray-600">
                        {job.itemsFound} bulundu, {job.itemsSaved} kaydedildi · {formatDate(job.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
