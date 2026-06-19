import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const group = await db.group.findUnique({ where: { id } })
  if (!group || !group.isActive) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    await db.groupMember.create({
      data: { groupId: id, userId: session.user.id },
    })
  } catch {
    // already a member — unique constraint violation, treat as success
  }

  return NextResponse.json({ success: true })
}
