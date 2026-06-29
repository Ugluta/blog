import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { formatDate, getFileTypeColor } from '@/lib/utils'
import { Upload, Download, Eye } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dosyalarım' }

const STATUS_STYLES: Record<string, { label: string; style: string }> = {
  PENDING:  { label: 'İncelemede', style: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'Onaylandı',  style: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Reddedildi', style: 'bg-red-100 text-red-700' },
  DRAFT:    { label: 'Taslak',     style: 'bg-gray-100 text-gray-600' },
}

export default async function DosyalarimPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris?next=/dosyalarim')

  const files = await db.file.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      fileType: true,
      fileSize: true,
      status: true,
      downloadCount: true,
      viewCount: true,
      isPremium: true,
      createdAt: true,
    },
  })

  const approved = files.filter((f) => f.status === 'APPROVED').length
  const pending  = files.filter((f) => f.status === 'PENDING').length
  const rejected = files.filter((f) => f.status === 'REJECTED').length

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dosyalarım</h1>
              <p className="text-gray-500 text-sm mt-1">Yüklediğiniz tüm dosyalar</p>
            </div>
            <Link
              href="/dosyalar/yukle"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" /> Yeni Dosya Yükle
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
              <p className="text-2xl font-bold text-green-600">{approved}</p>
              <p className="text-sm text-gray-500 mt-1">Onaylandı</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
              <p className="text-2xl font-bold text-yellow-600">{pending}</p>
              <p className="text-sm text-gray-500 mt-1">İncelemede</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
              <p className="text-2xl font-bold text-red-600">{rejected}</p>
              <p className="text-sm text-gray-500 mt-1">Reddedildi</p>
            </div>
          </div>

          {files.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center">
              <p className="text-gray-400 mb-4">Henüz dosya yüklemediniz</p>
              <Link href="/dosyalar/yukle" className="text-blue-600 hover:underline text-sm">
                Dosya yükle →
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Dosya
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Görüntülenme
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        İndirme
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {files.map((file) => {
                      const status = STATUS_STYLES[file.status] ?? STATUS_STYLES.DRAFT
                      return (
                        <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${getFileTypeColor(file.fileType)}`}
                              >
                                {file.fileType?.slice(0, 3)}
                              </div>
                              <div className="min-w-0">
                                {file.status === 'APPROVED' ? (
                                  <Link
                                    href={`/dosyalar/${file.slug}`}
                                    className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-1"
                                  >
                                    {file.title}
                                  </Link>
                                ) : (
                                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                    {file.title}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.style}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="flex items-center justify-end gap-1 text-sm text-gray-500">
                              <Eye className="w-3.5 h-3.5" />
                              {file.viewCount.toLocaleString('tr-TR')}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="flex items-center justify-end gap-1 text-sm text-gray-500">
                              <Download className="w-3.5 h-3.5" />
                              {file.downloadCount.toLocaleString('tr-TR')}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right text-sm text-gray-400 whitespace-nowrap">
                            {formatDate(file.createdAt)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
