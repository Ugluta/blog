'use client'
import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Loader2, CheckCircle } from 'lucide-react'

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/sifremi-unuttum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    if (res.ok) {
      setSent(true)
    } else {
      const d = await res.json()
      setError(d.error || 'Bir hata oluştu')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-blue-600">Eğitim</span>Portal
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Şifremi Unuttum</h1>
          <p className="text-gray-500 text-sm mt-1">
            E-postanızı girin, şifre sıfırlama bağlantısı gönderelim
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h2 className="font-semibold text-gray-900 mb-1">E-posta Gönderildi</h2>
              <p className="text-sm text-gray-500">
                <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
                Gelen kutunuzu kontrol edin.
              </p>
              <p className="text-xs text-gray-400 mt-3">
                E-posta birkaç dakika içinde ulaşmalıdır. Spam klasörünü de kontrol edin.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/giris" className="text-blue-600 font-medium hover:underline">
            Girişe Dön
          </Link>
        </p>
      </div>
    </div>
  )
}
