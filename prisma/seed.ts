import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Packages ──────────────────────────────────────────────────────────────
  const packages = [
    {
      slug: "free",
      name: "Ücretsiz",
      description: "Başlamak için mükemmel",
      price: 0,
      yearlyPrice: 0,
      sortOrder: 0,
      isFeatured: false,
      videoPerMonth: 3,
      storageGb: 0.5,
      socialAccounts: 1,
      teamMembers: 1,
      maxVideoSeconds: 30,
      maxResolution: "720p",
      watermark: true,
      apiAccess: false,
      prioritySupport: false,
      customBranding: false,
      analyticsAccess: false,
      scheduledPosting: false,
      features: ["3 video / ay", "1 sosyal hesap", "500 MB depolama", "30 sn. video", "720p çözünürlük"],
    },
    {
      slug: "starter",
      name: "Başlangıç",
      description: "Bireysel içerik üreticiler için",
      price: 99,
      yearlyPrice: 890,
      sortOrder: 1,
      isFeatured: false,
      videoPerMonth: 20,
      storageGb: 5,
      socialAccounts: 5,
      teamMembers: 1,
      maxVideoSeconds: 60,
      maxResolution: "1080p",
      watermark: false,
      apiAccess: false,
      prioritySupport: false,
      customBranding: false,
      analyticsAccess: true,
      scheduledPosting: true,
      features: ["20 video / ay", "5 sosyal hesap", "5 GB depolama", "1080p", "Filigransız", "Zamanlı yayın"],
    },
    {
      slug: "pro",
      name: "Profesyonel",
      description: "Ajanslar ve aktif içerik ekipleri için",
      price: 299,
      yearlyPrice: 2690,
      sortOrder: 2,
      isFeatured: true,
      videoPerMonth: -1,
      storageGb: 50,
      socialAccounts: 20,
      teamMembers: 5,
      maxVideoSeconds: 300,
      maxResolution: "4K",
      watermark: false,
      apiAccess: true,
      prioritySupport: false,
      customBranding: true,
      analyticsAccess: true,
      scheduledPosting: true,
      features: ["Sınırsız video", "20 sosyal hesap", "50 GB depolama", "4K", "API erişimi", "5 ekip üyesi"],
    },
    {
      slug: "enterprise",
      name: "Kurumsal",
      description: "Büyük ekipler ve kurumsal kullanım",
      price: 999,
      yearlyPrice: 8990,
      sortOrder: 3,
      isFeatured: false,
      videoPerMonth: -1,
      storageGb: -1,
      socialAccounts: -1,
      teamMembers: -1,
      maxVideoSeconds: -1,
      maxResolution: "4K",
      watermark: false,
      apiAccess: true,
      prioritySupport: true,
      customBranding: true,
      analyticsAccess: true,
      scheduledPosting: true,
      features: ["Sınırsız her şey", "Sınırsız depolama", "SLA garantisi", "7/24 destek", "Özel onboarding"],
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
  console.log(`✓ ${packages.length} packages seeded`);

  // ── Default Categories ─────────────────────────────────────────────────────
  const rootCategories = [
    { name: "Teknoloji",  slug: "teknoloji",  order: 0 },
    { name: "Ürün",       slug: "urun",        order: 1 },
    { name: "Girişim",    slug: "girisim",     order: 2 },
    { name: "Tasarım",    slug: "tasarim",     order: 3 },
    { name: "Kariyer",    slug: "kariyer",     order: 4 },
    { name: "Kültür",     slug: "kultur",      order: 5 },
    { name: "Ekonomi",    slug: "ekonomi",     order: 6 },
  ];

  for (const cat of rootCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: cat,
    });
  }

  // Sub-categories for Teknoloji
  const teknolojiCat = await prisma.category.findUnique({ where: { slug: "teknoloji" } });
  if (teknolojiCat) {
    const subCats = [
      { name: "Yapay Zeka",      slug: "yapay-zeka",      order: 0 },
      { name: "Web Geliştirme",  slug: "web-gelistirme",  order: 1 },
      { name: "Mobil",           slug: "mobil",            order: 2 },
      { name: "Siber Güvenlik",  slug: "siber-guvenlik",  order: 3 },
      { name: "Açık Kaynak",     slug: "acik-kaynak",      order: 4 },
    ];
    for (const sub of subCats) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, order: sub.order, parentId: teknolojiCat.id },
        create: { ...sub, parentId: teknolojiCat.id },
      });
    }
  }
  console.log("✓ Default categories seeded");

  // ── Super Admin User ───────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@kurumsal.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.create({
      data: {
        name: "Süper Admin",
        email: adminEmail,
        password: hashed,
        role: "SUPER_ADMIN",
      },
    });

    const freePkg = await prisma.package.findUnique({ where: { slug: "free" } });
    if (freePkg) {
      await prisma.subscription.create({
        data: {
          userId: admin.id,
          packageId: freePkg.id,
          status: "ACTIVE",
          billingPeriod: "MONTHLY",
          autoRenew: false,
        },
      });
    }

    console.log(`✓ Admin created: ${adminEmail}`);
  } else {
    console.log(`✓ Admin already exists: ${adminEmail}`);
  }

  // ── Demo Scraper Source ────────────────────────────────────────────────────
  const teknolojiForSeed = await prisma.category.findUnique({ where: { slug: "teknoloji" } });
  const demoSource = await prisma.scraperSource.findFirst({
    where: { url: "https://feeds.feedburner.com/TechCrunch" },
  });
  if (!demoSource) {
    await prisma.scraperSource.create({
      data: {
        name: "TechCrunch RSS",
        url: "https://feeds.feedburner.com/TechCrunch",
        type: "rss",
        status: "active",
        interval: 60,
        aiProvider: "Claude",
        aiTask: "rewrite",
        autoPublish: false,
        categoryId: teknolojiForSeed?.id ?? null,
      },
    });
    console.log("✓ Demo scraper source created");
  }

  console.log("✅ Seed complete");
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
