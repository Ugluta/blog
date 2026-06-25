import { PrismaClient, Role, SchoolType, ContentType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ogretmenevrak.com' },
    update: {},
    create: {
      name: 'Site Yöneticisi',
      email: 'admin@ogretmenevrak.com',
      username: 'admin',
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log('Admin user created:', admin.email);

  // Membership plans
  await prisma.membershipPlan.upsert({
    where: { slug: 'ucretsiz' },
    update: {},
    create: {
      name: 'Ücretsiz',
      slug: 'ucretsiz',
      description: 'Temel erişim planı',
      price: 0,
      duration: 365,
      features: ['5 dosya indirme/ay', 'Haber okuma', 'Soru bankası görüntüleme'],
      downloadLimit: 5,
    },
  });

  await prisma.membershipPlan.upsert({
    where: { slug: 'ogretmen' },
    update: {},
    create: {
      name: 'Öğretmen',
      slug: 'ogretmen',
      description: 'Öğretmenler için tam erişim',
      price: 99,
      duration: 30,
      features: ['Sınırsız indirme', 'Dosya yükleme', 'Soru hazırlama', 'Belge oluşturma', 'AI asistan'],
      downloadLimit: null,
      uploadLimit: 50,
      isFeatured: true,
    },
  });

  await prisma.membershipPlan.upsert({
    where: { slug: 'okul' },
    update: {},
    create: {
      name: 'Okul',
      slug: 'okul',
      description: 'Okul ve kurumlar için',
      price: 499,
      duration: 30,
      features: ['Sınırsız indirme', 'Sınırsız yükleme', 'Çoklu kullanıcı', 'Özel içerik', 'Öncelikli destek'],
      downloadLimit: null,
      uploadLimit: null,
    },
  });

  // Grades
  const gradeData = [
    { name: 'Anaokulu', level: 0, schoolTypes: [SchoolType.ANAOKULU] },
    { name: '1. Sınıf', level: 1, schoolTypes: [SchoolType.ILKOKUL] },
    { name: '2. Sınıf', level: 2, schoolTypes: [SchoolType.ILKOKUL] },
    { name: '3. Sınıf', level: 3, schoolTypes: [SchoolType.ILKOKUL] },
    { name: '4. Sınıf', level: 4, schoolTypes: [SchoolType.ILKOKUL] },
    { name: '5. Sınıf', level: 5, schoolTypes: [SchoolType.ORTAOKUL] },
    { name: '6. Sınıf', level: 6, schoolTypes: [SchoolType.ORTAOKUL] },
    { name: '7. Sınıf', level: 7, schoolTypes: [SchoolType.ORTAOKUL] },
    { name: '8. Sınıf', level: 8, schoolTypes: [SchoolType.ORTAOKUL] },
    { name: '9. Sınıf', level: 9, schoolTypes: [SchoolType.LISE, SchoolType.IMAM_HATIP, SchoolType.MESLEK_LISESI] },
    { name: '10. Sınıf', level: 10, schoolTypes: [SchoolType.LISE, SchoolType.IMAM_HATIP, SchoolType.MESLEK_LISESI] },
    { name: '11. Sınıf', level: 11, schoolTypes: [SchoolType.LISE, SchoolType.IMAM_HATIP, SchoolType.MESLEK_LISESI] },
    { name: '12. Sınıf', level: 12, schoolTypes: [SchoolType.LISE, SchoolType.IMAM_HATIP, SchoolType.MESLEK_LISESI] },
  ];

  for (const grade of gradeData) {
    await prisma.grade.upsert({
      where: { level: grade.level },
      update: {},
      create: { ...grade, sortOrder: grade.level },
    }).catch(() => prisma.grade.create({ data: { ...grade, sortOrder: grade.level } }).catch(() => null));
  }

  // Subjects
  const subjectData = [
    { name: 'Türkçe', slug: 'turkce', icon: '📖', color: '#ef4444' },
    { name: 'Matematik', slug: 'matematik', icon: '🔢', color: '#3b82f6' },
    { name: 'Fen Bilimleri', slug: 'fen-bilimleri', icon: '🔬', color: '#22c55e' },
    { name: 'Sosyal Bilgiler', slug: 'sosyal-bilgiler', icon: '🌍', color: '#f59e0b' },
    { name: 'İngilizce', slug: 'ingilizce', icon: '🇬🇧', color: '#8b5cf6' },
    { name: 'Din Kültürü', slug: 'din-kulturu', icon: '🕌', color: '#06b6d4' },
    { name: 'Fizik', slug: 'fizik', icon: '⚛️', color: '#6366f1' },
    { name: 'Kimya', slug: 'kimya', icon: '🧪', color: '#ec4899' },
    { name: 'Biyoloji', slug: 'biyoloji', icon: '🧬', color: '#14b8a6' },
    { name: 'Tarih', slug: 'tarih', icon: '🏛️', color: '#f97316' },
    { name: 'Coğrafya', slug: 'cografya', icon: '🗺️', color: '#84cc16' },
    { name: 'Müzik', slug: 'muzik', icon: '🎵', color: '#a855f7' },
    { name: 'Görsel Sanatlar', slug: 'gorsel-sanatlar', icon: '🎨', color: '#fb923c' },
    { name: 'Beden Eğitimi', slug: 'beden-egitimi', icon: '⚽', color: '#34d399' },
    { name: 'Teknoloji', slug: 'teknoloji', icon: '💻', color: '#60a5fa' },
  ];

  for (const [i, subject] of subjectData.entries()) {
    await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {},
      create: { ...subject, sortOrder: i, schoolTypes: [SchoolType.GENEL] },
    });
  }

  // Categories — Eğitim materyalleri
  const categoryData = [
    { name: 'Sınav Soruları', slug: 'sinav-sorulari', icon: '📝', color: '#3b82f6' },
    { name: 'Yıllık Planlar', slug: 'yillik-planlar', icon: '📅', color: '#22c55e' },
    { name: 'Ders Planları', slug: 'ders-planlari', icon: '📋', color: '#f59e0b' },
    { name: 'Çalışma Kağıtları', slug: 'calisma-kagitlari', icon: '📄', color: '#8b5cf6' },
    { name: 'Sunumlar', slug: 'sunumlar', icon: '📊', color: '#ef4444' },
    { name: 'Proje Ödevleri', slug: 'proje-odevleri', icon: '🎯', color: '#06b6d4' },
    { name: 'Kazanım Testleri', slug: 'kazanim-testleri', icon: '✅', color: '#84cc16' },
    { name: 'Evrak Örnekleri', slug: 'evrak-ornekleri', icon: '📁', color: '#f97316' },
  ];

  for (const [i, cat] of categoryData.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, sortOrder: i },
    });
  }

  // Öğretmen hakları kategorileri — ana başlıklar
  const ozlukHaklari = await prisma.category.upsert({
    where: { slug: 'ozluk-haklari' },
    update: {},
    create: { name: 'Özlük Hakları', slug: 'ozluk-haklari', icon: '⚖️', color: '#6366f1', sortOrder: 10,
      description: 'Öğretmen ve idarecilerin özlük hakları, mevzuat ve yönetmelikler' },
  });

  const mahkemeKararlari = await prisma.category.upsert({
    where: { slug: 'mahkeme-kararlari' },
    update: {},
    create: { name: 'Mahkeme Kararları', slug: 'mahkeme-kararlari', icon: '🏛️', color: '#dc2626', sortOrder: 11,
      description: 'Danıştay, Bölge İdare Mahkemesi ve Anayasa Mahkemesi emsal kararları' },
  });

  await prisma.category.upsert({
    where: { slug: 'genelgeler-yonergeler' },
    update: {},
    create: { name: 'Genelgeler & Yönergeler', slug: 'genelgeler-yonergeler', icon: '📢', color: '#0891b2', sortOrder: 12,
      description: 'MEB genelgeleri, yönergeler ve tebliğler' },
  });

  await prisma.category.upsert({
    where: { slug: 'meb-yazilari' },
    update: {},
    create: { name: 'MEB Yazıları & Açıklamalar', slug: 'meb-yazilari', icon: '📬', color: '#15803d', sortOrder: 13,
      description: 'Bakanlık yazıları, açıklamalar ve duyurular' },
  });

  // Özlük hakları alt kategorileri
  const ozlukAlt = [
    { name: 'İzin Mevzuatı', slug: 'izin-mevzuati', icon: '🗓️', color: '#6366f1', sortOrder: 0 },
    { name: 'Atama & Nakil', slug: 'atama-nakil', icon: '🔄', color: '#6366f1', sortOrder: 1 },
    { name: 'Ücret & Ek Ders', slug: 'ucret-ek-ders', icon: '💰', color: '#6366f1', sortOrder: 2 },
    { name: 'Disiplin Mevzuatı', slug: 'disiplin-mevzuati', icon: '📜', color: '#6366f1', sortOrder: 3 },
    { name: 'Emeklilik', slug: 'emeklilik', icon: '🏖️', color: '#6366f1', sortOrder: 4 },
    { name: 'Sağlık & Raporlar', slug: 'saglik-raporlar', icon: '🏥', color: '#6366f1', sortOrder: 5 },
  ];

  for (const cat of ozlukAlt) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, parentId: ozlukHaklari.id },
    });
  }

  // Mahkeme kararları alt kategorileri
  const mahkemeAlt = [
    { name: 'Danıştay Kararları', slug: 'danistay-kararlari', icon: '⚖️', color: '#dc2626', sortOrder: 0 },
    { name: 'Bölge İdare Mahkemesi', slug: 'bolge-idare-mahkemesi', icon: '🏛️', color: '#dc2626', sortOrder: 1 },
    { name: 'Anayasa Mahkemesi', slug: 'anayasa-mahkemesi', icon: '📖', color: '#dc2626', sortOrder: 2 },
    { name: 'İdare Mahkemesi', slug: 'idare-mahkemesi', icon: '⚖️', color: '#dc2626', sortOrder: 3 },
  ];

  for (const cat of mahkemeAlt) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, parentId: mahkemeKararlari.id },
    });
  }

  // Default settings
  const settings = [
    { key: 'site_name', value: 'ÖğretmenEvrak', group: 'general', label: 'Site Adı' },
    { key: 'site_slogan', value: 'Öğretmenler için Her Şey', group: 'general', label: 'Site Sloganı' },
    { key: 'site_description', value: 'Öğretmen ve idareciler için materyal, evrak ve kaynak platformu', group: 'general', label: 'Site Açıklaması' },
    { key: 'contact_email', value: 'info@ogretmenevrak.com', group: 'general', label: 'İletişim E-posta' },
    { key: 'logo_url', value: '/logo.svg', group: 'appearance', label: 'Logo URL' },
    { key: 'primary_color', value: '#2563eb', group: 'appearance', label: 'Ana Renk' },
    { key: 'allow_registration', value: 'true', group: 'auth', type: 'boolean', label: 'Kayıt İzni' },
    { key: 'require_email_verify', value: 'true', group: 'auth', type: 'boolean', label: 'E-posta Doğrulama' },
    { key: 'files_per_page', value: '24', group: 'content', type: 'number', label: 'Sayfa Başı Dosya' },
    { key: 'google_analytics', value: '', group: 'seo', label: 'Google Analytics ID' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // Scraper sources
  await prisma.scraperSource.upsert({
    where: { id: 'meb-source' },
    update: {},
    create: {
      id: 'meb-source',
      name: 'MEB Haberler',
      url: 'https://www.meb.gov.tr/haberler',
      selector: '.haber-listesi .haber-item',
      isActive: false,
      contentType: ContentType.NEWS,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
