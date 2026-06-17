import { db } from '@/lib/db';
import Link from 'next/link';
import { CreditCard, Plus, Users, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Üyelik Paketleri' };

export default async function UyelikPaketleriPage() {
  const plans = await db.membershipPlan.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5" /> Üyelik Paketleri
        </h1>
        <Link href="/admin/uyelik-paketleri/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Paket Ekle
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-white rounded-xl border p-5 relative ${
            plan.isFeatured ? 'border-blue-300 shadow-md shadow-blue-50' : 'border-gray-100'
          }`}>
            {plan.isFeatured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default">⭐ Önerilen</Badge>
              </div>
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
              <span>{plan._count.users.toLocaleString()} aktif üye</span>
            </div>

            <ul className="space-y-2 mb-5">
              {(plan.features as string[]).map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />{f}
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <Link href={`/admin/uyelik-paketleri/${plan.id}`}
                className="flex-1 py-2 text-center text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg">Düzenle</Link>
              <Badge variant={plan.isActive ? 'success' : 'secondary'} className="py-2 px-3">
                {plan.isActive ? 'Aktif' : 'Pasif'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
