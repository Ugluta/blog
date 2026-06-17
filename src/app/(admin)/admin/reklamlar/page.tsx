import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tv, Plus, Eye, MousePointer } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reklamlar' };

const POSITION_LABELS: Record<string, string> = {
  HEADER: 'Üst (Header)',
  SIDEBAR_LEFT: 'Sol Sidebar',
  SIDEBAR_RIGHT: 'Sağ Sidebar',
  CONTENT_TOP: 'İçerik Üstü',
  CONTENT_BOTTOM: 'İçerik Altı',
  FOOTER: 'Alt (Footer)',
  POPUP: 'Popup',
  BETWEEN_CONTENT: 'İçerik Arası',
};

export default async function ReklamlarPage() {
  const ads = await db.advertisement.findMany({
    orderBy: [{ isActive: 'desc' }, { sortOrder: 'asc' }],
  });

  const totalViews = ads.reduce((s, a) => s + a.viewCount, 0);
  const totalClicks = ads.reduce((s, a) => s + a.clickCount, 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Tv className="w-5 h-5" /> Reklamlar
          </h1>
          <p className="text-gray-500 text-sm">{ads.length} reklam</p>
        </div>
        <Link href="/admin/reklamlar/yeni" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Reklam Ekle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Toplam Görüntüleme</p>
          <p className="text-2xl font-bold mt-1">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Toplam Tıklama</p>
          <p className="text-2xl font-bold mt-1">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Ortalama CTR</p>
          <p className="text-2xl font-bold mt-1">{ctr}%</p>
        </div>
      </div>

      <div className="grid gap-4">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {ad.imageUrl && (
                <img src={ad.imageUrl} alt={ad.title} className="w-16 h-12 object-cover rounded-lg bg-gray-100" />
              )}
              <div>
                <p className="font-medium text-gray-900">{ad.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{POSITION_LABELS[ad.position] || ad.position}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{ad.viewCount.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MousePointer className="w-3 h-3" />{ad.clickCount.toLocaleString()}</span>
                </div>
                {(ad.startDate || ad.endDate) && (
                  <p className="text-xs text-gray-400 mt-1">
                    {ad.startDate && `Başlangıç: ${formatDate(ad.startDate)}`}
                    {ad.endDate && ` · Bitiş: ${formatDate(ad.endDate)}`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={ad.isActive ? 'success' : 'secondary'}>{ad.isActive ? 'Aktif' : 'Pasif'}</Badge>
              <Link href={`/admin/reklamlar/${ad.id}`} className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg">Düzenle</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
