import { db } from '@/lib/db';
import { Shield } from 'lucide-react';
import { ROLE_LABELS } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Rol & İzinler' };

const ROLE_DESCRIPTIONS: Record<string, string> = {
  SUPER_ADMIN: 'Tüm modüllere tam erişim. Sistem ayarlarını düzenleyebilir.',
  ADMIN: 'Yönetim paneline tam erişim. Kullanıcı rolleri hariç herşeyi yönetebilir.',
  EDITOR: 'İçerik oluşturma, düzenle ve yayınlama yetkisi.',
  MODERATOR: 'Dosya, yorum ve kullanıcı içeriklerini denetleme yetkisi.',
  TEACHER: 'Dosya yükleme, belge oluşturma ve soru bankası kullanma.',
  ADMIN_STAFF: 'Evrak görüntüleme, indirme ve sınırlı yükleme.',
  MEMBER: 'Temel erişim: ücretsiz dosya indirme ve içerik görüntüleme.',
  GUEST: 'Kayıtsız ziyaretçi: yalnızca genel içerik okuma.',
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['Kullanıcı yönetimi', 'Rol atama', 'Tüm içerikleri yönetme', 'Site ayarları', 'Scraper', 'Reklam', 'Tema', 'API erişimi'],
  ADMIN: ['Kullanıcı yönetimi', 'İçerik yönetimi', 'Dosya onaylama', 'Reklam yönetimi', 'Scraper çalıştırma'],
  EDITOR: ['Haber yayınlama', 'Dosya yükleme', 'Belge oluşturma', 'Soru ekleme', 'Arşiv düzenle'],
  MODERATOR: ['Dosya onaylama/reddetme', 'Yorum yönetimi', 'Kullanıcı uyarı'],
  TEACHER: ['Dosya yükleme (onay gerekli)', 'AI belge oluşturma', 'Soru bankası', 'Sınırsız indirme'],
  ADMIN_STAFF: ['Dosya indirme', 'Evrak şablonları', 'Sınırlı yükleme'],
  MEMBER: ['5 dosya/ay indirme', 'Haber okuma', 'Soru görüntüleme'],
  GUEST: ['Genel içerik okuma', 'Kayıt sayfasına erişim'],
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-500',
  ADMIN: 'bg-orange-500',
  EDITOR: 'bg-blue-500',
  MODERATOR: 'bg-indigo-500',
  TEACHER: 'bg-green-500',
  ADMIN_STAFF: 'bg-teal-500',
  MEMBER: 'bg-gray-400',
  GUEST: 'bg-gray-300',
};

export default async function RollerPage() {
  const roleCounts = await Promise.all(
    Object.keys(ROLE_LABELS).map(async (role) => ({
      role,
      count: await db.user.count({ where: { role: role as never } }),
    }))
  );

  const countMap = Object.fromEntries(roleCounts.map((r) => [r.role, r.count]));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Rol & İzinler
        </h1>
        <p className="text-gray-500 text-sm">Platform rol hiyerarşisi ve yetki tanımları</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <div key={role} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${ROLE_COLORS[role]}`} />
                <div>
                  <p className="font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{countMap[role] || 0} kullanıcı</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">{ROLE_DESCRIPTIONS[role]}</p>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_PERMISSIONS[role]?.map((perm) => (
                <span key={perm} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{perm}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
