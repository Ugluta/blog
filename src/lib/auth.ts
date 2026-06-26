import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import Twitter from 'next-auth/providers/twitter';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: Role;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/giris',
    error: '/giris',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID ?? '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET ?? '',
      version: '2.0',
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role;
      }
      if (account?.type === 'oauth' || (!token.role && (token.id ?? token.sub))) {
        const dbUser = await db.user.findUnique({
          where: { id: (token.id ?? token.sub) as string },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = (token.id ?? token.sub) as string;
        session.user.role = (token.role as Role) ?? 'MEMBER';
      }
      return session;
    },
  },
});

export function hasRole(userRole: Role | undefined, requiredRole: Role): boolean {
  if (!userRole) return false;
  const hierarchy: Role[] = [
    'GUEST', 'MEMBER', 'TEACHER', 'ADMIN_STAFF',
    'MODERATOR', 'EDITOR', 'ADMIN', 'SUPER_ADMIN',
  ] as Role[];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
}

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as { id: string; email: string; name: string | null; image: string | null; role: Role };
}
