'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Süper Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editör',
  MODERATOR: 'Moderatör',
  TEACHER: 'Öğretmen',
  ADMIN_STAFF: 'İdareci',
  MEMBER: 'Üye',
  GUEST: 'Misafir',
}

const SCHOOL_TYPE_LABELS: Record<string, string> = {
  ANAOKULU: 'Anaokulu',
  ILKOKUL: 'İlkokul',
  ORTAOKUL: 'Ortaokul',
  LISE: 'Lise',
  IMAM_HATIP: 'İmam Hatip',
  MESLEK_LISESI: 'Meslek Lisesi',
  OZEL_EGITIM: 'Özel Eğitim',
  UNIVERSITE: 'Üniversite',
  GENEL: 'Genel',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  SUSPENDED: 'Askıya Alındı',
  PENDING: 'Beklemede',
}

export default function KullaniciDetayPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [user, setUser] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    name: '',
    username: '',
    role: '',
    membershipStatus: '',
    schoolType: '',
    bio: '',
    phone: '',
    city: '',
  })

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        setUser(data)
        setForm({
          name: data.name ?? '',
          username: data.username ?? '',
          role: data.role ?? '',
          membershipStatus: data.membershipStatus ?? '',
          schoolType: data.schoolType ?? '',
          bio: data.bio ?? '',
          phone: data.phone ?? '',
          city: data.city ?? '',
        })
      })
      .catch(() => setError('Kullanıcı yüklenemedi'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Güncelleme hatası')
      }
      setSuccess('Kullanıcı başarıyla güncellendi')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user && error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>
        <Link href="/admin/kullanicilar" className="mt-4 inline-block text-blue-600 hover:underline">← Kullanıcılara Dön</Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/kullanicilar" className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Detayı</h1>
        <span className="ml-auto text-xs text-gray-400 font-mono"># {id}</span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">{success}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Kişisel Bilgiler</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                <input type="text" value={form.username} onChange={(e) => set('username', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input type="email" value={user?.email as string ?? ''} disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">E-posta değiştirilemez</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                  placeholder="05xx xxx xx xx"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)}
                  placeholder="İstanbul"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biyografi</label>
              <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)}
                rows={3} placeholder="Kullanıcı hakkında kısa bilgi..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Aktivite</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-700">{(user?.files as unknown[])?.length ?? 0}</p>
                <p className="text-xs text-gray-600 mt-1">Dosya</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-700">{(user?.downloads as unknown[])?.length ?? 0}</p>
                <p className="text-xs text-gray-600 mt-1">İndirme</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-purple-700">{(user?.documents as unknown[])?.length ?? 0}</p>
                <p className="text-xs text-gray-600 mt-1">Belge</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-800">Rol & İzinler</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select value={form.role} onChange={(e) => set('role', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.entries(ROLE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Üyelik Durumu</label>
              <select value={form.membershipStatus} onChange={(e) => set('membershipStatus', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Okul Türü</label>
              <select value={form.schoolType} onChange={(e) => set('schoolType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seçiniz</option>
                {Object.entries(SCHOOL_TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 text-sm space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3">Hesap Bilgisi</h3>
            <div className="flex justify-between">
              <span className="text-gray-500">Kayıt tarihi</span>
              <span className="text-gray-800">{user?.createdAt ? new Date(user.createdAt as string).toLocaleDateString('tr-TR') : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Son giriş</span>
              <span className="text-gray-800">{user?.updatedAt ? new Date(user.updatedAt as string).toLocaleDateString('tr-TR') : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">E-posta doğrulama</span>
              <span className={user?.emailVerified ? 'text-green-600' : 'text-red-500'}>
                {user?.emailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/kullanicilar')}
            className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  )
}
