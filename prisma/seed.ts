import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL ve ADMIN_PASSWORD .env dosyasında tanımlı olmalı (bkz. .env.example)."
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });

  const muzik = await prisma.category.upsert({
    where: { slug: "muzik" },
    update: {},
    create: { name: "Müzik", slug: "muzik" },
  });

  await prisma.category.upsert({
    where: { slug: "muzik-haberleri" },
    update: {},
    create: { name: "Müzik Haberleri", slug: "muzik-haberleri", parentId: muzik.id },
  });

  const exampleSourceUrl = "https://example.com/feed";
  const existingSource = await prisma.source.findFirst({ where: { url: exampleSourceUrl } });
  if (!existingSource) {
    await prisma.source.create({
      data: {
        name: "Örnek RSS Kaynağı",
        url: exampleSourceUrl,
        type: "RSS",
        active: false,
        categoryId: muzik.id,
      },
    });
  }

  console.log(`Seed tamam. Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
