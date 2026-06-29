import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/450`;

type Article = {
  title: string; slug: string; category: string; image: string;
  excerpt: string; tags: string[]; metaTitle: string; metaDesc: string; content: string;
};

const articles: Article[] = [
  // ===================== EDEBIYAT =====================
  {
    title: 'Türk Edebiyatında Postmodern Roman: Özellikleri ve Öne Çıkan Eserler',
    slug: 'turk-edebiyatinda-postmodern-roman',
    category: 'Edebiyat', image: img('postmodern-roman'),
    excerpt: 'Postmodern romanın temel özellikleri, Türk edebiyatındaki yansımaları ve mutlaka okunması gereken eserler.',
    tags: ['edebiyat', 'postmodern', 'roman'],
    metaTitle: 'Türk Edebiyatında Postmodern Roman — Özellikleri ve Eserler',
    metaDesc: 'Postmodern roman nedir, Türk edebiyatında hangi yazarlarla gelişti? Özellikleri ve öne çıkan eserlerle rehber.',
    content: [
      '<h2>Postmodern Roman Nedir?</h2>',
      '<p>Postmodern roman, gerçekliğin tek ve mutlak olmadığını savunan; üst kurmaca, metinlerarasılık ve ironi gibi tekniklerle okuru anlatının parçası yapan bir biçimdir.</p>',
      '<h2>Temel Özellikleri</h2>',
      '<ul><li><strong>Üst kurmaca:</strong> Metnin kurmaca olduğunu hatırlatması.</li><li><strong>Metinlerarasılık:</strong> Başka eserlere göndermeler.</li><li><strong>Parçalı kurgu:</strong> Kırık zaman çizgisi.</li></ul>',
      '<h2>Türk Edebiyatından Örnekler</h2>',
      '<p>Oğuz Atay’ın <em>Tutunamayanlar</em>’ı, Orhan Pamuk’un <em>Kara Kitap</em>’ı ve İhsan Oktay Anar’ın <em>Puslu Kıtalar Atlası</em> bu geleneğin güçlü örnekleridir.</p>',
    ].join(''),
  },
  {
    title: 'Şiir Okumanın Zihinsel Faydaları ve Başlangıç İçin 5 Öneri',
    slug: 'siir-okumanin-zihinsel-faydalari',
    category: 'Edebiyat', image: img('siir-okuma'),
    excerpt: 'Şiir okumak hafızayı, empatiyi ve dil becerisini nasıl güçlendirir? Pratik önerilerle.',
    tags: ['edebiyat', 'şiir', 'okuma'],
    metaTitle: 'Şiir Okumanın Faydaları — Başlangıç Rehberi',
    metaDesc: 'Şiir okumanın zihinsel faydaları: empati, hafıza ve dil gelişimi — ve 5 pratik öneri.',
    content: [
      '<h2>Neden Şiir Okumalıyız?</h2>',
      '<p>Şiir, az sözle çok anlam taşıyan yoğun bir dildir. Düzenli okuma dikkat süresini artırır, kelime dağarcığını zenginleştirir.</p>',
      '<h2>Başlangıç İçin 5 Öneri</h2>',
      '<ul><li>Kısa şiirlerle başlayın.</li><li>Sesli okuyun, ritmi hissedin.</li><li>Tek bir şairi derinlemesine okuyun.</li><li>Anlamadığınız dizeleri not alın.</li><li>Bir şiir defteri tutun.</li></ul>',
    ].join(''),
  },
  {
    title: 'Distopya Edebiyatı: Neden Bu Kadar Popüler?',
    slug: 'distopya-edebiyati-neden-populer',
    category: 'Edebiyat', image: img('distopya'),
    excerpt: 'Distopik romanların yükselişi, türün temel taşları ve modern dünyayla kurduğu bağ.',
    tags: ['edebiyat', 'distopya', 'roman'],
    metaTitle: 'Distopya Edebiyatı Neden Popüler? — Tür Rehberi',
    metaDesc: 'Distopik roman nedir, neden bu kadar ilgi görüyor? 1984, Cesur Yeni Dünya ve türün özellikleri.',
    content: [
      '<h2>Distopya Nedir?</h2>',
      '<p>Distopya, baskıcı veya çökmüş bir gelecek tasviriyle bugünü eleştiren edebi türdür. Orwell’ın <em>1984</em>’ü ve Huxley’in <em>Cesur Yeni Dünya</em>’sı türün klasikleridir.</p>',
      '<h2>Neden Şimdi Popüler?</h2>',
      '<p>Teknolojik gözetim, iklim kaygısı ve toplumsal belirsizlik, okuyucuları bu türe yaklaştırıyor. Distopya, korkularımızı güvenli bir mesafeden düşünmemizi sağlıyor.</p>',
    ].join(''),
  },

  // ===================== MÜZIK =====================
  {
    title: 'Müzik Dinlemenin Beyin Üzerindeki Etkileri: Bilimsel Bir Bakış',
    slug: 'muzik-dinlemenin-beyin-uzerindeki-etkileri',
    category: 'Müzik', image: img('muzik-beyin'),
    excerpt: 'Müzik odaklanmayı, ruh halini ve hafızayı nasıl etkiler? Bilimsel kanıtlarla.',
    tags: ['müzik', 'beyin', 'bilim'],
    metaTitle: 'Müziğin Beyne Etkileri — Bilimsel Bakış',
    metaDesc: 'Müzik dinlemek beyni nasıl etkiler? Dopamin, odaklanma ve hafıza üzerindeki etkiler.',
    content: [
      '<h2>Müzik ve Beyin</h2>',
      '<p>Müzik dinlerken işitme korteksi, hafıza merkezleri ve duygu düzenleyen limbik sistem aynı anda çalışır. Bu çok bölgeli aktivasyon müziği güçlü bir uyaran yapar.</p>',
      '<h2>Dopamin ve Odaklanma</h2>',
      '<p>Sevdiğimiz parçalar dopamin salınımını artırır. Sözsüz müzik ise yoğun zihinsel işlerde dikkati toplamaya yardımcı olabilir.</p>',
    ].join(''),
  },
  {
    title: 'Vinil Plak Geri Dönüşü: Nostaljinin Sesi',
    slug: 'vinil-plak-geri-donusu',
    category: 'Müzik', image: img('vinil-plak'),
    excerpt: 'Dijital çağda vinil plaklar neden yeniden yükseliyor? Analog sesin çekiciliği.',
    tags: ['müzik', 'vinil', 'analog'],
    metaTitle: 'Vinil Plak Geri Dönüşü — Neden Yeniden Popüler?',
    metaDesc: 'Vinil plak satışları neden artıyor? Analog ses, koleksiyonculuk ve nostalji üzerine.',
    content: [
      '<h2>Analog Sesin Dönüşü</h2>',
      '<p>Akış platformlarının hakimiyetine rağmen vinil satışları son yıllarda istikrarlı artıyor. Dinleyiciler sıcak, dolu analog tınıyı ve fiziksel sahipliği önemsiyor.</p>',
      '<h2>Bir Rituële Dönüşmesi</h2>',
      '<p>Plağı çıkarmak, kapak tasarımını incelemek ve dinlemeye odaklanmak; müziği arka plan gürültüsünden bir deneyime dönüştürüyor.</p>',
    ].join(''),
  },
  {
    title: 'Film Müziği Nasıl Yapılır? Temel Kavramlar',
    slug: 'film-muzigi-nasil-yapilir',
    category: 'Müzik', image: img('film-muzigi'),
    excerpt: 'Bir sahnenin duygusunu belirleyen film müziğinin temel teknikleri ve süreci.',
    tags: ['müzik', 'film', 'besteleme'],
    metaTitle: 'Film Müziği Nasıl Yapılır? — Temel Kavramlar',
    metaDesc: 'Film müziği besteleme süreci: leitmotif, tempo, enstrümantasyon ve sahneye uyum.',
    content: [
      '<h2>Müzik ve Görüntü</h2>',
      '<p>Film müziği, görüntüdeki duyguyu güçlendirir veya yönlendirir. İyi bir skor fark edilmeden hissettirir.</p>',
      '<h2>Temel Kavramlar</h2>',
      '<ul><li><strong>Leitmotif:</strong> Karakter veya temaya özgü tekrar eden ezgi.</li><li><strong>Tempo:</strong> Sahnenin ritmiyle uyum.</li><li><strong>Enstrümantasyon:</strong> Duyguyu taşıyan ses rengi seçimi.</li></ul>',
    ].join(''),
  },

  // ===================== YAPAY ZEKA =====================
  {
    title: 'Yapay Zeka Nedir? Yeni Başlayanlar İçin Kapsamlı Rehber',
    slug: 'yapay-zeka-nedir-yeni-baslayanlar-rehberi',
    category: 'Yapay Zeka', image: img('yapay-zeka'),
    excerpt: 'Yapay zeka nedir, nasıl çalışır ve günlük hayatı nasıl değiştiriyor? Sade bir dille.',
    tags: ['yapay zeka', 'ai', 'makine öğrenmesi'],
    metaTitle: 'Yapay Zeka Nedir? — Yeni Başlayanlar Rehberi',
    metaDesc: 'Yapay zeka nedir, nasıl çalışır? Makine öğrenmesi, derin öğrenme ve günlük kullanım alanları.',
    content: [
      '<h2>Yapay Zeka Nedir?</h2>',
      '<p>Yapay zeka (AI), bilgisayarların öğrenme, akıl yürütme ve problem çözme yeteneklerini taklit etmesidir. Amaç, verilerden örüntü çıkarıp karar üretmektir.</p>',
      '<h2>Temel Kavramlar</h2>',
      '<ul><li><strong>Makine öğrenmesi:</strong> Veriden kuralları öğrenme.</li><li><strong>Derin öğrenme:</strong> Sinir ağlarıyla karmaşık örüntüler.</li><li><strong>Büyük dil modelleri:</strong> Metni anlayıp üretme.</li></ul>',
    ].join(''),
  },
  {
    title: 'İşletmeler İçin Yapay Zeka: Verimliliği Artıran 6 Kullanım Alanı',
    slug: 'isletmeler-icin-yapay-zeka-6-kullanim-alani',
    category: 'Yapay Zeka', image: img('isletme-ai'),
    excerpt: 'KOBİ’ler yapay zekayı hangi alanlarda kullanabilir? Maliyeti düşüren 6 pratik alan.',
    tags: ['yapay zeka', 'işletme', 'verimlilik'],
    metaTitle: 'İşletmeler İçin Yapay Zeka — 6 Kullanım Alanı',
    metaDesc: 'İşletmelerde yapay zeka: müşteri hizmetleri, pazarlama, otomasyon ve veri analizi.',
    content: [
      '<h2>Artık Herkes İçin</h2>',
      '<p>Bulut araçlar sayesinde küçük işletmeler de yapay zekadan düşük maliyetle yararlanabiliyor.</p>',
      '<ul><li><strong>Müşteri hizmetleri:</strong> 7/24 sohbet botları.</li><li><strong>Pazarlama:</strong> İçerik ve hedef kitle analizi.</li><li><strong>Otomasyon:</strong> Tekrar eden işlerin otomasyonu.</li><li><strong>Veri analizi:</strong> Karar destek raporları.</li></ul>',
    ].join(''),
  },
  {
    title: 'Üretken Yapay Zeka ve İçerik Üretiminin Geleceği',
    slug: 'uretken-yapay-zeka-icerik-uretimi',
    category: 'Yapay Zeka', image: img('uretken-ai'),
    excerpt: 'Üretken AI metin, görsel ve kod üretimini nasıl dönüştürüyor? Fırsatlar ve sınırlar.',
    tags: ['yapay zeka', 'üretken ai', 'içerik'],
    metaTitle: 'Üretken Yapay Zeka ve İçerik Üretiminin Geleceği',
    metaDesc: 'Üretken AI ile metin, görsel ve kod üretimi; içerik dünyasındaki fırsatlar ve riskler.',
    content: [
      '<h2>Üretken AI Nedir?</h2>',
      '<p>Üretken yapay zeka; metin, görsel, ses ve kod gibi yeni içerikler üretebilen modelleri tanımlar. İçerik üretiminde hız ve ölçek sağlar.</p>',
      '<h2>Fırsatlar ve Sınırlar</h2>',
      '<p>Verimlilik artarken özgünlük, doğruluk ve telif gibi konular önem kazanıyor. En iyi sonuç, insan denetimi ile AI hızının birleştiği yerde çıkıyor.</p>',
    ].join(''),
  },

  // ===================== TICARET =====================
  {
    title: 'E-Ticarete Başlarken Bilmeniz Gereken 7 Temel Adım',
    slug: 'e-ticarete-baslarken-7-temel-adim',
    category: 'Ticaret', image: img('e-ticaret'),
    excerpt: 'Sıfırdan e-ticaret kurmak isteyenler için ürün seçiminden ödemeye 7 adım.',
    tags: ['ticaret', 'e-ticaret', 'girişimcilik'],
    metaTitle: 'E-Ticarete Başlama Rehberi — 7 Temel Adım',
    metaDesc: 'E-ticarete sıfırdan başlama: niş seçimi, tedarik, platform, ödeme, kargo ve pazarlama.',
    content: [
      '<h2>Doğru Plan, Doğru Adımlar</h2>',
      '<p>Düşük başlangıç maliyeti e-ticareti cazip kılar; ancak başarı planı doğru kurmaktan geçer.</p>',
      '<ul><li><strong>Niş seçimi</strong> ve <strong>tedarik</strong></li><li><strong>Platform</strong> ve <strong>ödeme altyapısı</strong></li><li><strong>Kargo</strong>, <strong>pazarlama</strong> ve <strong>analiz</strong></li></ul>',
    ].join(''),
  },
  {
    title: 'Dropshipping Modeli: Avantajları ve Riskleri',
    slug: 'dropshipping-modeli-avantaj-risk',
    category: 'Ticaret', image: img('dropshipping'),
    excerpt: 'Stoksuz satış modeli dropshipping nasıl çalışır? Kime uygun, nelere dikkat etmeli?',
    tags: ['ticaret', 'dropshipping', 'online satış'],
    metaTitle: 'Dropshipping Nedir? — Avantajları ve Riskleri',
    metaDesc: 'Dropshipping modeli nasıl çalışır, avantajları ve riskleri neler? Başlamadan bilmeniz gerekenler.',
    content: [
      '<h2>Dropshipping Nedir?</h2>',
      '<p>Stok tutmadan, siparişi tedarikçiden müşteriye doğrudan gönderten satış modelidir. Düşük başlangıç sermayesi gerektirir.</p>',
      '<h2>Avantaj ve Riskler</h2>',
      '<p><strong>Avantaj:</strong> Düşük risk, geniş ürün yelpazesi. <strong>Risk:</strong> Düşük kar marjı, tedarikçiye bağımlılık ve kalite kontrol zorluğu.</p>',
    ].join(''),
  },
  {
    title: 'Marka Bilinirliği Nasıl Artırılır? 6 Etkili Yöntem',
    slug: 'marka-bilinirligi-nasil-artirilir',
    category: 'Ticaret', image: img('marka-bilinirligi'),
    excerpt: 'Küçük bütçeyle marka bilinirliğini artıran pratik ve uygulanabilir yöntemler.',
    tags: ['ticaret', 'marka', 'pazarlama'],
    metaTitle: 'Marka Bilinirliği Nasıl Artırılır? — 6 Yöntem',
    metaDesc: 'Marka bilinirliğini artırmanın yolları: içerik pazarlaması, sosyal medya, iş birlikleri ve SEO.',
    content: [
      '<h2>Bilinirlik Neden Önemli?</h2>',
      '<p>Tanınan marka, güven ve tekrar eden satış demektir. Bilinirlik uzun vadeli bir yatırımdır.</p>',
      '<h2>Etkili Yöntemler</h2>',
      '<ul><li>Değerli içerik üretimi (blog, video)</li><li>Sosyal medyada tutarlılık</li><li>SEO ve organik görünürlük</li><li>İş birlikleri ve referanslar</li></ul>',
    ].join(''),
  },

  // ===================== GÜNDEM =====================
  {
    title: '2026 Teknoloji Trendleri: Öne Çıkanlar',
    slug: '2026-teknoloji-trendleri',
    category: 'Gündem', image: img('teknoloji-trend'),
    excerpt: 'Yapay zeka ajanları, kenar bilişim ve sürdürülebilir teknoloji: 2026’ya yön veren başlıklar.',
    tags: ['gündem', 'teknoloji', 'trend'],
    metaTitle: '2026 Teknoloji Trendleri — Öne Çıkanlar',
    metaDesc: '2026’da öne çıkan teknoloji trendleri: yapay zeka ajanları, kenar bilişim ve sürdürülebilirlik.',
    content: [
      '<h2>Yıla Yön Veren Başlıklar</h2>',
      '<p>Yapay zeka ajanlarının yaygınlaşması, cihaz üzerinde çalışan modeller ve sürdürülebilir veri merkezleri 2026’nın ana gündemi.</p>',
      '<h2>Ne Beklemeli?</h2>',
      '<ul><li>Görevleri uçtan uca yürüten AI ajanları</li><li>Gizlilik odaklı cihaz-içi yapay zeka</li><li>Enerji verimli, yeşil altyapı</li></ul>',
    ].join(''),
  },
  {
    title: 'Uzaktan Çalışma Kültürü Kalıcı mı?',
    slug: 'uzaktan-calisma-kulturu-kalici-mi',
    category: 'Gündem', image: img('uzaktan-calisma'),
    excerpt: 'Hibrit modeller, verimlilik tartışmaları ve şirketlerin değişen yaklaşımı.',
    tags: ['gündem', 'uzaktan çalışma', 'iş'],
    metaTitle: 'Uzaktan Çalışma Kalıcı mı? — Hibrit Çağ',
    metaDesc: 'Uzaktan ve hibrit çalışma kalıcı mı? Verimlilik, kültür ve şirketlerin yeni düzeni.',
    content: [
      '<h2>Yeni Normal</h2>',
      '<p>Pandemi sonrası birçok şirket hibrit modele geçti. Çalışanlar esneklik isterken şirketler iş birliği ve kültürü koruma derdinde.</p>',
      '<h2>Denge Arayışı</h2>',
      '<p>Başarılı modeller; net beklentiler, doğru araçlar ve sonuca dayalı değerlendirme üzerine kuruluyor.</p>',
    ].join(''),
  },
  {
    title: 'Dijital Gizlilik: Verilerinizi Nasıl Korursunuz?',
    slug: 'dijital-gizlilik-veri-koruma',
    category: 'Gündem', image: img('dijital-gizlilik'),
    excerpt: 'Günlük hayatta kişisel verilerinizi korumak için basit ama etkili 7 adım.',
    tags: ['gündem', 'gizlilik', 'güvenlik'],
    metaTitle: 'Dijital Gizlilik — Verilerinizi Korumanın 7 Yolu',
    metaDesc: 'Dijital gizlilik nasıl korunur? Güçlü parola, iki adımlı doğrulama ve veri hijyeni ipuçları.',
    content: [
      '<h2>Neden Önemli?</h2>',
      '<p>Verileriniz dijital kimliğinizdir. Küçük alışkanlıklar büyük riskleri önler.</p>',
      '<h2>7 Adım</h2>',
      '<ul><li>Güçlü, benzersiz parolalar ve parola yöneticisi</li><li>İki adımlı doğrulama</li><li>Yazılım güncellemeleri</li><li>Gereksiz uygulama izinlerini kapatma</li><li>Halka açık Wi-Fi’de VPN</li></ul>',
    ].join(''),
  },
];

const projects = [
  {
    title: 'Koli — Şehirler Arası Kargo & Lojistik Platformu',
    slug: 'koli-lojistik-platformu',
    coverImage: img('koli-lojistik'),
    description: 'Birden fazla şehirde çalışan, ilan tabanlı kargo ve lojistik eşleştirme platformu. Gönderici ile taşıyıcıyı bir araya getirir.',
    tags: ['Next.js', 'PostgreSQL', 'Redis', 'MinIO', 'Docker'],
    isFeatured: true, sortOrder: 1,
    content: '<h2>Proje Hakkında</h2><p>Koli, şehirler arası eşya gönderimini kolaylaştıran ilan tabanlı bir lojistik platformudur.</p><h2>Teknik Altyapı</h2><ul><li>Next.js web + ayrı API servisi</li><li>PostgreSQL, Redis, Meilisearch</li><li>MinIO nesne depolama</li><li>Docker Compose ile dağıtım</li></ul>',
  },
  {
    title: 'Evrak — Öğretmenler İçin AI Destekli Belge Sistemi',
    slug: 'evrak-ai-belge-sistemi',
    coverImage: img('evrak-belge'),
    description: 'Dilekçe, tutanak ve resmi belgeleri hazır şablonlar ve yapay zeka desteğiyle saniyeler içinde oluşturan platform.',
    tags: ['Next.js', 'Prisma', 'Claude AI', 'PDF'],
    isFeatured: true, sortOrder: 2,
    content: '<h2>Proje Hakkında</h2><p>Evrak, eğitim çalışanlarının sık kullandığı resmi belgeleri hızlıca üretmesini sağlar.</p><h2>Teknik Altyapı</h2><ul><li>Next.js + NextAuth</li><li>Prisma + PostgreSQL</li><li>Claude AI ile belge üretimi</li><li>PDF dışa aktarma ve OCR</li></ul>',
  },
];

const snippets = [
  {
    title: 'Python ile Web Scraping: requests + BeautifulSoup',
    slug: 'python-web-scraping-requests-beautifulsoup',
    language: 'python', description: 'Bir web sayfasındaki başlıkları çeken basit örnek.',
    tags: ['python', 'scraping'], sortOrder: 1,
    code: ['import requests', 'from bs4 import BeautifulSoup', '', 'url = "https://example.com"', 'r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)', 'r.raise_for_status()', '', 'soup = BeautifulSoup(r.text, "html.parser")', 'for h in soup.find_all("h2"):', '    print(h.get_text(strip=True))'].join('\n'),
  },
  {
    title: "Python'da Dekoratör ile Fonksiyon Süresi Ölçme",
    slug: 'python-dekorator-fonksiyon-suresi-olcme',
    language: 'python', description: 'Bir fonksiyonun çalışma süresini ölçen dekoratör.',
    tags: ['python', 'dekoratör'], sortOrder: 2,
    code: ['import time', 'from functools import wraps', '', 'def sure_olc(func):', '    @wraps(func)', '    def wrapper(*args, **kwargs):', '        t = time.perf_counter()', '        r = func(*args, **kwargs)', '        print(f"{func.__name__}: {time.perf_counter()-t:.4f}s")', '        return r', '    return wrapper'].join('\n'),
  },
  {
    title: "Python'da JSON Dosyası Okuma ve Yazma",
    slug: 'python-json-okuma-yazma',
    language: 'python', description: 'JSON dosyasını güvenli biçimde okuma ve yazma.',
    tags: ['python', 'json'], sortOrder: 3,
    code: ['import json', '', '# Yazma', 'veri = {"ad": "Ali", "yas": 30}', 'with open("veri.json", "w", encoding="utf-8") as f:', '    json.dump(veri, f, ensure_ascii=False, indent=2)', '', '# Okuma', 'with open("veri.json", encoding="utf-8") as f:', '    veri = json.load(f)', 'print(veri["ad"])'].join('\n'),
  },
  {
    title: "Python: Liste Kavraması (List Comprehension) Örnekleri",
    slug: 'python-list-comprehension',
    language: 'python', description: 'Daha kısa ve okunaklı liste üretimi.',
    tags: ['python', 'temel'], sortOrder: 4,
    code: ['kareler = [x*x for x in range(10)]', 'ciftler = [x for x in range(20) if x % 2 == 0]', 'matris = [[i*j for j in range(3)] for i in range(3)]', 'kelimeler = [w.upper() for w in ["al", "ve", "git"]]', 'print(kareler)', 'print(ciftler)'].join('\n'),
  },
  {
    title: 'JavaScript: Debounce Fonksiyonu',
    slug: 'javascript-debounce-fonksiyonu',
    language: 'javascript', description: 'Sık tetiklenen olayları (arama, scroll) geciktirip performansı artırır.',
    tags: ['javascript', 'performans'], sortOrder: 5,
    code: ['function debounce(fn, delay = 300) {', '  let t;', '  return (...args) => {', '    clearTimeout(t);', '    t = setTimeout(() => fn(...args), delay);', '  };', '}', '', 'const ara = debounce((q) => console.log("Aranıyor:", q), 500);', 'input.addEventListener("input", (e) => ara(e.target.value));'].join('\n'),
  },
  {
    title: 'Bash: Toplu Dosya Yeniden Adlandırma',
    slug: 'bash-toplu-dosya-yeniden-adlandirma',
    language: 'bash', description: 'Bir klasördeki .txt dosyalarına önek ekler.',
    tags: ['bash', 'linux'], sortOrder: 6,
    code: ['#!/bin/bash', '# Tüm .txt dosyalarına "yedek_" öneki ekle', 'for f in *.txt; do', '  mv "$f" "yedek_$f"', 'done', 'echo "Tamamlandı."'].join('\n'),
  },
];

const services = [
  {
    title: 'Web Yazılım',
    slug: 'web-yazilim',
    price: 'Projeye özel teklif',
    description: 'Modern, hızlı ve ölçeklenebilir web uygulamaları. Kurumsal site, panel ve e-ticaret çözümleri.',
    features: ['Next.js / React ile geliştirme', 'Mobil uyumlu, SEO dostu', 'Yönetim paneli ve API', 'Bakım ve destek'],
    sortOrder: 1,
  },
  {
    title: 'Fason Üretim (Yazılım)',
    slug: 'fason-uretim',
    price: 'Saatlik / paket',
    description: 'Ajanslar ve ekipler için dış kaynak (outsource) yazılım geliştirme. Projenizi sizin adınıza hayata geçiriyoruz.',
    features: ['Beyaz etiket teslim', 'Esnek kapasite', 'Kod sahipliği sizde', 'Düzenli raporlama'],
    sortOrder: 2,
  },
  {
    title: 'Data & Otomasyon',
    slug: 'data-otomasyon',
    price: 'Projeye özel teklif',
    description: 'Veri kazıma (scraping), veri temizleme, otomasyon ve raporlama / dashboard çözümleri.',
    features: ['Web scraping & veri toplama', 'Otomatik iş akışları', 'Dashboard ve görselleştirme', 'Periyodik veri besleme'],
    sortOrder: 3,
  },
];

async function main() {
  const admin = await db.user.findFirst({ where: { role: 'SUPER_ADMIN' }, select: { id: true } })
    ?? await db.user.findFirst({ select: { id: true } });
  if (!admin) {
    console.error('\n❌ Hiç kullanıcı yok. Önce admin oluştur (create-admin.ts).\n');
    process.exit(1);
  }

  for (const a of articles) {
    await db.news.upsert({
      where: { slug: a.slug },
      create: {
        title: a.title, slug: a.slug, excerpt: a.excerpt, content: a.content, image: a.image,
        type: 'BLOG', status: 'PUBLISHED', authorId: admin.id, tags: a.tags, category: a.category,
        metaTitle: a.metaTitle, metaDesc: a.metaDesc, isAiGenerated: false, publishedAt: new Date(),
      },
      update: {
        title: a.title, excerpt: a.excerpt, content: a.content, image: a.image,
        tags: a.tags, category: a.category, metaTitle: a.metaTitle, metaDesc: a.metaDesc,
        type: 'BLOG', status: 'PUBLISHED',
      },
    });
  }
  console.log(`✅ ${articles.length} blog yazısı`);

  for (const p of projects) {
    await db.project.upsert({
      where: { slug: p.slug },
      create: { title: p.title, slug: p.slug, description: p.description, content: p.content, coverImage: p.coverImage, tags: p.tags, isFeatured: p.isFeatured, isActive: true, sortOrder: p.sortOrder },
      update: { title: p.title, description: p.description, content: p.content, coverImage: p.coverImage, tags: p.tags, isFeatured: p.isFeatured, isActive: true, sortOrder: p.sortOrder },
    });
  }
  console.log(`✅ ${projects.length} proje`);

  for (const s of snippets) {
    await db.codeSnippet.upsert({
      where: { slug: s.slug },
      create: { title: s.title, slug: s.slug, description: s.description, language: s.language, code: s.code, tags: s.tags, isActive: true, sortOrder: s.sortOrder },
      update: { title: s.title, description: s.description, language: s.language, code: s.code, tags: s.tags, isActive: true, sortOrder: s.sortOrder },
    });
  }
  console.log(`✅ ${snippets.length} kod örneği`);

  for (const s of services) {
    await db.service.upsert({
      where: { slug: s.slug },
      create: { title: s.title, slug: s.slug, description: s.description, features: s.features, price: s.price, isActive: true, sortOrder: s.sortOrder },
      update: { title: s.title, description: s.description, features: s.features, price: s.price, isActive: true, sortOrder: s.sortOrder },
    });
  }
  console.log(`✅ ${services.length} hizmet`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
