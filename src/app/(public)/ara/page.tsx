'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, FileText, Newspaper, HelpCircle, Loader2 } from 'lucide-react'

type Tab = 'dosyalar' | 'haberler' | 'sorular'

const FILE_BADGE: Record<string, { bg: string; text: string }> = {
  PDF:   { bg: 'bg-red-100',   text: 'text-red-600' },
  WORD:  { bg: 'bg-blue-100',  text: 'text-blue-600' },
  EXCEL: { bg: 'bg-green-100', text: 'text-green-600' },
  OTHER: { bg: 'bg-gray-100',  text: 'text-gray-600' },
}

export default function AraPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(sp.get('q') || '')
  const [tab, setTab] = useState<Tab>('dosyalar')
  const [results, setResults] = useState<Record<Tab, unknown[]>>({ dosyalar: [], haberler: [], sorular: [] })
  const [totals, setTotals] = useState<Record<Tab, number>>({ dosyalar: 0, haberler: 0, sorular: 0 })
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const [dosyalar, haberler, sorular] = await Promise.all([
        fetch(`/api/dosyalar?ara=${encodeURIComponent(q)}&limit=10`).then(r => r.json()),
        fetch(`/api/haberler?ara=${encodeURIComponent(q)}&limit=10`).then(r => r.json()),
        fetch(`/api/sorular?ara=${encodeURIComponent(q)}&limit=10`).then(r => r.json()),
      ])
      setResults({
        dosyalar: dosyalar.files ?? [],
        haberler: haberler.news ?? [],
        sorular:  sorular.questions ?? [],
      })
      setTotals({
        dosyalar: dosyalar.total ?? 0,
        haberler: haberler.total ?? 0,
        sorular:  sorular.total ?? 0,
      })
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const q = sp.get('q') || ''
    setQuery(q)
    if (q) search(q)
  }, [sp, search])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) router.push(`/ara?q=${encodeURIComponent(query.trim())}`)
  }

  const currentQ = sp.get('q') || ''
  const totalAll = totals.dosyalar + totals.haberler + totals.sorular

  const TABS: { key: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'dosyalar', label: 'Dosyalar', icon: FileText,   count: totals.dosyalar },
    { key: 'haberler', label: 'Haberler', icon: Newspaper,  count: totals.haberler },
    { key: 'sorular',  label: 'Sorular',  icon: HelpCircle, count: totals.sorular },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-5">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Dosya, haber, soru ara..."
                className="flex-1 py-3 text-sm bg-transparent outline-none"
                autoFocus
              />
            </div>
            <button type="submit"
              className="px-6 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700">
              Ara
            </button>
          </form>
          {currentQ && !loading && (
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-semibold text-gray-800">&ldquo;{currentQ}&rdquo;</span> için {totalAll.toLocaleString('tr-TR')} sonuç
            </p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.key ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                }`}>
                <Icon className="w-4 h-4" />
                {t.label}
                {t.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    tab === t.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{t.count}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : !currentQ ? (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Aramak istediğiniz kelimeyi girin</p>
          </div>
        ) : results[tab].length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">&ldquo;{currentQ}&rdquo; için {TABS.find(t => t.key === tab)?.label} bulunamadı</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tab === 'dosyalar' && (results.dosyalar as Record<string,unknown>[]).map((f) => {
              const ft = FILE_BADGE[f.fileType as string] ?? FILE_BADGE.OTHER
              return (
                <Link key={f.id as string} href={`/dosyalar/${f.slug}`}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${ft.bg} ${ft.text}`}>
                    {(f.fileType as string)?.slice(0,3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{f.title as string}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(f.grade as Record<string,number>)?.level && `${(f.grade as Record<string,number>).level}. Sınıf · `}
                      {(f.subject as Record<string,string>)?.name}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{f.downloadCount as number} indirme</span>
                </Link>
              )
            })}

            {tab === 'haberler' && (results.haberler as Record<string,unknown>[]).map((n) => (
              <Link key={n.id as string} href={`/haberler/${n.slug}`}
                className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                {n.coverImage && (
                  <img src={n.coverImage as string} alt="" className="w-16 h-14 object-cover rounded-lg shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-2">{n.title as string}</p>
                  {n.excerpt && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{n.excerpt as string}</p>}
                </div>
              </Link>
            ))}

            {tab === 'sorular' && (results.sorular as Record<string,unknown>[]).map((q) => (
              <div key={q.id as string}
                className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="font-medium text-gray-900 text-sm">{q.content as string}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{q.type as string}</span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">{q.difficulty as string}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
