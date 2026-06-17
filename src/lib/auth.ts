import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import LinkedInProvider from "next-auth/providers/linkedin";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import AppleProvider from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// UserRole matches prisma enum — generated client not available at build time without DB
type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "PUBLISHER" | "VIEWER";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { subscription: { include: { package: true } } },
        });
        if (!user?.password) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    ...(process.env.TWITTER_CLIENT_ID ? [
      TwitterProvider({
        clientId: process.env.TWITTER_CLIENT_ID!,
        clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      }),
    ] : []),

    ...(process.env.LINKEDIN_CLIENT_ID ? [
      LinkedInProvider({
        clientId: process.env.LINKEDIN_CLIENT_ID!,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        authorization: {
          params: { scope: "openid profile email w_member_social" },
        },
      }),
    ] : []),

    ...(process.env.FACEBOOK_CLIENT_ID ? [
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      }),
    ] : []),

    ...(process.env.GITHUB_CLIENT_ID ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
    ] : []),

    ...(process.env.APPLE_CLIENT_ID ? [
      AppleProvider({
        clientId: process.env.APPLE_CLIENT_ID!,
        clientSecret: process.env.APPLE_CLIENT_SECRET!,
      }),
    ] : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role ?? "VIEWER";
      }
      // Store provider access token for social posting
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (!account || account.type === "credentials") return true;

      // For OAuth logins, store social account tokens in DB
      if (user.id && account.access_token) {
        try {
          const mod = await import("@/lib/prisma");
          const db = mod.prisma;
          const platformMap: Record<string, string> = {
            google: "GOOGLE",
            twitter: "TWITTER",
            linkedin: "LINKEDIN",
            facebook: "FACEBOOK_PAGE",
            tiktok: "TIKTOK",
          };
          const platform = platformMap[account.provider];
          if (platform) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (db as any).socialAccount?.upsert({
              where: {
                userId_platform_platformUserId: {
                  userId: user.id,
                  platform,
                  platformUserId: account.providerAccountId,
                },
              },
              create: {
                userId: user.id,
                platform,
                platformUserId: account.providerAccountId,
                displayName: user.name ?? "",
                accessToken: account.access_token,
                refreshToken: account.refresh_token ?? null,
                tokenExpiresAt: account.expires_at
                  ? new Date(account.expires_at * 1000)
                  : null,
                scope: account.scope ?? null,
              },
              update: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token ?? null,
                tokenExpiresAt: account.expires_at
                  ? new Date(account.expires_at * 1000)
                  : null,
              },
            }).catch(() => null);
          }
        } catch {
          // DB unavailable — don't block sign in
        }
      }
      return true;
    },
  },
});
