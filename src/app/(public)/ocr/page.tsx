'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ScanText, Upload, Copy, Check, FileImage, Loader2, Wand2 } from 'lucide-react'

export default function OcrPage() {
  const { status } = useSession()
  const router = useRouter()

  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'extract' | 'clean' | 'summary'>('extract')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/giris?next=/ocr')
  }, [status, router])

  const MODE_LABELS = {
    extract: 'Metni Çıkar',
    clean: 'Çıkar & Düzetle',
    summary: 'Özetle',
  }

  function handleFile(file: File) {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Lütfen görüntü veya PDF dosyası seçin')
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setResult('')
  }

  async function handleOcr() {
    if (!preview) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: preview, mode }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.text)
    } catch (e: unknown) {
      setResult(`Hata: ${e instanceof Error ? e.message : 'Bilinmeyen hata'}`)
    } finally {
      setLoading(false)
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
            <ScanText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Görüntüden Metin (OCR)</h1>
            <p className="text-gray-500 text-sm mt-0.5">Fütograf, taranmış belge veya PDF&apos;ten metin çıkarın ve Claude AI ile düzeyin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Upload */}
          <div className="space-y-4">
            {/* Mode */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">İşlem Modu</p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(MODE_LABELS) as [typeof mode, string][]).map(([key, label]) => (
                  <button key={key} onClick={() => setMode(key)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      mode === key
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {mode === 'extract' && 'Görseldeki metni olduğu gibi çıkarır'}
                {mode === 'clean' && 'Çıkarılan metni imla ve format açısından düzeyle'}
                {mode === 'summary' && 'Belgenin kısa özetini çıkarır'}
              </p>
            </div>

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-2xl transition-colors ${
                dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'
              }`}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            >
              {preview ? (
                <div className="p-4">
                  {preview.startsWith('data:image') ? (
                    <img src={preview} alt="Önizleme" className="w-full rounded-xl object-contain max-h-72" />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                      <FileImage className="w-12 h-12 mb-2 text-purple-400" />
                      <p className="text-sm font-medium">{fileName}</p>
                      <p className="text-xs text-gray-400 mt-1">PDF dosyası yüklendi</p>
                    </div>
                  )}
                  <button onClick={() => { setPreview(null); setFileName(''); setResult('') }}
                    className="mt-3 w-full text-xs text-gray-400 hover:text-red-500 transition-colors">
                    Kaldır
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full p-12 flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 transition-colors">
                  <Upload className="w-10 h-10 mb-3 opacity-50" />
                  <p className="text-sm font-medium">Görüntü veya PDF sürükleyin</p>
                  <p className="text-xs mt-1">veya tıklayarak seçin — JPG, PNG, PDF</p>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

            <button onClick={handleOcr} disabled={!preview || loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors">
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> İşleniyor...</>
                : <><Wand2 className="w-5 h-5" /> {MODE_LABELS[mode]}</>}
            </button>
          </div>

          {/* Right: Result */}
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col" style={{ minHeight: 480 }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-700">Sonuç</span>
              {result && (
                <button onClick={copyResult}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Kopyalandı!' : 'Kopyala'}
                </button>
              )}
            </div>
            <div className="flex-1 p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Loader2 className="w-10 h-10 animate-spin text-purple-400 mb-4" />
                  <p className="text-sm">Claude AI görüntüyü analiz ediyor...</p>
                </div>
              ) : result ? (
                <textarea
                  value={result}
                  onChange={e => setResult(e.target.value)}
                  className="w-full h-full resize-none text-sm text-gray-800 leading-relaxed outline-none font-mono"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <ScanText className="w-12 h-12 mb-3" />
                  <p className="text-sm">Görüntü yükleyip işlemi başlatın</p>
                </div>
              )}
            </div>
            {result && (
              <div className="px-5 pb-5 flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
                  Panoya Kopyala
                </button>
                <button
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(result)
                    a.download = 'ocr-sonuc.txt'
                    a.click()
                  }}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors">
                  .txt İndir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
