import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

const items = [
  { title: 'Arayüz Tasarımı', imageUrl: img('ui-design'), category: 'Tasarım', sortOrder: 1 },
  { title: 'Çalışma Masası', imageUrl: img('workspace'), category: 'Fotoğraf', sortOrder: 2 },
  { title: 'Kod Ekranı', imageUrl: img('code-screen'), category: 'Geliştirme', sortOrder: 3 },
  { title: 'Mobil Uygulama', imageUrl: img('mobile-app'), category: 'Tasarım', sortOrder: 4 },
  { title: 'Veri Panosu', imageUrl: img('dashboard-ui'), category: 'Data', sortOrder: 5 },
  { title: 'Marka Çalışması', imageUrl: img('branding'), category: 'Tasarım', sortOrder: 6 },
  { title: 'Sunucu & Altyapı', imageUrl: img('server-room'), category: 'Sistem', sortOrder: 7 },
  { title: 'Toplantı', imageUrl: img('team-meeting'), category: 'Fotoğraf', sortOrder: 8 },
];

async function main() {
  for (const it of items) {
    const existing = await db.galleryItem.findFirst({ where: { title: it.title } });
    if (existing) {
      await db.galleryItem.update({ where: { id: existing.id }, data: { ...it, isActive: true } });
    } else {
      await db.galleryItem.create({ data: { ...it, isActive: true } });
    }
  }
  console.log(`✅ ${items.length} galeri görseli`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
