'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Sparkles, Copy, Download, Check, Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

type DocType = {
  key: string
  label: string
  prompt: (fields: Record<string, string>) => string
  fields: { key: string; label: string; placeholder: string; type?: string }[]
}

const DOC_TYPES: DocType[] = [
  {
    key: 'ders-plani',
    label: 'Ders Planı',
    fields: [
      { key: 'sinif', label: 'Sınıf', placeholder: '5. Sınıf' },
      { key: 'ders', label: 'Ders', placeholder: 'Matematik' },
      { key: 'konu', label: 'Konu', placeholder: 'Kesirler' },
      { key: 'sure', label: 'Süre', placeholder: '40 dakika' },
      { key: 'kazanimlar', label: 'Kazanımlar (isteğe bağlı)', placeholder: 'Öğrenciler kesirleri karşılaştırabilecek...', type: 'textarea' },
    ],
    prompt: (f) =>
      `${f.sinif} seviyesi ${f.ders} dersi için "${f.konu}" konusunda ${f.sure} süreli ders planı hazırla.${f.kazanimlar ? ` Kazanımlar: ${f.kazanimlar}` : ''} MEB formatına uygun, Türkçe ve profesyonel bir ders planı oluştur. Giriş, gelişme ve sonuç aşamalarını, yöntem ve teknikleri, kullanılacak materyalleri ve değlendirme yöntemini belirt.`,
  },
  {
    key: 'sinav',
    label: 'Sınav Soruları',
    fields: [
      { key: 'sinif', label: 'Sınıf', placeholder: '8. Sınıf' },
      { key: 'ders', label: 'Ders', placeholder: 'Türkçe' },
      { key: 'konu', label: 'Konu', placeholder: 'Cümlede Anlam' },
      { key: 'sayi', label: 'Soru Sayısı', placeholder: '10' },
      { key: 'tur', label: 'Soru Türü', placeholder: 'Çoktan seçmeli ve açık uçlu karışık' },
    ],
    prompt: (f) =>
      `${f.sinif} seviyesi ${f.ders} dersi "${f.konu}" konusunda ${f.sayi} soruluk ${f.tur} sınav hazırla. Her sorunun cevabını da belirt. Zorluk dengeli olsun.`,
  },
  {
    key: 'dilekce',
    label: 'Dilekçe',
    fields: [
      { key: 'konu', label: 'Dilekçe Konusu', placeholder: 'İzin talebi, tayin, nakil, vb.' },
      { key: 'gonderen', label: 'Gönderen (Unvan/Ad)', placeholder: 'Sınıf Öğretmeni Ahmet Yılmaz' },
      { key: 'alici', label: 'Alıcı Makam', placeholder: 'Okul Müdürlüğüne' },
      { key: 'detay', label: 'Detaylar', placeholder: 'Talep veya açıklamalar...', type: 'textarea' },
    ],
    prompt: (f) =>
      `"${f.alici}" adresli, ${f.gonderen} tarafından yazılan "${f.konu}" konulu resmi dilekçe yaz. Detaylar: ${f.detay}. Resmi Türkçe dil kurallarına uygun, MEB formatına uygun dilekçe oluştur.`,
  },
  {
    key: 'veli-bildirimi',
    label: 'Veli Bildirimi',
    fields: [
      { key: 'konu', label: 'Bildirim Konusu', placeholder: 'Toplantı, etkinlik, sınav vb.' },
      { key: 'tarih', label: 'Tarih/Zaman', placeholder: '15 Ocak 2025, Saat 18:00' },
      { key: 'okul', label: 'Okul Adı', placeholder: 'Atatürk İlkokulu' },
      { key: 'ek', label: 'Ek Bilgiler (isteğe bağlı)', placeholder: 'Velilerin bilmesi gereken notlar...', type: 'textarea' },
    ],
    prompt: (f) =>
      `${f.okul} için velilere yönelik "${f.konu}" konulu duyuru/bildirim metni yaz. Tarih/Zaman: ${f.tarih}.${f.ek ? ` Ek bilgiler: ${f.ek}` : ''} Resmi ama samimi bir dil kullan, Türkçe yaz.`,
  },
  {
    key: 'ogrenci-degerlendirme',
    label: 'Öğrenci Değerlendirme',
    fields: [
      { key: 'sinif', label: 'Sınıf/Seviye', placeholder: '4. Sınıf' },
      { key: 'ogrenci', label: 'Öğrenci Adı (isteğe bağlı)', placeholder: 'Ahmet (veya boş bırakın)' },
      { key: 'guclu', label: 'Güçlü Yönler', placeholder: 'Matematik, dikkat, işbirliği...', type: 'textarea' },
      { key: 'gelisim', label: 'Gelişim Alanları', placeholder: 'Okuma hızı, yazım...', type: 'textarea' },
    ],
    prompt: (f) =>
      `${f.sinif} seviyesindeki${f.ogrenci ? ` ${f.ogrenci} adlı` : ''} bir öğrenci için karne/gelişim raporu yorumu yaz. Güçlü yönleri: ${f.guclu}. Gelişim alanları: ${f.gelisim}. Pozitif, yapıcı ve profesyonel Türkçe dil kullan.`,
  },
  {
    key: 'serbest',
    label: 'Serbest Belge',
    fields: [
      { key: 'belge', label: 'Belge Türü', placeholder: 'Tutanak, rapor, protokol...' },
      { key: 'icerik', label: 'İçerik / Prompt', placeholder: 'Belgenin içeriğini ve amacını detaylı açıklayın...', type: 'textarea' },
    ],
    prompt: (f) =>
      `${f.belge} belgesi oluştur. ${f.icerik} Resmi Türkçe dil kurallarına uygun, MEB formatına uygun yaz.`,
  },
]

export default function BelgeOlusturPage() {
  const { status } = useSession()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState(DOC_TYPES[0])
  const [fields, setFields] = useState<Record<string, string>>({})
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/giris?next=/belge-olustur')
  }, [status, router])

  useEffect(() => {
    const init: Record<string, string> = {}
    selectedType.fields.forEach((f) => { init[f.key] = '' })
    setFields(init)
    setResult('')
  }, [selectedType])

  async function handleGenerate() {
    setLoading(true)
    try {
      const prompt = selectedType.prompt(fields)
      const res = await fetch('/api/ai/belge-olustur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setResult(data.content || '')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const a = document.createElement('a')
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(result)
    a.download = `${selectedType.label.toLowerCase().replace(/ /g, '-')}.txt`
    a.click()
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-600" />
              AI Belge Oluştur
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Yapay zeka ile saniyeler içinde profesyonel eğitim belgesi hazırlayın
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sol: Form */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Belge Türü</p>
                <div className="grid grid-cols-2 gap-2">
                  {DOC_TYPES.map((dt) => (
                    <button
                      key={dt.key}
                      onClick={() => setSelectedType(dt)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium text-left transition-colors ${
                        selectedType.key === dt.key
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                <p className="text-sm font-medium text-gray-700">{selectedType.label} Bilgileri</p>
                {selectedType.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={fields[field.key] || ''}
                        onChange={(e) => setFields((f) => ({ ...f, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={fields[field.key] || ''}
                        onChange={(e) => setFields((f) => ({ ...f, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Oluşturuluyor...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Belge Oluştur</>
                )}
              </button>
            </div>

            {/* Sağ: Sonuç */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">Oluşturulan Belge</h2>
                {result && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 flex items-center gap-1"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copied ? 'Kopyalandı' : 'Kopyala'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> .txt İndir
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder={
                  loading
                    ? 'AI belgesi oluşturuluyor...'
                    : 'Belge burada görünecek. Oluşturduktan sonra düzenleyebilirsiniz.'
                }
                rows={28}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
