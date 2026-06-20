'use client';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

function GirisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sifirlandimi = searchParams.get('sifre-sifirlanda') === '1';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError('E-posta veya şifre hatalı.');
    } else {
      router.push('/');
    }
  };

  return (
    <>
      {sifirlandimi && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg mb-4">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="ornek@email.com"
            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="········"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded border-gray-300" /> Beni hatırla
          </label>
          <Link href="/sifremi-unuttum" className="text-sm text-blue-600 hover:underline">Şifremi unuttum</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </>
  );
}

export default function GirisPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold"><span className="text-blue-600">Eğitim</span>Portal</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Giriş Yap</h1>
          <p className="text-gray-500 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <Suspense fallback={
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          }>
            <GirisContent />
          </Suspense>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="text-blue-600 font-medium hover:underline">Üye Ol</Link>
        </p>
      </div>
    </div>
  );
}
