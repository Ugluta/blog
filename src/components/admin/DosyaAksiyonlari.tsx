'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Eye } from 'lucide-react'
import Link from 'next/link'

interface Props {
  fileId: string
  currentStatus: string
}

export function DosyaAksiyonlari({ fileId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(status: string) {
    setLoading(status)
    try {
      await fetch(`/api/dosyalar/${fileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {currentStatus === 'PENDING' && (
        <>
          <button
            onClick={() => handleAction('APPROVED')}
            disabled={loading !== null}
            className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 disabled:opacity-50"
            title="Onayla"
          >
            {loading === 'APPROVED' ? (
              <span className="block w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleAction('REJECTED')}
            disabled={loading !== null}
            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 disabled:opacity-50"
            title="Reddet"
          >
            {loading === 'REJECTED' ? (
              <span className="block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        </>
      )}
      <Link
        href={`/admin/dosyalar/${fileId}`}
        className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        title="Detay"
      >
        <Eye className="w-4 h-4" />
      </Link>
    </div>
  )
}
