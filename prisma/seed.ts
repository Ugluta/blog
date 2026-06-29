import { PrismaClient, ContentType } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  // ---- Üyelik planları ----
  const plans = [
    {
      name: 'Ücretsiz',
      slug: 'ucretsiz',
      description: 'Temel erişim, sınırlı indirme',
      price: 0,
      duration: 0,
      features: ['10 aylık indirme', '5 dosya yükleme', '500 MB depolama'],
      downloadLimit: 10,
      uploadLimit: 5,
      storageLimit: 524288000,
      isActive: true,
      isFeatured: false,
      sortOrder: 1,
    },
    {
      name: 'Öğretmen Pro',
      slug: 'ogretmen-pro',
      description: 'Sınırsız indirme, gelimiş özellikler',
      price: 99,
      duration: 30,
      features: ['Sınırsız indirme', '50 dosya yükleme', '2 GB depolama', 'Öncelikli destek'],
      downloadLimit: null,
      uploadLimit: 50,
      storageLimit: 2000000000,
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: 'Kurumsal',
      slug: 'kurumsal',
      description: 'Okul veya kurum için tam erişim',
      price: 299,
      duration: 30,
      features: ['Sınırsız her şey', 'API erişimi', '10 GB depolama', 'Özel destek'],
      downloadLimit: null,
      uploadLimit: null,
      storageLimit: 2000000000,
      isActive: true,
      isFeatured: false,
      sortOrder: 3,
    },
  ];

  for (const plan of plans) {
    await db.membershipPlan.upsert({
      where: { slug: plan.slug },
      create: plan,
      update: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        features: plan.features,
        downloadLimit: plan.downloadLimit,
        uploadLimit: plan.uploadLimit,
        storageLimit: plan.storageLimit,
        isActive: plan.isActive,
        isFeatured: plan.isFeatured,
        sortOrder: plan.sortOrder,
      },
    });
  }
  console.log('✅ Üyelik planları oluşturuldu');

  // ---- Scraper kaynakları ----
  const sources = [
    {
      name: 'MEB Haberler',
      url: 'https://www.meb.gov.tr/haberler/haberler_sayfa.php',
      selector: 'ul.haber-listesi li, .haberler-listesi li, article',
      titleSelector: 'h2, h3, .haber-baslik, .baslik',
      autoPublish: false,
      contentType: ContentType.NEWS,
    },
    {
      name: 'Memurlar.net - Eğitim',
      url: 'https://www.memurlar.net/konu/egitim/',
      selector: '.haberler-list li, article, .news-item',
      titleSelector: 'h3 a, h2 a, .title a',
      autoPublish: false,
      contentType: ContentType.NEWS,
    },
    {
      name: 'Haberürk - Eğitim',
      url: 'https://www.haberturk.com/egitim',
      selector: 'article, .news-item, .card-news',
      titleSelector: 'h3, h2, .card-title',
      autoPublish: false,
      contentType: ContentType.NEWS,
    },
    {
      name: 'YÖK Haberler',
      url: 'https://www.yok.gov.tr/Sayfalar/Haberler/haberler.aspx',
      selector: '.haber-listesi li, article, .haberler li',
      titleSelector: 'h3, h2, .baslik',
      autoPublish: false,
      contentType: ContentType.ANNOUNCEMENT,
    },
    {
      name: 'MEB Mevzuat',
      url: 'https://www.meb.gov.tr/mevzuat/',
      selector: 'ul li, .mevzuat-listesi li',
      titleSelector: 'a, h3',
      autoPublish: false,
      contentType: ContentType.LEGISLATION,
    },
  ];

  for (const source of sources) {
    const existing = await db.scraperSource.findFirst({
      where: { url: source.url },
    });
    if (!existing) {
      await db.scraperSource.create({ data: source });
    }
  }
  console.log('✅ Scraper kaynakları eklendi');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
