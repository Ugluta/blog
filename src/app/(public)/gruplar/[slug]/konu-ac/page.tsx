import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CreatePostForm } from '@/components/CreatePostForm'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function KonuAcPage({ params }: Props) {
  const { slug } = await params
  const session = await auth()

  if (!session?.user?.id) {
    redirect(`/giris?next=/gruplar/${slug}/konu-ac`)
  }

  const group = await db.group.findFirst({ where: { slug, isActive: true } })
  if (!group) notFound()

  const isMember = !!(await db.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId: session.user.id } },
  }))

  if (!isMember) redirect(`/gruplar/${slug}`)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container-custom py-8 max-w-2xl mx-auto">
          <Link
            href={`/gruplar/${slug}`}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> {group.name}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Konu Aç</h1>
          <CreatePostForm groupId={group.id} groupSlug={slug} />
        </div>
      </main>
      <Footer />
    </>
  )
}
