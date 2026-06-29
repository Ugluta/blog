import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Users, Check, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/admin/PageHeader';
import { DeleteButton } from '@/components/admin/DeleteButton';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Üyelik Paketleri' };
export const dynamic = 'force-dynamic';

export default async function UyelikPaketleriPage() {
  const plans = await db.membershipPlan.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <PageHeader title="Üyelik Paketleri" breadcrumb={[{ label: 'Kullanıcılar' }, { label: 'Paketler' }]}
        action={
          <Link href="/admin/uyelik-paketleri/yeni" className="inline-flex items-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4" /> Paket Ekle
          </Link>
        } />

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-white rounded-xl border p-5 relative ${plan.isFeatured ? 'border-blue-300 shadow-md shadow-blue-50' : 'border-gray-200'}`}>
            {plan.isFeatured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge variant="default">⭐ Önerilen</Badge></div>
            )}
            <div className="text-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price === 0 ? 'Ücretsiz' : `${plan.price}₺`}</span>
                {plan.price > 0 && <span className="text-gray-400 text-sm">/ay</span>}
              </div>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{plan._count.users.toLocaleString('tr-TR')} aktif üye</span>
            </div>

            <ul className="space-y-2 mb-5">
              {(plan.features as string[]).map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />{f}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <Link href={`/admin/uyelik-paketleri/${plan.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg">
                <Pencil className="w-3.5 h-3.5" /> Düzenle
              </Link>
              <Badge variant={plan.isActive ? 'success' : 'secondary'} className="py-2 px-3">{plan.isActive ? 'Aktif' : 'Pasif'}</Badge>
              <DeleteButton endpoint={`/api/uyelik-paketleri/${plan.id}`} confirmText="Paket silinsin mi? Üyeler ücretsize düşer." />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
