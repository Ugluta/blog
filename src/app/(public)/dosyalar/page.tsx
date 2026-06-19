'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, Folder, Download, ChevronRight, FileText, Heart } from 'lucide-react'

const SCHOOL_TYPES = [
  { value: '', label: 'Tüm Okul Türleri' },
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

const FILE_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  PDF:        { bg: 'bg-red-100',    text: 'text-red-600',    label: 'PDF' },
  WORD:       { bg: 'bg-blue-100',   text: 'text-blue-600',   label: 'DOC' },
  EXCEL:      { bg: 'bg-green-100',  text: 'text-green-600',  label: 'XLS' },
  POWERPOINT: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'PPT' },
  IMAGE:      { bg: 'bg-purple-100', text: 'text-purple-600', label: 'IMG' },
  OTHER:      { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'FILE' },
}

interface Category {
  id: string
  name: string
  slug: string
  fileCount?: number
  children?: Category[]
}

interface FileItem {
  id: string
  title: string
  slug: string
  fileType: string
  fileSize: number
  downloadCount: number
  grade?: { level: number }
  subject?: { name: string }
  isPremium: boolean
}

export default function DosyalarPage() {
  const [schoolType, setSchoolType]     = useState('')
  const [categories, setCategories]     = useState<Category[]>([])
  const [selCat, setSelCat]             = useState<Category | null>(null)
  const [selSub, setSelSub]             = useState<Category | null>(null)
  const [files, setFiles]               = useState<FileItem[]>([])
  const [total, setTotal]               = useState(0)
  const [search, setSearch]             = useState('')
  const [filesLoading, setFilesLoading] = useState(false)
  const [favoriteIds, setFavoriteIds]   = useState<Set<string>>(new Set())
  const [favLoadingIds, setFavLoadingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/kategoriler')
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
  }, [])

  useEffect(() => {
    fetch('/api/favoriler')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavoriteIds(new Set(data.map((f: { file: { id: string } }) => f.file.id)))
        }
      })
      .catch(() => {})
  }, [])

  const fetchFiles = useCallback(async () => {
    setFilesLoading(true)
    try {
      const p = new URLSearchParams({ limit: '60' })
      if (schoolType)    p.set('schoolType', schoolType)
      if (selSub)        p.set('kategoriId', selSub.id)
      else if (selCat)   p.set('kategoriId', selCat.id)
      if (search.trim()) p.set('ara', search.trim())

      const res  = await fetch(`/api/dosyalar?${p}`)
      const data = await res.json()
      setFiles(data.files ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setFilesLoading(false)
    }
  }, [schoolType, selCat, selSub, search])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  const toggleFavorite = async (e: React.MouseEvent, fileId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (favLoadingIds.has(fileId)) return

    setFavLoadingIds((prev) => new Set([...prev, fileId]))
    const isFav = favoriteIds.has(fileId)

    const res = await fetch('/api/favoriler', {
      method: isFav ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    })

    if (res.status === 401) {
      window.location.href = '/giris?callbackUrl=/dosyalar'
      return
    }
    if (res.ok) {
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (isFav) next.delete(fileId)
        else next.add(fileId)
        return next
      })
    }
    setFavLoadingIds((prev) => {
      const next = new Set(prev)
      next.delete(fileId)
      return next
    })
  }

  const panel2List: Category[] = selCat?.children?.length ? selCat.children : categories
  const panel2Header = selCat?.children?.length ? 'ALT KATEGİRİLER' : 'KATEGİRİLER'

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center gap-2 text-sm text-gray-500 shrink-0">
        <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800 font-medium">Dosyalar</span>
        {selCat && (<><ChevronRight className="w-3 h-3" /><span>{selCat.name}</span></>)}
        {selSub && (<><ChevronRight className="w-3 h-3" /><span>{selSub.name}</span></>)}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── PANEL 1: Okul Türü ── */}
        <div className="w-44 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="px-3 py-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
            1. OKUL TÜRÜ
          </div>
          <div className="overflow-y-auto flex-1">
            {SCHOOL_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setSchoolType(value); setSelCat(null); setSelSub(null) }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors ${
                  schoolType === value
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <Folder className="w-3.5 h-3.5 shrink-0 opacity-60" />
                <span className="truncate leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── PANEL 2: Kategoriler / Alt Kategoriler ── */}
        <div className="w-52 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="px-3 py-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span>2. {panel2Header}</span>
            {selCat && (
              <button
                onClick={() => { setSelCat(null); setSelSub(null) }}
                className="text-blue-500 hover:text-blue-700 text-xs font-normal"
              >
                ← Geri
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {panel2List.map((cat) => {
              const active = selCat?.children?.length
                ? selSub?.id === cat.id
                : selCat?.id === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (selCat?.children?.length) {
                      setSelSub(cat)
                    } else {
                      setSelCat(cat)
                      setSelSub(null)
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors ${
                    active
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Folder className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span className="truncate">{cat.name}</span>
                  </span>
                  {cat.fileCount != null && (
                    <span className={`text-xs shrink-0 ml-1 ${active ? 'text-blue-100' : 'text-gray-400'}`}>
                      {cat.fileCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── PANEL 3: Dosyalar ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <div className="px-4 py-2.5 bg-white border-b border-gray-200 flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              3. EVRAKLAR
            </span>
            {selCat && (
              <span className="text-xs text-gray-400">
                {selSub ? `${selCat.name} › ${selSub.name}` : selCat.name}
                {schoolType ? ` · ${SCHOOL_TYPES.find((s) => s.value === schoolType)?.label}` : ''}
              </span>
            )}
            <div className="ml-auto flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Evraklarda ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{total} dosya</span>
            </div>
          </div>

          {/* column headers */}
          <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded" readOnly />
            <span className="text-xs font-semibold text-gray-500 flex-1">EVRAK ADI</span>
            <span className="text-xs font-semibold text-gray-500 w-6">&nbsp;</span>
            <span className="text-xs font-semibold text-gray-500 w-20 text-right">İNDİRME</span>
          </div>

          {/* file rows */}
          <div className="overflow-y-auto flex-1">
            {filesLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-52 text-gray-400">
                <FileText className="w-10 h-10 mb-3 opacity-25" />
                <p className="text-sm">
                  {selCat || schoolType ? 'Bu filtrede dosya bulunamadı' : 'Sol panelden okul türü veya kategori seçin'}
                </p>
              </div>
            ) : (
              files.map((file) => {
                const ft = FILE_BADGE[file.fileType] ?? FILE_BADGE.OTHER
                const isFav = favoriteIds.has(file.id)
                const isLoading = favLoadingIds.has(file.id)
                return (
                  <Link
                    key={file.id}
                    href={`/dosyalar/${file.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-50 hover:bg-blue-50 transition-colors group"
                  >
                    <input type="checkbox" className="w-4 h-4 rounded" onClick={(e) => e.stopPropagation()} readOnly />
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${ft.bg} ${ft.text}`}>
                      {ft.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate group-hover:text-blue-700 font-medium">
                        {file.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {file.grade   && <span className="text-xs text-gray-400">{file.grade.level}. Sınıf</span>}
                        {file.subject && <span className="text-xs text-gray-400">· {file.subject.name}</span>}
                        {file.isPremium && (
                          <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-medium">Premium</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(e, file.id)}
                      disabled={isLoading}
                      className={`shrink-0 p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                        isFav
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100'
                      }`}
                      title={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
                    </button>
                    <div className="flex items-center gap-1 text-xs text-gray-400 w-20 justify-end shrink-0">
                      <Download className="w-3 h-3" />
                      {file.downloadCount.toLocaleString('tr-TR')}
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
