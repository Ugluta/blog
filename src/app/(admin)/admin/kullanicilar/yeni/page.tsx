'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ROLES = [
  { value: 'MEMBER', label: 'Üye' },
  { value: 'TEACHER', label: 'Öğretmen' },
  { value: 'ADMIN_STAFF', label: 'İdari Personel' },
  { value: 'MODERATOR', label: 'Moderatör' },
  { value: 'EDITOR', label: 'Editör' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPER_ADMIN', label: 'Süper Admin' },
];

const SCHOOL_TYPES = [
  { value: 'ANAOKULU', label: 'Anaokulu' },
  { value: 'ILKOKUL', label: 'İlkokul' },
  { value: 'ORTAOKUL', label: 'Ortaokul' },
  { value: 'LISE', label: 'Lise' },
  { value: 'IMAM_HATIP', label: 'İmam Hatip' },
  { value: 'MESLEK_LISESI', label: 'Meslek Lisesi' },
  { value: 'OZEL_EGITIM', label: 'Özel Eğitim' },
  { value: 'UNIVERSITE', label: 'Üniversite' },
  { value: 'GENEL', label: 'Genel' },
];

export default function YeniKullaniciPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', username: '',
    role: 'MEMBER', membershipStatus: 'ACTIVE',
    schoolType: '', phone: '', city: '', bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    setSaving(true);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/kullanicilar/${data.id}`);
    } else {
      const err = await res.json();
      alert(err.error || 'Hata oluştu');
    }
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Yeni Kullanıcı
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad *</label>
            <input required value={form.name} onChange={(e) => set('name', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ad Soyad" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kullanıcı Adı</label>
            <input value={form.username} onChange={(e) => set('username', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@kullanici" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta *</label>
            <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@ornek.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre *</label>
            <input required type="password" value={form.password} onChange={(e) => set('password', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="En az 8 karakter" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
            <select value={form.role} onChange={(e) => set('role', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Üyelik Durumu</label>
            <select value={form.membershipStatus} onChange={(e) => set('membershipStatus', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Pasif</option>
              <option value="SUSPENDED">Askıya Alınmış</option>
              <option value="PENDING">Beklemede</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Okul Türü</label>
            <select value={form.schoolType} onChange={(e) => set('schoolType', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seçin…</option>
              {SCHOOL_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şehir</label>
            <input value={form.city} onChange={(e) => set('city', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="İstanbul" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
          <input value={form.phone} onChange={(e) => set('phone', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0532 000 00 00" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Biyografi</label>
          <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)}
            rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kısa biyografi…" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            <UserPlus className="w-4 h-4" /> {saving ? 'Oluşturuluyor…' : 'Kullanıcı Oluştur'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
        </div>
      </form>
    </div>
  );
}
