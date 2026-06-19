'use client'

import { useState } from 'react'

export function JoinGroupButton({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(false)

  async function handleJoin() {
    setLoading(true)
    const res = await fetch(`/api/gruplar/${groupId}/katil`, { method: 'POST' })
    if (res.ok) setJoined(true)
    setLoading(false)
  }

  if (joined) {
    return (
      <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200">
        ✓ Katıldınız
      </span>
    )
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      {loading ? 'Katılıyor...' : 'Gruba Katıl'}
    </button>
  )
}
