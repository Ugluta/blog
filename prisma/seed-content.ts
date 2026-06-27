import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

type Article = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  tags: string[];
  metaTitle: string;
  metaDesc: string;
  content: string;
};

const articles: Article[] = [
  {
    title: 'Türk Edebiyatında Postmodern Roman: Özellikleri ve Öne Çıkan Eserler',
    slug: 'turk-edebiyatinda-postmodern-roman',
    category: 'Edebiyat',
    excerpt: 'Postmodern romanın temel özellikleri, Türk edebiyatındaki yansımaları ve mutlaka okunması gereken eserler üzerine kapsamlı bir rehber.',
    tags: ['edebiyat', 'postmodern', 'roman', 'türk edebiyatı'],
    metaTitle: 'Türk Edebiyatında Postmodern Roman — Özellikleri ve Eserler',
    metaDesc: 'Postmodern roman nedir, Türk edebiyatında hangi yazarlarla gelişti? Özellikleri ve öne çıkan eserlerle kapsamlı rehber.',
    content: [
      '<h2>Postmodern Roman Nedir?</h2>',
      '<p>Postmodern roman, 20. yüzyılın ikinci yarısında ortaya çıkan, gerçekliğin tek ve mutlak olmadığını savunan bir anlatı biçimidir. Geleneksel romanın düzgün kurgu akışını kırar; üst kurmaca, metinlerarasılık ve ironi gibi tekniklerle okuru anlatının bir parçası haline getirir.</p>',
      '<h2>Temel Özellikleri</h2>',
      '<ul>',
      '<li><strong>Üst kurmaca:</strong> Metnin kendi kurmaca olduğunu okura hatırlatması.</li>',
      '<li><strong>Metinlerarasılık:</strong> Başka eserlere açık ya da örtük göndermeler.</li>',
      '<li><strong>Parçalı kurgu:</strong> Doğrusal olmayan, kırık zaman çizgisi.</li>',
      '<li><strong>İroni ve pastij:</strong> Geçmiş biçemlerin oyuncu bir dille yeniden üretilmesi.</li>',
      '</ul>',
      '<h2>Türk Edebiyatındaki Yansımaları</h2>',
      '<p>Türk edebiyatında postmodern eğilimin en güçlü temsilcisi Oguz Atay’dır. <em>Tutunamayanlar</em>, parçalı yapısı ve üst kurmaca teknikleriyle bir dönüm noktasıdır. Orhan Pamuk’un <em>Kara Kitap</em>’ı ve İhsan Oktay Anar’ın <em>Puslu Kıtalar Atlası</em> bu geleneğin güçlü örnekleridir.</p>',
      '<h2>Nereden Başlamalı?</h2>',
      '<p>Postmodern romana yeni başlayacak okurlar için öneri sıralaması: önce <em>Puslu Kıtalar Atlası</em>, ardından <em>Kara Kitap</em> ve son olarak <em>Tutunamayanlar</em>. Böylece biçimsel zorluk kademeli olarak artırılabilir.</p>',
    ].join(''),
  },
  {
    title: 'Şiir Okumanın Zihinsel Faydaları ve Başlangıç İçin 5 Öneri',
    slug: 'siir-okumanin-zihinsel-faydalari',
    category: 'Edebiyat',
    excerpt: 'Şiir okumak hafızayı, empatiyi ve dil becerisini nasıl güçlendirir? Yeni başlayanlar için pratik önerilerle birlikte.',
    tags: ['edebiyat', 'şiir', 'okuma', 'kişisel gelişim'],
    metaTitle: 'Şiir Okumanın Faydaları — Başlangıç Rehberi',
    metaDesc: 'Şiir okumanın zihinsel faydaları nelerdir? Empati, hafıza ve dil gelişimi açısından şiirin gücü ve 5 pratik öneri.',
    content: [
      '<h2>Neden Şiir Okumalıyız?</h2>',
      '<p>Şiir, az sözle çok anlam taşıyan yoğun bir dil biçimidir. Düzenli şiir okumak, dikkat süresini artırır ve kelime dağarcığını zenginleştirir.</p>',
      '<h2>Zihinsel Faydaları</h2>',
      '<ul>',
      '<li><strong>Empati:</strong> Farklı duygu dünyalarına temas etmeyi sağlar.</li>',
      '<li><strong>Hafıza:</strong> Ritim ve uyak, ezber yeteneğini güçlendirir.</li>',
      '<li><strong>Dil becerisi:</strong> Mecaz ve imge kullanımını geliştirir.</li>',
      '</ul>',
      '<h2>Başlangıç İçin 5 Öneri</h2>',
      '<ul>',
      '<li>Kısa şiirlerle başlayın; her gün bir şiir hedefleyin.</li>',
      '<li>Sesli okuyun, ritmi hissedin.</li>',
      '<li>Anlamadığınız dizeleri not alın, tekrar dönün.</li>',
      '<li>Tek bir şairi derinlemesine okuyun.</li>',
      '<li>Bir şiir defteri tutun.</li>',
      '</ul>',
      '<p>Düzenli bir alışkanlık haline geldiğinde şiir, hem zihinsel hem duygusal bir dinlenme alanı sunar.</p>',
    ].join(''),
  },
  {
    title: 'Müzik Dinlemenin Beyin Üzerindeki Etkileri: Bilimsel Bir Bakış',
    slug: 'muzik-dinlemenin-beyin-uzerindeki-etkileri',
    category: 'Müzik',
    excerpt: 'Müzik beynimizi nasıl etkiler? Odaklanma, ruh hali ve hafıza üzerindeki bilimsel kanıtlanmış etkileri inceliyoruz.',
    tags: ['müzik', 'beyin', 'bilim', 'odaklanma'],
    metaTitle: 'Müzik Dinlemenin Beyne Etkileri — Bilimsel Bakış',
    metaDesc: 'Müzik dinlemek beyni nasıl etkiler? Dopamin, odaklanma ve hafıza üzerindeki bilimsel etkileri keşfedin.',
    content: [
      '<h2>Müzik ve Beyin</h2>',
      '<p>Müzik dinlediğimizde beynin birden fazla bölgesi aynı anda çalışır: işitme korteksi, hafıza merkezleri ve duygu düzenleyen limbik sistem. Bu çok bölgeli aktivasyon, müziği güçlü bir zihinsel uyaran yapar.</p>',
      '<h2>Dopamin ve Ödül</h2>',
      '<p>Sevdiğimiz bir parçayı dinlerken beyin dopamin salgılar; bu, mutluluk ve motivasyonla ilişkili bir nörotransmiterdir. Araştırmalar, beklenen bir melodik doruğa yaklaşırken dopamin salınımının arttığını gösterir.</p>',
      '<h2>Odaklanma ve Verimlilik</h2>',
      '<ul>',
      '<li>Sözsüz müzik, yoğun zihinsel işlerde dikkati artırabilir.</li>',
      '<li>Doğa sesleri ve ambient tınılar stresi azaltabilir.</li>',
      '<li>Tempolu müzik, fiziksel egzersiz performansını yükseltebilir.</li>',
      '</ul>',
      '<h2>Sonuç</h2>',
      '<p>Müzik yalnızca bir eğlence değil; ruh halimizi, odaklanmamızı ve hafızamızı doğrudan etkileyen bir araçtır. Doğru türü doğru anda dinlemek, günlük verimliliğe katkı sağlar.</p>',
    ].join(''),
  },
  {
    title: 'E-Ticarete Başlarken Bilmeniz Gereken 7 Temel Adım',
    slug: 'e-ticarete-baslarken-7-temel-adim',
    category: 'Ticaret',
    excerpt: 'Sıfırdan e-ticaret kurmak isteyenler için ürün seçiminden ödeme altyapısına kadar 7 kritik adımlık yol haritası.',
    tags: ['ticaret', 'e-ticaret', 'girişimcilik', 'online satış'],
    metaTitle: 'E-Ticarete Başlama Rehberi — 7 Temel Adım',
    metaDesc: 'E-ticarete sıfırdan başlamak için 7 temel adım: niş seçimi, tedarik, platform, ödeme, kargo ve pazarlama.',
    content: [
      '<h2>E-Ticaret Neden Şimdi?</h2>',
      '<p>Düşük başlangıç maliyeti ve geniş erişim, e-ticareti girişimciler için cazip kılıyor. Ancak başarı, planı doğru adımlarla kurmaktan geçiyor.</p>',
      '<h2>7 Temel Adım</h2>',
      '<ul>',
      '<li><strong>1. Niş seçimi:</strong> Talep gören ama rekabeti yönetilebilir bir alan belirleyin.</li>',
      '<li><strong>2. Tedarik:</strong> Güvenilir tedarikçi veya üretim modeli kurun.</li>',
      '<li><strong>3. Platform:</strong> Hazır altyapı mı yoksa özel site mi kararı verin.</li>',
      '<li><strong>4. Ödeme altyapısı:</strong> Güvenli ödeme ve fatura çözümü entegre edin.</li>',
      '<li><strong>5. Kargo & lojistik:</strong> Hızlı ve takip edilebilir teslimat planlayın.</li>',
      '<li><strong>6. Pazarlama:</strong> SEO, sosyal medya ve içerikle görünürlük oluşturun.</li>',
      '<li><strong>7. Analiz:</strong> Satış verisini düzenli inceleyip optimize edin.</li>',
      '</ul>',
      '<h2>Unutmayın</h2>',
      '<p>Müşteri memnuniyeti, tekrar eden satışın anahtarıdır. İlk günden itibaren hızlı iletişim ve şeffaf iade politikası oluşturun.</p>',
    ].join(''),
  },
  {
    title: 'Yapay Zeka Nedir? Yeni Başlayanlar İçin Kapsamlı Rehber',
    slug: 'yapay-zeka-nedir-yeni-baslayanlar-rehberi',
    category: 'Yapay Zeka',
    excerpt: 'Yapay zeka tam olarak nedir, nasıl çalışır ve günlük hayatımızı nasıl değiştiriyor? Teknik olmayan bir dille açıklıyoruz.',
    tags: ['yapay zeka', 'ai', 'makine öğrenmesi', 'teknoloji'],
    metaTitle: 'Yapay Zeka Nedir? — Yeni Başlayanlar Rehberi',
    metaDesc: 'Yapay zeka nedir, nasıl çalışır? Makine öğrenmesi, derin öğrenme ve günlük kullanım alanları sade bir dille.',
    content: [
      '<h2>Yapay Zeka Nedir?</h2>',
      '<p>Yapay zeka (AI), bilgisayarların öğrenme, akıl yürütme ve problem çözme gibi insana özgü bilişsel yetenekleri taklit etmesidir. Amaç, verilerden örüntü çıkarıp kararlar üretebilen sistemler kurmaktır.</p>',
      '<h2>Temel Kavramlar</h2>',
      '<ul>',
      '<li><strong>Makine öğrenmesi:</strong> Sistemlerin veriden kuralları kendiliğinden öğrenmesi.</li>',
      '<li><strong>Derin öğrenme:</strong> Yapay sinir ağlarıyla karmaşık örüntülerin çözülmesi.</li>',
      '<li><strong>Büyük dil modelleri:</strong> Metni anlayıp üretebilen gelişmiş modeller.</li>',
      '</ul>',
      '<h2>Günlük Hayatta Yapay Zeka</h2>',
      '<p>Arama motorları, öneri sistemleri, sesli asistanlar ve çeviri araçları yapay zekanın günlük yansımalarıdır. Bunları fark etmeden onlarca kez kullanıyoruz.</p>',
      '<h2>Nereden Öğrenmeye Başlamalı?</h2>',
      '<p>Temel kavramlardan başlayın, sonra basit projelerle pratik yapın. Python, yapay zeka için en yaygın başlangıç dilidir.</p>',
    ].join(''),
  },
  {
    title: 'İşletmeler İçin Yapay Zeka: Verimliliği Artıran 6 Kullanım Alanı',
    slug: 'isletmeler-icin-yapay-zeka-6-kullanim-alani',
    category: 'Yapay Zeka',
    excerpt: 'Küçük ve orta ölçekli işletmeler yapay zekayı hangi alanlarda kullanabilir? Maliyeti düşüren 6 pratik kullanım alanı.',
    tags: ['yapay zeka', 'işletme', 'verimlilik', 'otomasyon'],
    metaTitle: 'İşletmeler İçin Yapay Zeka — 6 Kullanım Alanı',
    metaDesc: 'İşletmelerde yapay zeka kullanım alanları: müşteri hizmetleri, pazarlama, otomasyon ve veri analizi ile verimlilik.',
    content: [
      '<h2>Yapay Zeka Artık Sadece Büyük Şirketler İçin Değil</h2>',
      '<p>Bulut tabanlı araçlar sayesinde küçük işletmeler de yapay zekadan düşük maliyetle yararlanabiliyor. İşte en etkili 6 alan:</p>',
      '<ul>',
      '<li><strong>Müşteri hizmetleri:</strong> 7/24 yanıt veren sohbet botları.</li>',
      '<li><strong>Pazarlama:</strong> İçerik üretimi ve hedef kitle analizi.</li>',
      '<li><strong>Satış tahmini:</strong> Geçmiş veriyle talep öngörüsü.</li>',
      '<li><strong>Otomasyon:</strong> Tekrarlayan ofis işlerinin otomatikleştirilmesi.</li>',
      '<li><strong>Stok yönetimi:</strong> Akıllı sipariş ve depo optimizasyonu.</li>',
      '<li><strong>Veri analizi:</strong> Karar destek için anlaşılır raporlar.</li>',
      '</ul>',
      '<h2>Nasıl Başlamalı?</h2>',
      '<p>Tüm süreçleri aynı anda değiştirmeye çalışmayın. En çok zaman kaybettiğiniz tek bir süreçle başlayın, sonuçları ölçün ve kademeli genişletin.</p>',
    ].join(''),
  },
];

const projects = [
  {
    title: 'Koli — Şehirler Arası Kargo & Lojistik Platformu',
    slug: 'koli-lojistik-platformu',
    description: 'Birden fazla şehirde çalışan, ilan tabanlı kargo ve lojistik eşleştirme platformu. Gönderici ile taşıyıcıyı bir araya getirir.',
    tags: ['Next.js', 'PostgreSQL', 'Redis', 'MinIO', 'Docker', 'Meilisearch'],
    isFeatured: true,
    sortOrder: 1,
    content: [
      '<h2>Proje Hakkında</h2>',
      '<p>Koli, şehirler arası eşya gönderimini kolaylaştıran ilan tabanlı bir lojistik platformudur. Kullanıcılar gönderi ilanı oluşturur, taşıyıcılar uygun rotaları üstlenir.</p>',
      '<h2>Teknik Altyapı</h2>',
      '<ul>',
      '<li>Next.js tabanlı web uygulaması ve ayrı API servisi</li>',
      '<li>PostgreSQL veritabanı, Redis önbellek</li>',
      '<li>Meilisearch ile hızlı arama</li>',
      '<li>MinIO ile nesne depolama (görsel/belge)</li>',
      '<li>Docker Compose ile 7 servisli dağıtım</li>',
      '</ul>',
      '<h2>Öne Çıkan Özellikler</h2>',
      '<p>Şehir bazlı yönlendirme, otomatik veritabanı yedekleme ve ölçeklenebilir mimari ile production ortamında çalışacak şekilde tasarlandı.</p>',
    ].join(''),
  },
  {
    title: 'Evrak — Öğretmenler İçin AI Destekli Belge Sistemi',
    slug: 'evrak-ai-belge-sistemi',
    description: 'Öğretmen ve idarecilerin dilekçe, tutanak ve resmi belgeleri hazır şablonlar ve yapay zeka desteğiyle saniyeler içinde oluşturmasını sağlayan platform.',
    tags: ['Next.js', 'Prisma', 'Claude AI', 'PostgreSQL', 'PDF'],
    isFeatured: true,
    sortOrder: 2,
    content: [
      '<h2>Proje Hakkında</h2>',
      '<p>Evrak, eğitim çalışanlarının sık kullandığı resmi belgeleri hızlıca üretmesini sağlayan bir belge yönetim sistemidir. Hazır şablonlar ve yapay zeka desteğiyle dakikalar süren işler saniyelere iner.</p>',
      '<h2>Teknik Altyapı</h2>',
      '<ul>',
      '<li>Next.js App Router ve NextAuth ile kimlik doğrulama</li>',
      '<li>Prisma + PostgreSQL veri katmanı</li>',
      '<li>Claude AI ile belge taslak ve şablon doldurma</li>',
      '<li>PDF dışa aktarma ve paylaşılabilir bağlantılar</li>',
      '<li>Günlük AI kullanım kotası ve rate limit</li>',
      '</ul>',
      '<h2>Öne Çıkan Özellikler</h2>',
      '<p>OCR ile görüntüden metin çıkarma, şablon kopyalama ve belge paylaşımı gibi özelliklerle öğretmenlerin evrak yükünü azaltır.</p>',
    ].join(''),
  },
];

const snippets = [
  {
    title: 'Python ile Web Scraping: requests + BeautifulSoup',
    slug: 'python-web-scraping-requests-beautifulsoup',
    language: 'python',
    description: 'Bir web sayfasındaki başlıkları çekmek için requests ve BeautifulSoup kullanan basit bir örnek.',
    tags: ['python', 'scraping', 'beautifulsoup'],
    sortOrder: 1,
    code: [
      'import requests',
      'from bs4 import BeautifulSoup',
      '',
      'url = "https://example.com"',
      'headers = {"User-Agent": "Mozilla/5.0"}',
      '',
      'response = requests.get(url, headers=headers, timeout=10)',
      'response.raise_for_status()',
      '',
      'soup = BeautifulSoup(response.text, "html.parser")',
      '',
      '# Tüm h2 başlıklarını yazdır',
      'for baslik in soup.find_all("h2"):',
      '    print(baslik.get_text(strip=True))',
    ].join('\n'),
  },
  {
    title: "Python'da Dekoratör ile Fonksiyon Süresi Ölçme",
    slug: 'python-dekorator-fonksiyon-suresi-olcme',
    language: 'python',
    description: 'Bir fonksiyonun çalışma süresini ölçen yeniden kullanılabilir bir dekoratör örneği.',
    tags: ['python', 'dekoratör', 'performans'],
    sortOrder: 2,
    code: [
      'import time',
      'from functools import wraps',
      '',
      'def sure_olc(func):',
      '    @wraps(func)',
      '    def wrapper(*args, **kwargs):',
      '        baslangic = time.perf_counter()',
      '        sonuc = func(*args, **kwargs)',
      '        gecen = time.perf_counter() - baslangic',
      '        print(f"{func.__name__} {gecen:.4f} saniyede çalıştı")',
      '        return sonuc',
      '    return wrapper',
      '',
      '@sure_olc',
      'def topla(n):',
      '    return sum(range(n))',
      '',
      'topla(1_000_000)',
    ].join('\n'),
  },
];

async function main() {
  const admin = await db.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
    select: { id: true },
  }) ?? await db.user.findFirst({ select: { id: true } });

  if (!admin) {
    console.error('\n❌ Hiç kullanıcı yok. Önce admin oluştur:');
    console.error('   ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx prisma/create-admin.ts\n');
    process.exit(1);
  }

  for (const a of articles) {
    await db.news.upsert({
      where: { slug: a.slug },
      create: {
        title: a.title, slug: a.slug, excerpt: a.excerpt, content: a.content,
        type: 'BLOG', status: 'PUBLISHED', authorId: admin.id,
        tags: a.tags, category: a.category,
        metaTitle: a.metaTitle, metaDesc: a.metaDesc,
        isAiGenerated: false, publishedAt: new Date(),
      },
      update: {
        title: a.title, excerpt: a.excerpt, content: a.content,
        tags: a.tags, category: a.category,
        metaTitle: a.metaTitle, metaDesc: a.metaDesc, status: 'PUBLISHED',
      },
    });
  }
  console.log(`✅ ${articles.length} blog yazısı eklendi`);

  for (const p of projects) {
    await db.project.upsert({
      where: { slug: p.slug },
      create: {
        title: p.title, slug: p.slug, description: p.description, content: p.content,
        tags: p.tags, isFeatured: p.isFeatured, isActive: true, sortOrder: p.sortOrder,
      },
      update: {
        title: p.title, description: p.description, content: p.content,
        tags: p.tags, isFeatured: p.isFeatured, isActive: true, sortOrder: p.sortOrder,
      },
    });
  }
  console.log(`✅ ${projects.length} proje eklendi`);

  for (const s of snippets) {
    await db.codeSnippet.upsert({
      where: { slug: s.slug },
      create: {
        title: s.title, slug: s.slug, description: s.description,
        language: s.language, code: s.code, tags: s.tags, isActive: true, sortOrder: s.sortOrder,
      },
      update: {
        title: s.title, description: s.description,
        language: s.language, code: s.code, tags: s.tags, isActive: true, sortOrder: s.sortOrder,
      },
    });
  }
  console.log(`✅ ${snippets.length} kod örneği eklendi`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
