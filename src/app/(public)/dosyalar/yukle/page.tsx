'use client'
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Upload, X, CheckCircle, Loader2, ArrowLeft, FileText } from 'lucide-react'

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
]

interface Category {
  id: string
  name: string
  slug: string
  children?: Category[]
}

export default function DosyaYuklePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [schoolTypes, setSchoolTypes] = useState<string[]>(['GENEL'])
  const [tags, setTags] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/giris?next=/dosyalar/yukle')
  }, [status, router])

  useEffect(() => {
    fetch('/api/kategoriler')
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  function handleFile(f: File) {
    setFile(f)
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  function toggleSchoolType(value: string) {
    setSchoolTypes((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('Lütfen bir dosya seçin'); return }
    if (!title.trim()) { setError('Başlık zorunludur'); return }
    if (schoolTypes.length === 0) { setError('En az bir okul türü seçin'); return }

    setSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.error || 'Dosya yüklenemedi')
      }
      const { data: uploadData } = await uploadRes.json()

      const metaRes = await fetch('/api/dosyalar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          fileName: uploadData.fileName,
          filePath: uploadData.filePath,
          fileSize: uploadData.fileSize,
          fileType: uploadData.fileType,
          mimeType: uploadData.mimeType,
          categoryId: categoryId || undefined,
          schoolTypes,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })
      if (!metaRes.ok) {
        const err = await metaRes.json()
        throw new Error(err.error || 'Dosya kaydedilemedi')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </>
    )
  }

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Dosya Yüklendi!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Dosyanız incelemeye alındı. Onaylandıktan sonra platformda yayınlanacak.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setSuccess(false); setFile(null); setTitle(''); setDescription('');
                  setCategoryId(''); setTags(''); setSchoolTypes(['GENEL'])
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Başka Dosya Yükle
              </button>
              <Link
                href="/profil"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
              >
                Profilime Git
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const allCategories = categories.flatMap((c) => [
    c,
    ...(c.children ?? []),
  ])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container-custom py-8 max-w-3xl">
          <Link
            href="/dosyalar"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Dosyalara Dön
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dosya Yükle</h1>
          <p className="text-gray-500 text-sm mb-8">
            Meslektaşlarınız ile paylaşmak istediğiniz ders materyallerini yükleyin.
            Yüklediğiniz dosyalar admin onayından sonra yayınlanır.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => !file && fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl transition-colors ${
                file
                  ? 'border-green-300 bg-green-50'
                  : 'border-blue-200 bg-blue-50 hover:border-blue-400 cursor-pointer'
              }`}
            >
              {file ? (
                <div className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 bg-white rounded-xl border border-green-200 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Upload className="w-10 h-10 text-blue-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700">Dosyayı sürükleyin veya tıklayın</p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, Word, Excel, PowerPoint, Görsel, ZIP desteklenir (maks. 50 MB)
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.zip"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {/* Metadata form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Başlık <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: 5. Sınıf Matematik Yıllık Plan"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Açıklama
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Dosya içeriği hakkında kısa bilgi..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Kategori Seçin (isteğe bağlı)</option>
                  {allCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Okul Türü <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SCHOOL_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleSchoolType(value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                        schoolTypes.includes(value)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Etiketler
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="matematik, yıllık plan, 5. sınıf (virgülle ayırın)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !file}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...</>
              ) : (
                <><Upload className="w-4 h-4" /> Dosyayı Gönder</>
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
