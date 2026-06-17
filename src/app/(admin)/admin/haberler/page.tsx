import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import Link from 'next/link';
import { Newspaper, Plus, Eye, Bot } from 'lucide-react';
import type { Metadata } from 'next';
import type { ContentStatus, ContentType } from '@prisma/client';

export const metadata: Metadata = { title: 'Haberler' };

const STATUS_BADGE: Record<ContentStatus, 'success' | 'secondary' | 'destructive' | 'warning'> = {
  PUBLISHED: 'success',
  DRAFT: 'secondary',
  ARCHIVED: 'destructive',
  SCHEDULED: 'warning',
};

const STATUS_LABELS: Record<ContentStatus, string> = {
  PUBLISHED: 'Yayında',
  DRAFT: 'Taslak',
  ARCHIVED: 'Arşiv',
  SCHEDULED: 'Planlandı',
};

const TYPE_LABELS: Record<ContentType, string> = {
  NEWS: 'Haber',
  ANNOUNCEMENT: 'Duyuru',
  LEGISLATION: 'Mevzuat',
  BLOG: 'Blog',
  PAGE: 'Sayfa',
};

export default async function HaberlerPage({
  searchParams,
}: {
  searchParams: Promise<{ sayfa?: string; tur?: string; durum?: string }>;
}) {
  const { sayfa, tur, durum } = await searchParams;
  const page = Number(sayfa) || 1;
  const perPage = 25;
  const type = tur as ContentType;
  const status = durum as ContentStatus;

  const where = {
    ...(type && { type }),
    ...(status && { status }),
  };

  const [news, total] = await Promise.all([
    db.news.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.news.count({ where }),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5" /> Haberler & İçerik
          </h1>
          <p className="text-gray-500 text-sm">{total.toLocaleString('tr-TR')} içerik</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/scraper" className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100">
            <Bot className="w-4 h-4" /> AI Scraper
          </Link>
          <Link href="/admin/haberler/yeni" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Yeni Haber
          </Link>
        </div>
      </div>

      <div className="flex gap-2 bg-white rounded-xl border border-gray-100 p-3">
        {(['', 'NEWS', 'ANNOUNCEMENT', 'LEGISLATION', 'BLOG'] as (ContentType | '')[]).map((t) => (
          <Link
            key={t || 'all'}
            href={t ? `/admin/haberler?tur=${t}` : '/admin/haberler'}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (type || '') === t ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t ? TYPE_LABELS[t as ContentType] : 'Tümü'}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead>Yazar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Görüntüleme</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                    {item.isAiGenerated && (
                      <span className="inline-flex items-center gap-1 text-xs text-purple-600"><Bot className="w-3 h-3" /> AI</span>
                    )}
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{TYPE_LABELS[item.type]}</Badge></TableCell>
                <TableCell className="text-gray-500">{item.author.name}</TableCell>
                <TableCell><Badge variant={STATUS_BADGE[item.status]}>{STATUS_LABELS[item.status]}</Badge></TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-gray-500"><Eye className="w-3 h-3" />{item.viewCount}</span>
                </TableCell>
                <TableCell className="text-gray-500">{formatDate(item.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/haberler/${item.slug}`} target="_blank"
                      className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Önizle">
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link href={`/admin/haberler/${item.id}/duzenle`}
                      className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium">
                      Düzenle
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {news.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Henüz içerik yok</p>
          </div>
        )}
      </div>
    </div>
  );
}
