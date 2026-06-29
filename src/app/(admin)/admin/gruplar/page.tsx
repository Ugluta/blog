import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Users2, Plus, Lock, Globe, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Gruplar' };

export default async function GruplarPage() {
  const groups = await db.group.findMany({
    include: {
      _count: { select: { members: true, posts: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users2 className="w-5 h-5" /> Gruplar
          </h1>
          <p className="text-gray-500 text-sm">{groups.length} grup</p>
        </div>
        <Link href="/admin/gruplar/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Grup Oluştur
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {group.image ? (
                  <img src={group.image} alt={group.name} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users2 className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{group.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {group.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {group.isPublic ? 'Herkese Açık' : 'Özel'}
                  </div>
                </div>
              </div>
              <Badge variant={group.isActive ? 'success' : 'secondary'}>
                {group.isActive ? 'Aktif' : 'Pasif'}
              </Badge>
            </div>
            {group.description && (
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{group.description}</p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
              <span>👥 {group._count.members} üye</span>
              <span>💬 {group._count.posts} gönderi</span>
              <span>{formatDate(group.createdAt)}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-50">
              <Link
                href={`/admin/gruplar/${group.id}`}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700"
              >
                <Pencil className="w-3.5 h-3.5" /> Düzenle
              </Link>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <Users2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Henüz grup yok</p>
          </div>
        )}
      </div>
    </div>
  );
}
