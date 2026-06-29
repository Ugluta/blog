import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { formatDate, ROLE_LABELS } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/admin/PageHeader';
import { DeleteButton } from '@/components/admin/DeleteButton';
import Link from 'next/link';
import { UserPlus, Search, Pencil } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kullanıcılar' };
export const dynamic = 'force-dynamic';

const ROLE_BADGE: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  SUPER_ADMIN: 'destructive', ADMIN: 'warning', EDITOR: 'default',
  MODERATOR: 'secondary', TEACHER: 'success', ADMIN_STAFF: 'success', MEMBER: 'secondary',
};

export default async function KullanicilarPage({
  searchParams,
}: {
  searchParams: Promise<{ sayfa?: string; ara?: string; rol?: string }>;
}) {
  const { sayfa, ara: search, rol: roleFilter } = await searchParams;
  const session = await auth();
  const currentId = session?.user?.id;
  const page = Number(sayfa) || 1;
  const perPage = 25;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(roleFilter && { role: roleFilter as never }),
  };

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      include: { membershipPlan: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <PageHeader title="Kullanıcılar" breadcrumb={[{ label: `${total.toLocaleString('tr-TR')} kayıt` }]}
        action={
          <Link href="/admin/kullanicilar/yeni" className="inline-flex items-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg">
            <UserPlus className="w-4 h-4" /> Kullanıcı Ekle
          </Link>
        } />

      <form method="GET" action="/admin/kullanicilar" className="flex flex-wrap gap-3 bg-white rounded-xl border border-gray-200 p-3 mb-6">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-gray-50 rounded-lg px-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="search" name="ara" placeholder="Ad, e-posta ara..." defaultValue={search || ''} className="flex-1 py-2 text-sm bg-transparent outline-none" />
        </div>
        <select name="rol" defaultValue={roleFilter || ''} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="">Tüm Roller</option>
          {Object.entries(ROLE_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Filtrele</button>
        {(search || roleFilter) && (
          <Link href="/admin/kullanicilar" className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Temizle</Link>
        )}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Kayıt</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name || '-'}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant={ROLE_BADGE[user.role] || 'secondary'}>{ROLE_LABELS[user.role] || user.role}</Badge></TableCell>
                <TableCell>{user.membershipPlan?.name || <span className="text-gray-400">Ücretsiz</span>}</TableCell>
                <TableCell><Badge variant={user.membershipStatus === 'ACTIVE' ? 'success' : 'destructive'}>{user.membershipStatus === 'ACTIVE' ? 'Aktif' : 'Pasif'}</Badge></TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/kullanicilar/${user.id}`} title="Düzenle" className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></Link>
                    <DeleteButton endpoint={`/api/users/${user.id}`} disabled={user.id === currentId} title="Kendinizi silemezsiniz" confirmText={`${user.name || user.email} silinsin mi?`} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-gray-500">Sayfa {page} / {totalPages} — toplam {total} kullanıcı</p>
          <div className="flex gap-2">
            {page > 1 && <Link href={`/admin/kullanicilar?sayfa=${page - 1}${search ? `&ara=${search}` : ''}${roleFilter ? `&rol=${roleFilter}` : ''}`} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">← Önceki</Link>}
            {page < totalPages && <Link href={`/admin/kullanicilar?sayfa=${page + 1}${search ? `&ara=${search}` : ''}${roleFilter ? `&rol=${roleFilter}` : ''}`} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Sonraki →</Link>}
          </div>
        </div>
      )}
    </div>
  );
}
