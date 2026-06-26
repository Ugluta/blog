'use client';
import { useState } from 'react';
import { Twitter, Facebook, Instagram, CheckCircle, XCircle, Clock, ExternalLink, Send } from 'lucide-react';

type PublisherJob = { platform: string; status: string; postUrl: string | null };
type NewsItem = {
  id: string; title: string; slug: string; status: string;
  isAiGenerated: boolean; sourceUrl: string | null; sourceName: string | null;
  image: string | null; excerpt: string | null; tags: string[];
  createdAt: string; publishedAt: string | null;
  publisherJobs: PublisherJob[];
};
type SocialAccount = { id: string; platform: string; accountName: string };

const PLATFORM_ICON: Record<string, React.ReactNode> = {
  TWITTER: <Twitter className="w-4 h-4" />,
  FACEBOOK: <Facebook className="w-4 h-4" />,
  INSTAGRAM: <Instagram className="w-4 h-4" />,
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  PUBLISHED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-yellow-100 text-yellow-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
};

const JOB_ICON: Record<string, React.ReactNode> = {
  PUBLISHED: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  FAILED: <XCircle className="w-3.5 h-3.5 text-red-500" />,
  PENDING: <Clock className="w-3.5 h-3.5 text-yellow-500" />,
};

export default function ContentManagementClient({
  news,
  accounts,
}: {
  news: NewsItem[];
  accounts: SocialAccount[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [results, setResults] = useState<{ account: string; status: string; postUrl?: string; error?: string }[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'ai'>('all');

  const filtered = news.filter((n) => {
    if (filter === 'draft') return n.status === 'DRAFT';
    if (filter === 'published') return n.status === 'PUBLISHED';
    if (filter === 'ai') return n.isAiGenerated || !!n.sourceUrl;
    return true;
  });

  const toggleAccount = (id: string) =>
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const handlePublish = async () => {
    if (!selected || !selectedAccounts.length) return;
    setPublishing(true);
    setResults([]);
    try {
      const res = await fetch('/api/publisher/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId: selected, accountIds: selectedAccounts }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setPublishing(false);
    }
  };

  const handleApprove = async (id: string) => {
    await fetch(`/api/haberler/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PUBLISHED', publishedAt: new Date().toISOString() }),
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">İçerik Yönetimi</h1>
          <div className="flex gap-2">
            {(['all', 'draft', 'published', 'ai'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f === 'all' ? 'Tümü' : f === 'draft' ? 'Taslak' : f === 'published' ? 'Yayında' : 'AI/Scraper'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News list */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => { setSelected(item.id); setResults([]); }}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                  selected === item.id ? 'border-blue-500 shadow-md' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {item.image && (
                    <img src={item.image} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[item.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {item.status}
                      </span>
                      {item.isAiGenerated && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">AI</span>
                      )}
                      {item.sourceUrl && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">Scraper</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {item.publisherJobs.map((job, i) => (
                        <div key={i} className="flex items-center gap-1">
                          {JOB_ICON[job.status]}
                          <span className="text-xs text-gray-500">{job.platform}</span>
                          {job.postUrl && (
                            <a href={job.postUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                              <ExternalLink className="w-3 h-3 text-blue-400" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {item.status === 'DRAFT' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApprove(item.id); }}
                      className="flex-shrink-0 text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100"
                    >
                      Onayla
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">İçerik bulunamadı</div>
            )}
          </div>

          {/* Publisher panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Sosyal Medyaya Gönder</h2>
              {!selected ? (
                <p className="text-sm text-gray-400">Soldan bir içerik seçin</p>
              ) : (
                <>
                  {accounts.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      Henüz bağlı hesap yok.{' '}
                      <a href="/admin/sosyal-medya" className="text-blue-600 underline">Hesap ekle</a>
                    </p>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {accounts.map((acc) => (
                        <label key={acc.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAccounts.includes(acc.id)}
                            onChange={() => toggleAccount(acc.id)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-gray-500">{PLATFORM_ICON[acc.platform]}</span>
                          <span className="text-sm text-gray-700">{acc.accountName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handlePublish}
                    disabled={publishing || !selectedAccounts.length}
                    className="w-full flex items-center justify-center gap-2 h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {publishing ? 'Gönderiliyor...' : 'Gönder'}
                  </button>

                  {results.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {results.map((r, i) => (
                        <div key={i} className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                          r.status === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {r.status === 'ok' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span className="font-medium">{r.account}:</span>
                          {r.status === 'ok' ? (
                            <a href={r.postUrl} target="_blank" rel="noreferrer" className="underline">Göster</a>
                          ) : (
                            <span className="truncate">{r.error}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
