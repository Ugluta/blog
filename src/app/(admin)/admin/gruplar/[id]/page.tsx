'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'

export default function EditGrupPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    isPublic: true,
    isActive: true,
  })

  useEffect(() => {
    if (!id) return
    fetch(`/api/gruplar/${id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setForm({
            name: data.name,
            description: data.description || '',
            image: data.image || '',
            isPublic: data.isPublic,
            isActive: data.isActive,
          })
        }
      })
      .catch(() => setError('Grup yüklenemedi'))
      .finally(() => setFetching(false))
  }, [id])

  const set = (key: string, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setError('')
    const res = await fetch(`/api/gruplar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      router.push('/admin/gruplar')
    } else {
      const d = await res.json()
      setError(d.error || 'Kayıt hatası')
    }
  }

  async function handleDelete() {
    if (!confirm('Bu grubu silmek istediğinizden emin misiniz? Tüm konular da silinecek.')) return
    setDeleting(true)
    const res = await fetch(`/api/gruplar/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/gruplar')
    } else {
      const d = await res.json()
      setError(d.error || 'Silinemedi')
      setDeleting(false)
    }
  }

  if (fetching) return <div className="p-6 text-gray-400 text-sm">Yükleniyor...</div>

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/gruplar" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Grubu Düzenle</h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? 'Siliniyor...' : 'Grubu Sil'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grup Adı *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.image && (
              <img src={form.image} alt="Önizleme" className="mt-2 w-24 h-24 rounded-xl object-cover" />
            )}
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => set('isPublic', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Herkese Açık</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  )
}
