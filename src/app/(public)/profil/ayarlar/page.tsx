'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const SCHOOL_TYPES = [
  { value: '', label: 'Seçiniz' },
  { value: 'ANAOKULU', label: 'Anaokulu' },
  { value: 'ILKOKUL', label: 'İlkokul' },
  { value: 'ORTAOKUL', label: 'Ortaokul' },
  { value: 'LISE', label: 'Lise' },
  { value: 'IMAM_HATIP', label: 'İmam Hatip' },
  { value: 'MESLEK_LISESI', label: 'Meslek Lisesi' },
  { value: 'OZEL_EGITIM', label: 'Özel Eğitim' },
  { value: 'UNIVERSITE', label: 'Üniversite' },
  { value: 'GENEL', label: 'Genel' },
]

export default function ProfilAyarlarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', username: '', bio: '', phone: '', city: '', schoolType: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/giris')
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then(r => r.json())
        .then(d => setForm({
          name: d.name || '',
          username: d.username || '',
          bio: d.bio || '',
          phone: d.phone || '',
          city: d.city || '',
          schoolType: d.schoolType || '',
        }))
    }
  }, [session, status, router])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!session?.user?.id) return
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSuccess('Profiliniz güncellendi')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Hata oluştu')
    } finally { setSaving(false) }
  }

  if (status === 'loading') return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/profil" className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Profil Ayarları</h1>
          </div>

          {error   && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">{success}</div>}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                <input type="text" value={form.username} onChange={e => set('username', e.target.value)}
                  placeholder="ogretmen_ali"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-400 mt-1">Herkese açık profil URL'niz: /profil/kullanici-adi</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biyografi</label>
              <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3}
                placeholder="Kendinizden kısaca bahsedin..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="05xx xxx xx xx"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                <input type="text" value={form.city} onChange={e => set('city', e.target.value)}
                  placeholder="İstanbul"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Okul Türü</label>
              <select value={form.schoolType} onChange={e => set('schoolType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {SCHOOL_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
