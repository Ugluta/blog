import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/admin/PageHeader';
import { NewsRowActions } from '@/components/admin/NewsRowActions';
import Link from 'next/link';
import { Plus, Eye, Bot, Database, CircleCheck, FileClock } from 'lucide-react';
import type { Metadata } from 'next';
import type { ContentStatus, ContentType } from '@prisma/client';

export const metadata: Metadata = { title: 'Blog / Haberler' };
export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<ContentStatus, string> = {
  PUBLISHED: 'Yayında', DRAFT: 'Taslak', ARCHIVED: 'Arşiv', SCHEDULED: 'Planlandı',
};
const TYPE_LABELS: Record<ContentType, string> = {
  NEWS: 'Haber', ANNOUNCEMENT: 'Duyuru', LEGISLATION: 'Mevzuat', BLOG: 'Blog', PAGE: 'Sayfa',
};

export default async function HaberlerPage({
  searchParams,
}: {
  searchParams: Promise<{ sayfa?: string; tur?: string; durum?: string }>;
}) {
  const { sayfa, tur } = await searchParams;
  const page = Number(sayfa) || 1;
  const perPage = 25;
  const type = tur as ContentType;

  const where = { ...(type && { type }) };

  const [news, total, publishedCount, draftCount] = await Promise.all([
    db.news.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.news.count(),
    db.news.count({ where: { status: 'PUBLISHED' } }),
    db.news.count({ where: { status: 'DRAFT' } }),
  ]);

  const stats = [
    { label: 'Toplam İçerik', value: total, Icon: Database, color: 'text-blue-600 bg-blue-50' },
    { label: 'Yayında', value: publishedCount, Icon: CircleCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Taslak', value: draftCount, Icon: FileClock, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div>
      <PageHeader title="Blog / Haberler" breadcrumb={[{ label: 'İçerik' }]} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
            <div><p className="text-2xl font-bold text-gray-900 leading-none">{value.toLocaleString('tr-TR')}</p><p className="text-xs text-gray-500 mt-1">{label}</p></div>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-gray-100">
          {/* Type filter */}
          <div className="flex flex-wrap gap-1.5 mr-auto">
            {(['', 'BLOG', 'NEWS', 'ANNOUNCEMENT', 'LEGISLATION'] as (ContentType | '')[]).map((t) => (
              <Link key={t || 'all'} href={t ? `/admin/haberler?tur=${t}` : '/admin/haberler'}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  (type || '') === t ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                {t ? TYPE_LABELS[t as ContentType] : 'Tümü'}
              </Link>
            ))}
          </div>
          <Link href="/admin/scraper" className="inline-flex items-center justify-center gap-1.5 h-9 px-3 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 shrink-0">
            <Bot className="w-4 h-4" /> AI Scraper
          </Link>
          <Link href="/admin/haberler/yeni" className="inline-flex items-center justify-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shrink-0">
            <Plus className="w-4 h-4" /> Yeni Yazı
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Henüz içerik yok. “Yeni Yazı” ile başla.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-4 py-3 w-12">#</th>
                  <th className="px-4 py-3">Başlık</th>
                  <th className="px-4 py-3 hidden md:table-cell w-24">Tür</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Yazar</th>
                  <th className="px-4 py-3 hidden sm:table-cell w-28">Durum</th>
                  <th className="px-4 py-3 hidden lg:table-cell w-24">Görüntülenme</th>
                  <th className="px-4 py-3 hidden md:table-cell w-32">Tarih</th>
                  <th className="px-4 py-3 w-32 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {news.map((item, i) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400">{(page - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 max-w-md">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                        {item.isAiGenerated && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 shrink-0">AI</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{TYPE_LABELS[item.type]}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-500">{item.author.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : item.status === 'DRAFT' ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'PUBLISHED' ? 'bg-emerald-500' : item.status === 'DRAFT' ? 'bg-gray-400' : 'bg-amber-500'}`} />
                        {STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-sm text-gray-500"><Eye className="w-3.5 h-3.5" />{item.viewCount}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <NewsRowActions id={item.id} slug={item.slug} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
