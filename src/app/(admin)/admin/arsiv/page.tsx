import { db } from '@/lib/db';
import { Library, Plus, Download, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SCHOOL_TYPE_LABELS } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Arşiv & Kütüphane' };

const ARCHIVE_TYPE_LABELS: Record<string, string> = {
  CURRICULUM: 'Müfredat', ANNUAL_PLAN: 'Yıllık Plan', UNIT_PLAN: 'Ünite Planı',
  LESSON_PLAN: 'Ders Planı', TEMPLATE: 'Şablon', GUIDE: 'Kılavuz',
};

export default async function AdminArsivPage() {
  const archives = await db.archive.findMany({
    orderBy: [{ isTemplate: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Library className="w-5 h-5" /> Arşiv & Kütüphane
          </h1>
          <p className="text-gray-500 text-sm">{archives.length} kaynak</p>
        </div>
        <Link href="/admin/arsiv/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Kaynak Ekle
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {archives.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Library className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    {item.isTemplate && <Badge variant="warning">Şablon</Badge>}
                    <Badge variant="outline">{ARCHIVE_TYPE_LABELS[item.type] || item.type}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {item.schoolTypes.map((s) => (
                      <span key={s} className="text-xs text-gray-400">{SCHOOL_TYPE_LABELS[s]}</span>
                    ))}
                    {item.year && <span className="text-xs text-gray-400">{item.year}</span>}
                    {item.subject && <span className="text-xs text-gray-400">{item.subject}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.viewCount}</span>
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" />{item.downloadCount}</span>
                </div>
                <Badge variant={item.isActive ? 'success' : 'secondary'}>
                  {item.isActive ? 'Aktif' : 'Pasif'}
                </Badge>
                <Link href={`/admin/arsiv/${item.id}`}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg">Düzenle</Link>
              </div>
            </div>
          ))}
          {archives.length === 0 && (
            <div className="text-center py-12">
              <Library className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Henüz arşiv kaynağı yok</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
