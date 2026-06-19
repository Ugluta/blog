import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Heart, FileText, Download, Eye } from 'lucide-react'

const FILE_TYPE_ICONS: Record<string, string> = {
  PDF: '📄', WORD: '📝', EXCEL: '📊', POWERPOINT: '📊',
  IMAGE: '🖼️', VIDEO: '🎬', AUDIO: '🎵', ZIP: '🗜️', OTHER: '📁',
}

export const metadata = {
  title: 'Favorilerim',
}

export default async function FavorilerimPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/giris?callbackUrl=/favorilerim')

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      file: {
        select: {
          id: true, title: true, slug: true, fileType: true,
          downloadCount: true, viewCount: true,
          subject: { select: { name: true } },
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          Favorilerim
        </h1>
        <p className="text-gray-500 mt-1">{favorites.length} kaydedilmiş dosya</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">Henüz favori eklemediniz</p>
          <p className="text-gray-400 text-sm mb-6">Dosyaları favorilere ekleyerek buradan kolayca erişebilirsiniz.</p>
          <Link
            href="/dosyalar"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            <FileText className="w-4 h-4" /> Dosyalara Göz At
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all p-4 flex flex-col"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-lg shrink-0">
                  {FILE_TYPE_ICONS[fav.file.fileType] || '📁'}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/dosyalar/${fav.file.slug}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2 leading-snug"
                  >
                    {fav.file.title}
                  </Link>
                  {fav.file.subject && (
                    <p className="text-xs text-blue-600 mt-0.5">{fav.file.subject.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {fav.file.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" /> {fav.file.downloadCount}
                </span>
                <Link
                  href={`/dosyalar/${fav.file.slug}`}
                  className="ml-auto text-xs text-blue-600 hover:underline font-medium"
                >
                  Görüntüle
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
