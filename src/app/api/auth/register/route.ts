import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { Role, SchoolType } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { name, email, password, role, schoolType, school } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Ad, e-posta ve şifre zorunludur.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Şifre en az 8 karakter olmalıdır.' }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const allowedRoles: Role[] = ['TEACHER', 'ADMIN_STAFF', 'MEMBER'];
    const userRole = allowedRoles.includes(role as Role) ? (role as Role) : Role.MEMBER;

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        schoolType: schoolType as SchoolType || undefined,
        school: school || undefined,
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Kayıt sırasında hata oluştu.' }, { status: 500 });
  }
}
