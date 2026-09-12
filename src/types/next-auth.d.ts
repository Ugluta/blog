import type { DefaultSession } from "next-auth";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "PUBLISHER" | "VIEWER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
