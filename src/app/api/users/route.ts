import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import type { Role, MembershipStatus, SchoolType } from '@prisma/client';

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, username: true, role: true, membershipStatus: true, schoolType: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const { name, email, password, username, role: userRole, membershipStatus, schoolType, phone, city, bio } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Ad, e-posta ve şifre zorunlu' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 });
  }

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: 'Bu e-posta zaten kullanılıyor' }, { status: 409 });

  if (username) {
    const usernameTaken = await db.user.findUnique({ where: { username } });
    if (usernameTaken) return NextResponse.json({ error: 'Bu kullanıcı adı alınmış' }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: {
      name, email, password: hashed,
      username: username || null,
      role: (userRole as Role) || 'MEMBER',
      membershipStatus: (membershipStatus as MembershipStatus) || 'ACTIVE',
      schoolType: schoolType ? (schoolType as SchoolType) : null,
      phone: phone || null,
      city: city || null,
      bio: bio || null,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user, { status: 201 });
}
