import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Yönetici';

  if (!email || !password) {
    console.error('\nKullanım:');
    console.error('  ADMIN_EMAIL=ornek@mail.com ADMIN_PASSWORD=sifre123 npx tsx prisma/create-admin.ts\n');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await db.user.upsert({
    where: { email },
    create: {
      email,
      name,
      password: hashed,
      role: 'SUPER_ADMIN',
      membershipStatus: 'ACTIVE',
    },
    update: {
      role: 'SUPER_ADMIN',
      password: hashed,
    },
  });

  console.log(`\n✅ SUPER_ADMIN hazır: ${user.email} (${user.name})`);
  console.log('   Bu e-posta/şifre ile /giris adresinden giriş yapabilirsin.\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
