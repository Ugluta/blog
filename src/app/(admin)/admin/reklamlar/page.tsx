import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/admin/PageHeader';
import { DeleteButton } from '@/components/admin/DeleteButton';
import Link from 'next/link';
import { Plus, Eye, MousePointer, Pencil } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reklamlar' };
export const dynamic = 'force-dynamic';

const POSITION_LABELS: Record<string, string> = {
  HEADER: 'Üst (Header)', SIDEBAR_LEFT: 'Sol Sidebar', SIDEBAR_RIGHT: 'Sağ Sidebar',
  CONTENT_TOP: 'İçerik Üstü', CONTENT_BOTTOM: 'İçerik Altı', FOOTER: 'Alt (Footer)',
  POPUP: 'Popup', BETWEEN_CONTENT: 'İçerik Arası',
};

export default async function ReklamlarPage() {
  const ads = await db.advertisement.findMany({ orderBy: [{ isActive: 'desc' }, { sortOrder: 'asc' }] });

  const totalViews = ads.reduce((s, a) => s + a.viewCount, 0);
  const totalClicks = ads.reduce((s, a) => s + a.clickCount, 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

  return (
    <div>
      <PageHeader title="Reklamlar" breadcrumb={[{ label: 'Sistem' }, { label: 'Reklamlar' }]}
        action={
          <Link href="/admin/reklamlar/yeni" className="inline-flex items-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4" /> Reklam Ekle
          </Link>
        } />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Toplam Görüntüleme', value: totalViews.toLocaleString('tr-TR') },
          { label: 'Toplam Tıklama', value: totalClicks.toLocaleString('tr-TR') },
          { label: 'Ortalama CTR', value: `${ctr}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {ads.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Henüz reklam yok.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {ads.map((ad) => (
              <div key={ad.id} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-4 min-w-0">
                  {ad.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ad.imageUrl} alt={ad.title} className="w-16 h-12 object-cover rounded-lg bg-gray-100 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{ad.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{POSITION_LABELS[ad.position] || ad.position}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{ad.viewCount.toLocaleString('tr-TR')}</span>
                      <span className="flex items-center gap-1"><MousePointer className="w-3 h-3" />{ad.clickCount.toLocaleString('tr-TR')}</span>
                      {(ad.startDate || ad.endDate) && <span>{ad.startDate && formatDate(ad.startDate)}{ad.endDate && ` – ${formatDate(ad.endDate)}`}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={ad.isActive ? 'success' : 'secondary'}>{ad.isActive ? 'Aktif' : 'Pasif'}</Badge>
                  <Link href={`/admin/reklamlar/${ad.id}`} title="Düzenle" className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></Link>
                  <DeleteButton endpoint={`/api/reklamlar/${ad.id}`} confirmText="Reklam silinsin mi?" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
