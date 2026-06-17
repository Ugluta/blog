'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const CONTENT_TYPES = [
  { value: 'NEWS', label: 'Haber' },
  { value: 'ANNOUNCEMENT', label: 'Duyuru' },
  { value: 'LEGISLATION', label: 'Mevzuat' },
  { value: 'BLOG', label: 'Blog' },
]

export default function HaberDuzenle() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    type: 'NEWS',
    coverImage: '',
    sourceName: '',
    sourceUrl: '',
    tags: '',
    status: 'DRAFT',
  })

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  useEffect(() => {
    fetch(`/api/haberler/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        setForm({
          title: data.title ?? '',
          content: data.content ?? '',
          excerpt: data.excerpt ?? '',
          type: data.type ?? 'NEWS',
          coverImage: data.coverImage ?? '',
          sourceName: data.sourceName ?? '',
          sourceUrl: data.sourceUrl ?? '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          status: data.status ?? 'DRAFT',
        })
      })
      .catch(() => setError('İçerik yüklenemedi'))
      .finally(() => setFetchLoading(false))
  }, [id])

  async function handleSubmit(status: string) {
    if (!form.title || !form.content) {
      setError('Başlık ve içerik zorunludur')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/haberler/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status,
          tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Güncelleme hatası')
      }
      router.push('/admin/haberler')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/haberler" className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">İçerik Düzenle</h1>
        <span className="ml-auto text-xs text-gray-400 font-mono"># {id}</span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İçerik *</label>
              <textarea
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                rows={18}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-800">Yayın Ayarları</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İçerik Türü</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Taslak</option>
                <option value="PUBLISHED">Yayınlandı</option>
                <option value="ARCHIVED">Arşivlendi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli URL</label>
              <input
                type="url"
                value={form.coverImage}
                onChange={(e) => set('coverImage', e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {form.coverImage && (
                <img src={form.coverImage} alt="Önizleme" className="mt-2 w-full h-24 object-cover rounded-lg" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="eğitim, öğretmen"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-800">Kaynak Bilgisi</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak Adı</label>
              <input type="text" value={form.sourceName} onChange={(e) => set('sourceName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak URL</label>
              <input type="url" value={form.sourceUrl} onChange={(e) => set('sourceUrl', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('PUBLISHED')}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Güncelle & Yayınla'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(form.status)}
              disabled={loading}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
