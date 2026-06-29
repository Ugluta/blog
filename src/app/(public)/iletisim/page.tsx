'use client'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { Mail, Clock, MessageSquare } from 'lucide-react'

export default function IletisimPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/iletisim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="border-b border-gray-100 py-14 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">İletişim</h1>
            <p className="text-gray-500">Sorularınız, önerileriniz veya iş birliği için bana ulaşın.</p>
          </div>
        </section>

        <section className="py-14 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">E-posta</p>
                  <a href="mailto:iletisim@ikie.net" className="text-sm text-blue-600 hover:underline">iletisim@ikie.net</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">Yanıt Süresi</p>
                  <p className="text-sm text-gray-500">Genellikle 1-2 iş günü içinde</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><MessageSquare className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">Konular</p>
                  <p className="text-sm text-gray-500">Proje, hizmet, iş birliği, öneri</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              {status === 'sent' ? (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><Mail className="w-6 h-6 text-green-600" /></div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Mesajınız alındı</h2>
                  <p className="text-sm text-gray-500">En kısa sürede size geri döneceğim.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">Gönderilemedi, lütfen tekrar deneyin.</p>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Adınız Soyadınız" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@ornek.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Konu</label>
                    <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mesajınızın konusu" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesaj</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Mesajınızı buraya yazın..." />
                  </div>
                  <button type="submit" disabled={status === 'sending'}
                    className="h-11 px-6 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                    {status === 'sending' ? 'Gönderiliyor…' : 'Gönder'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
