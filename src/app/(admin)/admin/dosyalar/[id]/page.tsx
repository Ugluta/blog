'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Beklemede', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'APPROVED', label: 'Onaylandı', color: 'text-green-600 bg-green-50' },
  { value: 'REJECTED', label: 'Reddedildi', color: 'text-red-600 bg-red-50' },
  { value: 'DRAFT', label: 'Taslak', color: 'text-gray-600 bg-gray-50' },
]

const SCHOOL_TYPE_LABELS: Record<string, string> = {
  ANAOKULU: 'Anaokulu', ILKOKUL: 'İlkokul', ORTAOKUL: 'Ortaokul',
  LISE: 'Lise', IMAM_HATIP: 'İmam Hatip', MESLEK_LISESI: 'Meslek Lisesi',
  OZEL_EGITIM: 'Özel Eğitim', UNIVERSITE: 'Üniversite', GENEL: 'Genel',
}

export default function DosyaDetayPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [file, setFile] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: '',
    isPremium: false,
  })

  useEffect(() => {
    fetch(`/api/dosyalar/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        setFile(data)
        setForm({
          title: data.title ?? '',
          description: data.description ?? '',
          status: data.status ?? 'PENDING',
          isPremium: data.isPremium ?? false,
        })
      })
      .catch(() => setError('Dosya yüklenemedi'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAction(status: string) {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/dosyalar/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Güncelleme hatası')
      }
      setSuccess(`Dosya durumu "${STATUS_OPTIONS.find(s => s.value === status)?.label}" olarak güncellendi`)
      setForm(f => ({ ...f, status }))
      const updated = await res.json()
      setFile(updated)
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

  if (!file) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error || 'Dosya bulunamadı'}</div>
        <Link href="/admin/dosyalar" className="mt-4 inline-block text-blue-600 hover:underline">← Dosyalara Dön</Link>
      </div>
    )
  }

  const currentStatus = STATUS_OPTIONS.find(s => s.value === form.status)

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/dosyalar" className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Dosya Detayı</h1>
        {currentStatus && (
          <span className={`ml-2 text-xs font-medium px-3 py-1 rounded-full ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Dosya Bilgileri</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="isPremium" checked={form.isPremium}
                onChange={(e) => setForm(f => ({ ...f, isPremium: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded" />
              <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
                Premium içerik (ücretli üyelere özel)
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Dosya Meta Bilgileri</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between col-span-2 py-2 border-b">
                <span className="text-gray-500">Dosya Yolu</span>
                <span className="text-gray-800 font-mono text-xs truncate max-w-xs">{file.filePath as string}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Dosya Boyutu</span>
                <span className="text-gray-800">{file.fileSize ? `${Math.round((file.fileSize as number) / 1024)} KB` : '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Dosya Türü</span>
                <span className="text-gray-800">{file.fileType as string ?? '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Görüntülenme</span>
                <span className="text-gray-800">{file.viewCount as number ?? 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">İndirme</span>
                <span className="text-gray-800">{file.downloadCount as number ?? 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Yüklenme Tarihi</span>
                <span className="text-gray-800">{new Date(file.createdAt as string).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Yükleyen</span>
                <span className="text-gray-800">{(file.uploader as Record<string, string>)?.name ?? '-'}</span>
              </div>
              {(file.schoolTypes as string[])?.length > 0 && (
                <div className="col-span-2 flex justify-between py-2 border-t">
                  <span className="text-gray-500">Okul Türleri</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {(file.schoolTypes as string[]).map(st => (
                      <span key={st} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {SCHOOL_TYPE_LABELS[st] ?? st}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Onay İşlemleri</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleAction('APPROVED')}
                disabled={saving || form.status === 'APPROVED'}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                Onayla
              </button>
              <button
                onClick={() => handleAction('REJECTED')}
                disabled={saving || form.status === 'REJECTED'}
                className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Reddet
              </button>
              <button
                onClick={() => handleAction('PENDING')}
                disabled={saving || form.status === 'PENDING'}
                className="w-full bg-yellow-500 text-white py-2.5 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50"
              >
                Beklemede Bırak
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">İlişkili Kayıtlar</h3>
            <div className="text-sm space-y-2">
              {(file.category as Record<string, string>) && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori</span>
                  <span className="text-gray-800">{(file.category as Record<string, string>).name}</span>
                </div>
              )}
              {(file.subject as Record<string, string>) && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Ders</span>
                  <span className="text-gray-800">{(file.subject as Record<string, string>).name}</span>
                </div>
              )}
              {(file.grade as Record<string, unknown>) && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Sınıf</span>
                  <span className="text-gray-800">{(file.grade as Record<string, unknown>).level as number}. Sınıf</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => handleAction(form.status)}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
