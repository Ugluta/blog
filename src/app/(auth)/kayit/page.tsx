'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';

const SCHOOL_TYPES = [
  { value: 'ANAOKULU', label: 'Anaokulu' },
  { value: 'ILKOKUL', label: 'İlkokul' },
  { value: 'ORTAOKUL', label: 'Ortaokul' },
  { value: 'LISE', label: 'Lise' },
  { value: 'IMAM_HATIP', label: 'İmam Hatip' },
  { value: 'MESLEK_LISESI', label: 'Meslek Lisesi' },
  { value: 'OZEL_EGITIM', label: 'Özel Eğitim' },
  { value: 'UNIVERSITE', label: 'Üniversite' },
];

export default function KayitPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'TEACHER', schoolType: '', school: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Kayıt sırasında hata oluştu.');
    } else {
      router.push('/giris?registered=1');
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Hesap Oluştur</h1>
          <p className="text-gray-500 text-sm mt-1">Ücretsiz üye ol, hemen kullan</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Adınız Soyadınız"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ornek@email.com"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required minLength={8} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="En az 8 karakter"
                  className="w-full h-10 px-3 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Görev</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="TEACHER">Öğretmen</option>
                <option value="ADMIN_STAFF">İdareci</option>
                <option value="MEMBER">Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Okul Türü</label>
              <select value={form.schoolType} onChange={(e) => setForm({ ...form, schoolType: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seçiniz</option>
                {SCHOOL_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" required className="mt-0.5 rounded border-gray-300" />
              <span><Link href="/kullanim-kosullari" className="text-blue-600 hover:underline">Kullanım Koşulları</Link>&apos;nı ve <Link href="/gizlilik" className="text-blue-600 hover:underline">Gizlilik Politikası</Link>&apos;nı kabul ediyorum.</span>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Zaten üye misiniz? <Link href="/giris" className="text-blue-600 font-medium hover:underline">Giriş Yapın</Link>
        </p>
      </div>
    </div>
  );
}
