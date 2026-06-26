'use client';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterXIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialButtons() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocial = async (provider: string) => {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="space-y-3 mb-5">
      <button
        onClick={() => handleSocial('google')}
        disabled={!!loadingProvider}
        className="w-full flex items-center justify-center gap-3 h-11 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {loadingProvider === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
        Google ile Giriş Yap
      </button>

      <button
        onClick={() => handleSocial('facebook')}
        disabled={!!loadingProvider}
        className="w-full flex items-center justify-center gap-3 h-11 bg-[#1877F2] rounded-xl text-sm font-medium text-white hover:bg-[#166FE5] transition-colors disabled:opacity-60"
      >
        {loadingProvider === 'facebook' ? <Loader2 className="w-5 h-5 animate-spin" /> : <FacebookIcon />}
        Facebook ile Giriş Yap
      </button>

      <button
        onClick={() => handleSocial('twitter')}
        disabled={!!loadingProvider}
        className="w-full flex items-center justify-center gap-3 h-11 bg-black rounded-xl text-sm font-medium text-white hover:bg-gray-900 transition-colors disabled:opacity-60"
      >
        {loadingProvider === 'twitter' ? <Loader2 className="w-5 h-5 animate-spin" /> : <TwitterXIcon />}
        X (Twitter) ile Giriş Yap
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 whitespace-nowrap">veya e-posta ile</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    </div>
  );
}

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

      <SocialButtons />

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
