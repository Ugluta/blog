'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CONTENT_TYPES = [
  { value: 'NEWS', label: 'Haber' },
  { value: 'ANNOUNCEMENT', label: 'Duyuru' },
  { value: 'LEGISLATION', label: 'Mevzuat' },
  { value: 'BLOG', label: 'Blog' },
]

export default function YeniHaberPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
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
    isAiGenerated: false,
  })

  const set = (key: string, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }))

  async function handleAiGenerate() {
    if (!form.title) {
      setError('AI içerik oluşturmak için önce başlık girin')
      return
    }
    setAiLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/belge-olustur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          type: 'haber',
          description: `${form.type} türünde içerik. ${form.excerpt || ''}`,
        }),
      })
      const data = await res.json()
      if (data.content) {
        set('content', data.content)
        set('isAiGenerated', true)
      } else {
        setError('AI içerik oluşturulamadı')
      }
    } catch {
      setError('AI servisi hatası')
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSubmit(status: 'DRAFT' | 'PUBLISHED') {
    if (!form.title || !form.content) {
      setError('Başlık ve içerik zorunludur')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/haberler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status,
          tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Kayıt hatası')
      }
      router.push('/admin/haberler')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/haberler" className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Yeni İçerik Oluştur</h1>
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
                placeholder="İçerik başlığı..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                rows={2}
                placeholder="Kısa özet (SEO ve liste görünümü için)..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">İçerik *</label>
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {aiLoading ? (
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {aiLoading ? 'Oluşturuluyor...' : 'AI ile Oluştur'}
                </button>
              </div>
              <textarea
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                rows={16}
                placeholder="İçerik metni..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono text-sm"
              />
              {form.isAiGenerated && (
                <p className="text-xs text-purple-600 mt-1">✦ Bu içerik AI tarafından oluşturuldu</p>
              )}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli URL</label>
              <input
                type="url"
                value={form.coverImage}
                onChange={(e) => set('coverImage', e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {form.coverImage && (
                <img src={form.coverImage} alt="Önizleme" className="mt-2 w-full h-28 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="eğitim, öğretmen, okul"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-800">Kaynak Bilgisi</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak Adı</label>
              <input
                type="text"
                value={form.sourceName}
                onChange={(e) => set('sourceName', e.target.value)}
                placeholder="MEB, Resmi Gazete..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak URL</label>
              <input
                type="url"
                value={form.sourceUrl}
                onChange={(e) => set('sourceUrl', e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('PUBLISHED')}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Yayınla'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('DRAFT')}
              disabled={loading}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              Taslak Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
