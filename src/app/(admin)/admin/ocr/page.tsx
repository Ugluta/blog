'use client'

import { useState, useRef } from 'react'
import { ScanText, Upload, Copy, Check, FileImage, Loader2, Wand2 } from 'lucide-react'

export default function OcrPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'extract' | 'clean' | 'summary'>('extract')
  const [dragOver, setDragOver] = useState(false)

  const MODE_LABELS = {
    extract: 'Metni Çıkar',
    clean:   'Çıkar & Düzenle',
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
    } finally { setLoading(false) }
  }

  function copyResult() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <ScanText className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">OCR — Görüntüden Metin</h1>
          <p className="text-sm text-gray-500">Fotoğraf veya PDF'ten metin çıkarın, Claude AI ile düzenleyin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol: Yükleme */}
        <div className="space-y-4">
          {/* Mod seçimi */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">İşlem Modu</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(MODE_LABELS) as [typeof mode, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setMode(key)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    mode === key
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {mode === 'extract' && 'Görseldeki metni olduğu gibi çıkarır'}
              {mode === 'clean' && 'Çıkarılan metni imla ve format açısından düzenler'}
              {mode === 'summary' && 'Belgenin kısa özetini çıkarır'}
            </p>
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl transition-colors ${
              dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300 bg-white'
            }`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          >
            {preview ? (
              <div className="p-4">
                {preview.startsWith('data:image') ? (
                  <img src={preview} alt="Önizleme" className="w-full rounded-lg object-contain max-h-64" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FileImage className="w-12 h-12 mb-2 text-purple-400" />
                    <p className="text-sm font-medium">{fileName}</p>
                    <p className="text-xs text-gray-400 mt-1">PDF dosyası yüklendi</p>
                  </div>
                )}
                <button onClick={() => { setPreview(null); setFileName(''); setResult('') }}
                  className="mt-3 w-full text-xs text-gray-500 hover:text-red-500">
                  Kaldır
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                className="w-full p-10 flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 transition-colors">
                <Upload className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm font-medium">Görüntü veya PDF sürükleyin</p>
                <p className="text-xs mt-1">veya tıklayarak seçin — JPG, PNG, PDF</p>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

          <button onClick={handleOcr} disabled={!preview || loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors">
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> İşleniyor...</>
              : <><Wand2 className="w-4 h-4" /> {MODE_LABELS[mode]}</>}
          </button>
        </div>

        {/* Sağ: Sonuç */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col" style={{ minHeight: 400 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Sonuç</span>
            {result && (
              <button onClick={copyResult}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800">
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            )}
          </div>
          <div className="flex-1 p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-3" />
                <p className="text-sm">Claude AI görüntüyü analiz ediyor...</p>
              </div>
            ) : result ? (
              <textarea
                value={result}
                onChange={e => setResult(e.target.value)}
                className="w-full h-full resize-none text-sm text-gray-800 leading-relaxed outline-none font-mono"
                placeholder="Sonuç burada görünecek..."
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <ScanText className="w-10 h-10 mb-3" />
                <p className="text-sm">Görüntü yükleyip işlemi başlatın</p>
              </div>
            )}
          </div>
          {result && (
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                Panoya Kopyala
              </button>
              <button
                onClick={() => {
                  const a = document.createElement('a')
                  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(result)
                  a.download = 'ocr-sonuc.txt'
                  a.click()
                }}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">
                .txt İndir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
