'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

export function ReplyForm({
  postId,
  groupId,
}: {
  postId: string
  groupId: string
}) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError('')
    const res = await fetch(`/api/gruplar/${groupId}/konular/${postId}/yanit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    setLoading(false)
    if (res.ok) {
      setContent('')
      window.location.reload()
    } else {
      const d = await res.json()
      setError(d.error || 'Bir hata oluştu')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Yanıt Yaz</h3>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Yanıtınızı yazın..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
          required
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Gönderiliyor...' : 'Yanıt Gönder'}
        </button>
      </form>
    </div>
  )
}
