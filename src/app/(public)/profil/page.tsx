import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate, ROLE_LABELS, SCHOOL_TYPE_LABELS } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Profilim' }

export default async function ProfilPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris?next=/profil')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      membershipPlan: { select: { name: true } },
      _count: { select: { files: true, downloads: true, documents: true } },
      files: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { id: true, title: true, slug: true, fileType: true, downloadCount: true, createdAt: true },
      },
    },
  })

  if (!user) redirect('/giris')

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{user.name || 'İsimsiz Kullanıcı'}</h1>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
                {user.schoolType && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {SCHOOL_TYPE_LABELS[user.schoolType] || user.schoolType}
                  </span>
                )}
                {user.membershipPlan && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {user.membershipPlan.name}
                  </span>
                )}
              </div>
              {user.bio && <p className="text-gray-600 text-sm mt-3 leading-relaxed">{user.bio}</p>}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                {user.city && <span>📍 {user.city}</span>}
                <span>📅 {formatDate(user.createdAt)} tarihinde katıldı</span>
              </div>
            </div>
            <Link href="/profil/ayarlar"
              className="shrink-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
              Düzenle
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{user._count.files}</p>
              <p className="text-sm text-gray-500 mt-1">Yüklenen Dosya</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-2xl font-bold text-gray-900">{user._count.downloads}</p>
              <p className="text-sm text-gray-500 mt-1">İndirme</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{user._count.documents}</p>
              <p className="text-sm text-gray-500 mt-1">Belge</p>
            </div>
          </div>
        </div>

        {/* Recent Files */}
        {user.files.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Son Yüklenen Dosyalar</h2>
            <div className="divide-y divide-gray-50">
              {user.files.map(file => (
                <Link key={file.id} href={`/dosyalar/${file.slug}`}
                  className="flex items-center gap-3 py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    file.fileType === 'PDF' ? 'bg-red-100 text-red-600' :
                    file.fileType === 'WORD' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>{file.fileType?.slice(0,3)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(file.createdAt)}</p>
                  </div>
                  <span className="text-xs text-gray-400">{file.downloadCount} indirme</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
