import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
  const demoSource = await prisma.scraperSource.findFirst({ where: { url: "https://feeds.feedburner.com/TechCrunch" } });
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
        targetCategory: "Teknoloji",
      },
    });
    console.log("✓ Demo scraper source created");
  }

  console.log("✅ Seed complete");
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
