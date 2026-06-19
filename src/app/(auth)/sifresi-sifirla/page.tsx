'use client'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'

function SifresiSifirlaContent() {
  const sp = useSearchParams()
  const router = useRouter()
  const token = sp.get('token') || ''
  const email = sp.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!token || !email) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 mb-4">Geçersiz veya eksik sıfırlama bağlantısı.</p>
        <Link href="/sifremi-unuttum" className="text-blue-600 hover:underline text-sm">
          Yeni bağlantı iste
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Şifreler eşleşmiyor')
      return
    }
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/sifresi-sifirla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, password }),
    })
    setLoading(false)
    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push('/giris'), 3000)
    } else {
      const d = await res.json()
      setError(d.error || 'Bir hata oluştu')
    }
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h2 className="font-semibold text-gray-900 mb-1">Şifre Güncellendi</h2>
        <p className="text-sm text-gray-500">
          Yeni şifrenizle giriş yapabilirsiniz. Giriş sayfasına yönlendiriliyorsunuz...
        </p>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Yeni Şifre</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 8 karakter"
              className="w-full h-10 px-3 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre Tekrar</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Şifrenizi tekrar girin"
            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
        </button>
      </form>
    </>
  )
}

export default function SifresiSifirlaPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-blue-600">Öğretmen</span>Evrak
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Yeni Şifre Belirle</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          }>
            <SifresiSifirlaContent />
          </Suspense>
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
