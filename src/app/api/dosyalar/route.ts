import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { slug } from '@/lib/utils';
import type { SchoolType, FileType, FileStatus } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('sayfa')) || 1;
    const perPage = Number(searchParams.get('limit')) || 24;
    const search = searchParams.get('ara') || '';
    const okul = searchParams.get('okul') as SchoolType | null;
    const kategori = searchParams.get('kategori');
    const ders = searchParams.get('ders');
    const durum = searchParams.get('durum') as FileStatus | null;
    const isAdmin = searchParams.get('admin') === '1';

    const where = {
      ...(!isAdmin && { status: 'APPROVED' as const, isActive: true }),
      ...(durum && { status: durum }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { tags: { has: search } },
        ],
      }),
      ...(okul && { schoolTypes: { has: okul } }),
      ...(kategori && { category: { slug: kategori } }),
      ...(ders && { subject: { slug: ders } }),
    };

    const [data, total] = await Promise.all([
      db.file.findMany({
        where,
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true } },
          subject: { select: { name: true, slug: true, color: true } },
          grade: { select: { name: true, level: true } },
        },
        orderBy: { downloadCount: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.file.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, fileName, filePath, fileSize, fileType, mimeType,
      categoryId, subjectId, gradeId, schoolTypes, tags, isPremium } = body;

    if (!title || !fileName || !filePath || !fileSize || !fileType || !mimeType) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 });
    }

    const fileSlug = slug(title) + '-' + Date.now();

    const file = await db.file.create({
      data: {
        title,
        slug: fileSlug,
        description,
        fileName,
        filePath,
        fileSize: Number(fileSize),
        fileType: fileType as FileType,
        mimeType,
        categoryId: categoryId || null,
        subjectId: subjectId || null,
        gradeId: gradeId || null,
        schoolTypes: schoolTypes || [],
        tags: tags || [],
        authorId: session.user.id,
        isPremium: !!isPremium,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, data: file }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
