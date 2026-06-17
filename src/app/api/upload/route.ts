import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024; // 50MB

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'WORD',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'WORD',
  'application/vnd.ms-excel': 'EXCEL',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'EXCEL',
  'application/vnd.ms-powerpoint': 'POWERPOINT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'POWERPOINT',
  'image/jpeg': 'IMAGE',
  'image/png': 'IMAGE',
  'image/gif': 'IMAGE',
  'image/webp': 'IMAGE',
  'application/zip': 'ZIP',
  'application/x-zip-compressed': 'ZIP',
  'video/mp4': 'VIDEO',
  'audio/mpeg': 'AUDIO',
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Giriş yapılması gerekiyor' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya seçilmedi' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `Dosya boyutu ${MAX_FILE_SIZE / 1024 / 1024}MB\'ı aşamaz` }, { status: 413 });
    }

    const fileType = ALLOWED_TYPES[file.type];
    if (!fileType) {
      return NextResponse.json({ error: 'Desteklenmeyen dosya formatı' }, { status: 415 });
    }

    const ext = file.name.split('.').pop() || '';
    const fileName = `${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', new Date().getFullYear().toString());

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, fileName), buffer);

    const filePath = `/uploads/${new Date().getFullYear()}/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        filePath,
        fileSize: file.size,
        fileType,
        mimeType: file.type,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Yükleme hatası: ' + String(error) }, { status: 500 });
  }
}
