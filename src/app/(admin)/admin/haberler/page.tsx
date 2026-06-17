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
  searchParams: { sayfa?: string; tur?: string; durum?: string };
}) {
  const page = Number(searchParams.sayfa) || 1;
  const perPage = 25;
  const type = searchParams.tur as ContentType;
  const status = searchParams.durum as ContentStatus;

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
          <p className="text-gray-500 text-sm">{total.toLocaleString()} içerik</p>
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

      {/* Filters */}
      <div className="flex gap-2 bg-white rounded-xl border border-gray-100 p-3">
        {(['', 'NEWS', 'ANNOUNCEMENT', 'LEGISLATION', 'BLOG'] as (ContentType | ''  )[]).map((t) => (
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
                  <Link href={`/admin/haberler/${item.id}`}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg">Düzenle</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
