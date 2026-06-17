// Prisma client — run `npx prisma generate` after setting DATABASE_URL
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PrismaClientClass: any;
try {
  // Will be available after `npx prisma generate`
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PrismaClientClass = require("@/generated/prisma").PrismaClient;
} catch {
  PrismaClientClass = null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma: any =
  PrismaClientClass
    ? (globalForPrisma.prisma ?? new PrismaClientClass({ log: [] }))
    : null;

if (PrismaClientClass && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
