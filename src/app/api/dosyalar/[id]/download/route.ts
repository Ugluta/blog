import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await db.file.findUnique({
    where: { id, status: 'APPROVED', isActive: true },
  });

  if (!file) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });

  // Premium dosya kontrolü
  if (file.isPremium) {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/giris', req.url));
    }
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user?.membershipPlanId) {
      return NextResponse.redirect(new URL('/uyelik', req.url));
    }
  }

  // Download log
  const session = await auth();
  await db.download.create({
    data: {
      fileId: file.id,
      userId: session?.user?.id || null,
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || '',
    },
  });

  await db.file.update({
    where: { id: file.id },
    data: { downloadCount: { increment: 1 } },
  });

  // Serve file
  try {
    const filePath = path.join(process.cwd(), 'public', file.filePath);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': file.mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.fileName)}"`,
        'Content-Length': file.fileSize.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Dosya okunamadı' }, { status: 500 });
  }
}
