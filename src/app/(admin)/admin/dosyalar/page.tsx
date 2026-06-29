import { db } from '@/lib/db';
import { formatDate, formatBytes } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { DosyaAksiyonlari } from '@/components/admin/DosyaAksiyonlari';
import Link from 'next/link';
import { FolderOpen, Upload } from 'lucide-react';
import type { Metadata } from 'next';
import type { FileStatus } from '@prisma/client';

export const metadata: Metadata = { title: 'Dosya Yönetimi' };

const STATUS_MAP: Record<FileStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  APPROVED: { label: 'Onaylı', variant: 'success' },
  PENDING: { label: 'Bekliyor', variant: 'warning' },
  REJECTED: { label: 'Reddedildi', variant: 'destructive' },
  DRAFT: { label: 'Taslak', variant: 'secondary' },
};

export default async function AdminDosyalarPage({
  searchParams,
}: {
  searchParams: Promise<{ sayfa?: string; durum?: string; ara?: string }>;
}) {
  const { sayfa, durum, ara } = await searchParams;
  const page = Number(sayfa) || 1;
  const perPage = 25;
  const status = durum as FileStatus | undefined;
  const search = ara;

  const where = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { fileName: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [files, total, pendingCount] = await Promise.all([
    db.file.findMany({
      where,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
        subject: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.file.count({ where }),
    db.file.count({ where: { status: 'PENDING' } }),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" /> Dosya Yönetimi
          </h1>
          <p className="text-gray-500 text-sm">{total.toLocaleString('tr-TR')} dosya</p>
        </div>
        <Link href="/admin/dosyalar/yukle"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Upload className="w-4 h-4" /> Dosya Yükle
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'Tümü', value: '' },
          { label: `Bekliyor (${pendingCount})`, value: 'PENDING' },
          { label: 'Onaylı', value: 'APPROVED' },
          { label: 'Reddedildi', value: 'REJECTED' },
          { label: 'Taslak', value: 'DRAFT' },
        ].map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/dosyalar?durum=${tab.value}` : '/admin/dosyalar'}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (status || '') === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dosya</TableHead>
              <TableHead>Kategori / Ders</TableHead>
              <TableHead>Boyut</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Yükleyen</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium text-gray-900 truncate text-sm">{file.title}</p>
                    <p className="text-xs text-gray-400">{file.fileType}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {file.category && <p className="text-gray-700">{file.category.name}</p>}
                    {file.subject && <p className="text-xs text-gray-400">{file.subject.name}</p>}
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">{formatBytes(file.fileSize)}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_MAP[file.status].variant}>{STATUS_MAP[file.status].label}</Badge>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">{file.author.name}</TableCell>
                <TableCell className="text-gray-500 text-sm">{formatDate(file.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DosyaAksiyonlari fileId={file.id} currentStatus={file.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {files.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Dosya bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
