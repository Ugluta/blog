import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const adminPaths = ['/admin'];
const authPaths = ['/giris', '/kayit'];

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role || 'GUEST';

  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p));
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));

  if (isAdminPath) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/giris?redirect=' + pathname, req.url));
    }
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR'];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (isAuthPath && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads|images).*)'],
};
