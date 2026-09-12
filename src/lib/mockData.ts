// ============================================================
// Mock Data for Corporate News Portal
// ============================================================

export interface BreakingNewsItem {
  id: number;
  title: string;
  category: string;
  time: string;
}

export interface HeroNewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  time: string;
  author: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface CategoryNewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  categoryId: string;
  image: string;
  time: string;
  author: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  readTime: number;
  date: string;
  author: string;
  authorAvatar: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  startingPrice: string;
}

export interface CodeExample {
  id: number;
  title: string;
  language: string;
  code: string;
  description: string;
}

export interface CurrencyData {
  code: string;
  name: string;
  flag: string;
  buy: number;
  sell: number;
  change: number;
}

export interface StockIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface WeatherDay {
  day: string;
  condition: string;
  emoji: string;
  high: number;
  low: number;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  emoji: string;
  humidity: number;
  wind: number;
  forecast: WeatherDay[];
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  type: string;
}

export interface RecentPost {
  id: number;
  title: string;
  date: string;
  image: string;
  category: string;
}

export interface CommentedPost {
  id: number;
  title: string;
  category: string;
  commentCount: number;
}

export interface HistoricalEvent {
  year: number;
  description: string;
}

export interface Stat {
  id: number;
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

// ============================================================
// Breaking News
// ============================================================
export const breakingNewsItems: BreakingNewsItem[] = [
  { id: 1, title: "Merkez Bankası faiz kararını açıkladı: Politika faizi yüzde 45'te sabit tutuldu", category: "Ekonomi", time: "2 dk önce" },
  { id: 2, title: "Türkiye, G20 zirvesinde kritik iklim anlaşmasını imzaladı", category: "Dünya", time: "15 dk önce" },
  { id: 3, title: "BIST 100 endeksi güçlü yükselişle 11.500 puanı aştı", category: "Ekonomi", time: "22 dk önce" },
  { id: 4, title: "Yerli yapay zeka modeli 'TürkAI' kamuoyuyla paylaşıldı", category: "Teknoloji", time: "35 dk önce" },
  { id: 5, title: "Galatasaray, Şampiyonlar Ligi'nde çeyrek finale yükseldi", category: "Spor", time: "48 dk önce" },
  { id: 6, title: "Sağlık Bakanlığı yeni aşı takvimini duyurdu", category: "Sağlık", time: "1 sa önce" },
  { id: 7, title: "İstanbul Havalimanı yolcu rekoru kırdı: Günlük 250 bin yolcu", category: "Ekonomi", time: "1 sa önce" },
  { id: 8, title: "NASA'nın Mars görevinden ilk fotoğraflar geldi", category: "Teknoloji", time: "2 sa önce" },
  { id: 9, title: "İstanbul Film Festivali'nin yeni direktörü açıklandı", category: "Kültür", time: "2 sa önce" },
  { id: 10, title: "Doğu Anadolu'da 4.8 büyüklüğünde deprem meydana geldi", category: "Türkiye", time: "3 sa önce" },
];

// ============================================================
// Hero News
// ============================================================
export const heroNewsItems: HeroNewsItem[] = [
  {
    id: 1,
    title: "Türkiye'nin Dijital Dönüşüm Stratejisi 2030: Yapay Zeka ve Teknoloji Yatırımlarında Rekor Bütçe",
    excerpt: "Cumhurbaşkanlığı Dijital Dönüşüm Ofisi tarafından açıklanan strateji belgesi, Türkiye'nin önümüzdeki beş yılda teknoloji altyapısına 500 milyar TL yatırım yapacağını ortaya koydu.",
    category: "Teknoloji",
    image: "https://picsum.photos/800/500?random=1",
    time: "1 saat önce",
    author: "Ahmet Yılmaz",
  },
  {
    id: 2,
    title: "Küresel Ekonomide Resesyon Endişeleri: IMF Büyüme Tahminlerini Aşağı Yönlü Revize Etti",
    excerpt: "Uluslararası Para Fonu, 2026 küresel büyüme tahminini yüzde 2.8'den yüzde 2.4'e indirdi. Gelişmekte olan ülkelerin durumu masaya yatırıldı.",
    category: "Ekonomi",
    image: "https://picsum.photos/800/500?random=2",
    time: "3 saat önce",
    author: "Zeynep Kaya",
  },
  {
    id: 3,
    title: "Süper Yapay Zeka Yarışı Kızışıyor: OpenAI ve Google'ın Yeni Modelleri Benchmark Rekorları Kırdı",
    excerpt: "Silikon Vadisi'nin iki devi, aynı hafta içinde piyasaya sürdükleri yeni yapay zeka modellerinin insanüstü yeteneklere sahip olduğunu iddia etti.",
    category: "Teknoloji",
    image: "https://picsum.photos/800/500?random=3",
    time: "5 saat önce",
    author: "Mehmet Demir",
  },
  {
    id: 4,
    title: "Next.js 15 ile Tam Yığın Geliştirme: Server Actions ve Paralel Rotalar Rehberi",
    excerpt: "React Server Components ile full-stack uygulama geliştirme artık çok daha kolay. Bu kapsamlı rehberde App Router mimarisinin tüm inceliklerini ele aldık.",
    category: "Teknoloji",
    image: "https://picsum.photos/800/500?random=4",
    time: "6 saat önce",
    author: "Ayşe Çelik",
  },
  {
    id: 5,
    title: "SaaS Girişiminizi Büyütmek için 7 Ölçüm Metrikleri: ARR'dan NPS'e Kapsamlı Rehber",
    excerpt: "Ürün odaklı büyüme stratejilerinde doğru metrikleri takip etmek başarının anahtarı. Deneyimli girişimcilerden derlenen içgörüleri paylaşıyoruz.",
    category: "Girişim",
    image: "https://picsum.photos/800/500?random=5",
    time: "7 saat önce",
    author: "Can Arslan",
  },
];

// ============================================================
// News Categories
// ============================================================
export const newsCategories: NewsCategory[] = [
  { id: "teknoloji", name: "Teknoloji", color: "#3B82F6", icon: "💻" },
  { id: "ekonomi", name: "Ekonomi", color: "#10B981", icon: "📈" },
  { id: "dunya", name: "Dünya", color: "#8B5CF6", icon: "🌍" },
  { id: "spor", name: "Spor", color: "#EF4444", icon: "⚽" },
  { id: "saglik", name: "Sağlık", color: "#06B6D4", icon: "🏥" },
  { id: "kultur", name: "Kültür", color: "#F59E0B", icon: "🎭" },
];

// ============================================================
// Category News Blocks
// ============================================================
export const categoryNewsBlocks: Record<string, CategoryNewsItem[]> = {
  teknoloji: [
    { id: 101, title: "Kuantum Bilgisayarlar Ticari Kullanıma Hazır Hale Geliyor", excerpt: "IBM'in yeni kuantum işlemcisi, klasik bilgisayarları katbekat geride bırakıyor.", category: "Teknoloji", categoryId: "teknoloji", image: "https://picsum.photos/120/80?random=11", time: "1 sa", author: "Ali Vural" },
    { id: 102, title: "5G Kapsama Alanı Türkiye'de Yüzde 78'e Ulaştı", excerpt: "BTK verilerine göre 5G altyapı yatırımları hız kazanıyor.", category: "Teknoloji", categoryId: "teknoloji", image: "https://picsum.photos/120/80?random=12", time: "3 sa", author: "Selin Ak" },
    { id: 103, title: "Elektrikli Araç Bataryalarında Devrim: Şarj Süresi 5 Dakikaya İndi", excerpt: "Yeni solid-state batarya teknolojisi otomotiv sektörünü alt üst edecek.", category: "Teknoloji", categoryId: "teknoloji", image: "https://picsum.photos/120/80?random=13", time: "5 sa", author: "Burak Er" },
    { id: 104, title: "Türk Yazılım Girişimleri 2025'te 3 Milyar Dolar Yatırım Aldı", excerpt: "Fintech ve SaaS alanlarındaki girişimler yabancı yatırımcıların ilgi odağı oldu.", category: "Teknoloji", categoryId: "teknoloji", image: "https://picsum.photos/120/80?random=14", time: "8 sa", author: "Derya Yıldız" },
  ],
  ekonomi: [
    { id: 201, title: "Enflasyon Mayıs'ta Yüzde 38.2 ile Beklentilerin Altında Kaldı", excerpt: "TÜİK verilerine göre manşet enflasyonda yavaşlama sinyali güçleniyor.", category: "Ekonomi", categoryId: "ekonomi", image: "https://picsum.photos/120/80?random=21", time: "2 sa", author: "Kemal Şahin" },
    { id: 202, title: "Türk Lirası Dolar Karşısında Tarihî Seviyede Tutunuyor", excerpt: "Döviz rezervlerindeki artış TL'ye destek sağlıyor.", category: "Ekonomi", categoryId: "ekonomi", image: "https://picsum.photos/120/80?random=22", time: "4 sa", author: "Nalan Öztürk" },
    { id: 203, title: "Konut Kredisi Faizleri Üç Yılın En Düşük Seviyesinde", excerpt: "Bankalar konut finansmanında rekabetçi faizler sunmaya başladı.", category: "Ekonomi", categoryId: "ekonomi", image: "https://picsum.photos/120/80?random=23", time: "6 sa", author: "Tarık Uysal" },
    { id: 204, title: "İhracat Mayıs'ta 26 Milyar Dolara Ulaştı", excerpt: "Otomotiv ve tekstil sektörü ihracattaki büyümenin lokomotifi olmaya devam ediyor.", category: "Ekonomi", categoryId: "ekonomi", image: "https://picsum.photos/120/80?random=24", time: "9 sa", author: "Pınar Doğan" },
  ],
  dunya: [
    { id: 301, title: "AB-Türkiye Gümrük Birliği Güncelleme Müzakereleri Yeniden Başladı", excerpt: "Brüksel'de yapılan görüşmelerde taraflar ticaret hacmini artırma konusunda mutabık kaldı.", category: "Dünya", categoryId: "dunya", image: "https://picsum.photos/120/80?random=31", time: "3 sa", author: "Esra Güner" },
    { id: 302, title: "NATO Zirvesi'nde Savunma Harcamaları Yüzde 3'e Yükseltildi", excerpt: "İttifak üyelerinin tamamı yeni savunma harcaması hedefini kabul etti.", category: "Dünya", categoryId: "dunya", image: "https://picsum.photos/120/80?random=32", time: "5 sa", author: "Volkan Çam" },
    { id: 303, title: "Japonya'da Tarihi Deprem: 7.8 Büyüklüğündeki Sarsıntı Tsunami Uyarısı Verdi", excerpt: "Japon yetkililer kıyı şehirlerini tahliye etmeye başladı.", category: "Dünya", categoryId: "dunya", image: "https://picsum.photos/120/80?random=33", time: "7 sa", author: "Hande Koç" },
    { id: 304, title: "ABD Başkanı'nın Orta Doğu Turu Bölgede Gerginliği Azaltıyor", excerpt: "Diplomatik görüşmelerde kalıcı ateşkes için somut adımlar atıldı.", category: "Dünya", categoryId: "dunya", image: "https://picsum.photos/120/80?random=34", time: "10 sa", author: "Osman Kılıç" },
  ],
  spor: [
    { id: 401, title: "Fenerbahçe Avrupa Ligi Finaline Kaldı: Rakip Bayer Leverkusen", excerpt: "Kanarya, yarı finalde İtalyan temsilcisini geçerek finale adını yazdırdı.", category: "Spor", categoryId: "spor", image: "https://picsum.photos/120/80?random=41", time: "1 sa", author: "Serkan Ateş" },
    { id: 402, title: "Milli Takım Kadrosu Açıklandı: Sürpriz İsimler Listede", excerpt: "Teknik direktör 23 kişilik kadroyu basınla paylaştı.", category: "Spor", categoryId: "spor", image: "https://picsum.photos/120/80?random=42", time: "3 sa", author: "Berk Yaman" },
    { id: 403, title: "NBA Finallerinde Golden State Warriors Rüzgarı", excerpt: "Warriors, Boston Celtics'i 4-1 yenerek şampiyonluğa ulaştı.", category: "Spor", categoryId: "spor", image: "https://picsum.photos/120/80?random=43", time: "5 sa", author: "Emre Tok" },
    { id: 404, title: "Formula 1 İstanbul Grand Prix'si Geri Dönüyor", excerpt: "FIA 2027 takvimini açıkladı; Türkiye 15 yıl aradan sonra F1'e kavuşuyor.", category: "Spor", categoryId: "spor", image: "https://picsum.photos/120/80?random=44", time: "8 sa", author: "Leyla Saraç" },
  ],
  saglik: [
    { id: 501, title: "Alzheimer Hastalığına Karşı Yeni İlaç FDA Onayı Aldı", excerpt: "Klinik deneylerde yüzde 60 etkinlik gösteren ilaç dünya genelinde uygulama bekliyor.", category: "Sağlık", categoryId: "saglik", image: "https://picsum.photos/120/80?random=51", time: "4 sa", author: "Prof. Dr. Murat Aydın" },
    { id: 502, title: "Türkiye'de Obezite Oranı Alarma Geçiriyor: Her 3 Yetişkinden 1'i Obez", excerpt: "Sağlık Bakanlığı ulusal beslenme eylem planını devreye soktu.", category: "Sağlık", categoryId: "saglik", image: "https://picsum.photos/120/80?random=52", time: "6 sa", author: "Dr. Elif Uçar" },
    { id: 503, title: "Kanser Tedavisinde Devrim: CAR-T Hücre Terapisi Türkiye'de de Uygulanıyor", excerpt: "Ankara Şehir Hastanesi'nde ilk başarılı CAR-T tedavisi gerçekleştirildi.", category: "Sağlık", categoryId: "saglik", image: "https://picsum.photos/120/80?random=53", time: "9 sa", author: "Prof. Dr. Selma Kara" },
    { id: 504, title: "Uyku Düzensizliği Kalp Hastalığı Riskini İkiye Katlıyor", excerpt: "Yeni araştırma yetersiz uykunun kardiyovasküler sistem üzerindeki etkilerini ortaya koydu.", category: "Sağlık", categoryId: "saglik", image: "https://picsum.photos/120/80?random=54", time: "11 sa", author: "Dr. Gökhan Tan" },
  ],
  kultur: [
    { id: 601, title: "Orhan Pamuk'un Yeni Romanı 47 Dilde Aynı Anda Yayımlandı", excerpt: "Nobel ödüllü yazarın eserinin devamı niteliğindeki kitap dünya edebiyat gündemini işgal etti.", category: "Kültür", categoryId: "kultur", image: "https://picsum.photos/120/80?random=61", time: "2 sa", author: "Fatma Ersoy" },
    { id: 602, title: "İstanbul Modern'de Türk Soyut Sanatı Retrospektifi Açıldı", excerpt: "Yüz yıllık Türk soyut sanatını kapsayan sergi 6 ay sürecek.", category: "Kültür", categoryId: "kultur", image: "https://picsum.photos/120/80?random=62", time: "4 sa", author: "Gül Menteş" },
    { id: 603, title: "Türk Dizisi Streaming Rekorunu Kırdı: Netflix'te 80 Ülkede 1 Numara", excerpt: "'İstanbul Sırları' dizisi dünya genelinde 150 milyon saatten fazla izlendi.", category: "Kültür", categoryId: "kultur", image: "https://picsum.photos/120/80?random=63", time: "6 sa", author: "Cem Ünal" },
    { id: 604, title: "Türk Mutfağı UNESCO Miras Listesine Girdi", excerpt: "Kültür Bakanlığı, geleneksel Türk mutfak pratiklerini UNESCO'ya tescil ettirdi.", category: "Kültür", categoryId: "kultur", image: "https://picsum.photos/120/80?random=64", time: "10 sa", author: "Şefika Arslan" },
  ],
};

// ============================================================
// Blog Posts
// ============================================================
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Mikroservis Mimarisinde Hata Yönetimi: Kapsamlı Bir Rehber",
    excerpt: "Dağıtık sistemlerde hata toleransı ve yeniden deneme stratejileri üzerine derinlemesine bir inceleme. Circuit breaker, bulkhead ve timeout gibi pattern'lar ele alınıyor.",
    category: "Teknoloji",
    tags: ["mikroservis", "docker", "kubernetes", "devops"],
    readTime: 12,
    date: "15 Haziran 2026",
    author: "Ahmet Yılmaz",
    authorAvatar: "https://picsum.photos/40/40?random=101",
    image: "https://picsum.photos/400/250?random=71",
  },
  {
    id: 2,
    title: "2026 Yılında Türkiye Ekonomisi: Fırsatlar ve Riskler",
    excerpt: "Küresel konjonktür değişimleri, enflasyon dinamikleri ve büyüme potansiyeli çerçevesinde Türkiye ekonomisinin önümüzdeki döneme ilişkin kapsamlı analizi.",
    category: "Ekonomi",
    tags: ["ekonomi", "finans", "yatırım", "TCMB"],
    readTime: 8,
    date: "14 Haziran 2026",
    author: "Zeynep Kaya",
    authorAvatar: "https://picsum.photos/40/40?random=102",
    image: "https://picsum.photos/400/250?random=72",
  },
  {
    id: 3,
    title: "React 19'un Yeni Özellikleri: Server Components ve Actions",
    excerpt: "React ekibinin uzun süredir üzerinde çalıştığı yeni mimari paradigma artık stabil. Bu yazıda Server Components'ı pratikte nasıl kullanabileceğinizi öğrenin.",
    category: "Teknoloji",
    tags: ["react", "javascript", "frontend", "web"],
    readTime: 10,
    date: "13 Haziran 2026",
    author: "Mehmet Demir",
    authorAvatar: "https://picsum.photos/40/40?random=103",
    image: "https://picsum.photos/400/250?random=73",
  },
  {
    id: 4,
    title: "Sürdürülebilir Şehircilik: İstanbul'un 2050 Vizyonu",
    excerpt: "İstanbul Büyükşehir Belediyesi'nin açıkladığı iklim eylem planı, 2050 yılına kadar karbon nötr kent hedefini nasıl gerçekleştireceğini ortaya koyuyor.",
    category: "Dünya",
    tags: ["şehircilik", "iklim", "sürdürülebilirlik", "İstanbul"],
    readTime: 7,
    date: "12 Haziran 2026",
    author: "Ayşe Çelik",
    authorAvatar: "https://picsum.photos/40/40?random=104",
    image: "https://picsum.photos/400/250?random=74",
  },
  {
    id: 5,
    title: "Yapay Zeka ile Sağlık Teşhisinde Yeni Dönem",
    excerpt: "Derin öğrenme modellerinin tıbbi görüntü analizindeki başarısı, radyoloji ve patoloji alanlarında devrim yaratıyor. Türkiye'deki uygulamalara da göz atıyoruz.",
    category: "Sağlık",
    tags: ["yapay zeka", "sağlık", "tıp", "AI"],
    readTime: 9,
    date: "11 Haziran 2026",
    author: "Prof. Dr. Murat Aydın",
    authorAvatar: "https://picsum.photos/40/40?random=105",
    image: "https://picsum.photos/400/250?random=75",
  },
  {
    id: 6,
    title: "TypeScript 5.5: Tip Sistemindeki Devrimsel Değişiklikler",
    excerpt: "Yeni inferred type predicates, isolatedDeclarations ve performans iyileştirmeleri ile TypeScript geliştiricileri için kapsamlı bir rehber.",
    category: "Teknoloji",
    tags: ["typescript", "javascript", "programlama"],
    readTime: 11,
    date: "10 Haziran 2026",
    author: "Can Arslan",
    authorAvatar: "https://picsum.photos/40/40?random=106",
    image: "https://picsum.photos/400/250?random=76",
  },
  {
    id: 7,
    title: "Kripto Para Piyasasında Kurumsal Yatırımcıların Yükselişi",
    excerpt: "Bitcoin ETF'lerinin onaylanmasının ardından Wall Street fonları kripto varlıklara milyarlarca dolar aktardı. Bu sürecin Türk yatırımcılara etkileri neler?",
    category: "Ekonomi",
    tags: ["kripto", "bitcoin", "finans", "yatırım"],
    readTime: 6,
    date: "9 Haziran 2026",
    author: "Serkan Ateş",
    authorAvatar: "https://picsum.photos/40/40?random=107",
    image: "https://picsum.photos/400/250?random=77",
  },
  {
    id: 8,
    title: "Türk Sineması Cannes'da: Üç Film Altın Palmiye Yarışında",
    excerpt: "Türk yönetmenlerin filmleri bu yıl Cannes Film Festivali'nde büyük ilgi gördü. Festivalde öne çıkan yapımlara ve yönetmenlerine bakış.",
    category: "Kültür",
    tags: ["sinema", "kültür", "Cannes", "film"],
    readTime: 5,
    date: "8 Haziran 2026",
    author: "Fatma Ersoy",
    authorAvatar: "https://picsum.photos/40/40?random=108",
    image: "https://picsum.photos/400/250?random=78",
  },
];

// ============================================================
// Products & Services
// ============================================================
export const products: Product[] = [
  {
    id: 1,
    name: "Kurumsal Bulut Altyapısı",
    description: "Güvenli, ölçeklenebilir ve yüksek erişilebilirlikli bulut sunucu çözümleri. SLA garantisi ile 7/24 teknik destek.",
    icon: "☁️",
    category: "Altyapı",
    startingPrice: "₺4.990/ay'dan",
  },
  {
    id: 2,
    name: "Kurumsal Güvenlik Paketi",
    description: "Siber tehditlere karşı uçtan uca koruma. Firewall, EDR, SIEM ve SOC hizmetlerini tek çatı altında sunar.",
    icon: "🛡️",
    category: "Güvenlik",
    startingPrice: "₺8.500/ay'dan",
  },
  {
    id: 3,
    name: "Veri Analitiği Platformu",
    description: "Büyük veri işleme, gerçek zamanlı analitik ve iş zekası raporlama araçları. AI destekli öngörü motoru dahildir.",
    icon: "📊",
    category: "Analitik",
    startingPrice: "₺12.000/ay'dan",
  },
  {
    id: 4,
    name: "Dijital Dönüşüm Danışmanlığı",
    description: "Kurumsal dijital dönüşüm yol haritası, süreç optimizasyonu ve teknoloji seçimi konularında uzman rehberliği.",
    icon: "🚀",
    category: "Danışmanlık",
    startingPrice: "₺25.000/proje'den",
  },
  {
    id: 5,
    name: "API Entegrasyon Hizmetleri",
    description: "ERP, CRM ve üçüncü taraf sistemlerle hızlı ve güvenilir API entegrasyonu. REST ve GraphQL desteği.",
    icon: "🔗",
    category: "Entegrasyon",
    startingPrice: "₺6.750/ay'dan",
  },
  {
    id: 6,
    name: "Yapay Zeka Çözümleri",
    description: "Kurumsal iş süreçlerine özel makine öğrenmesi modelleri, NLP ve bilgisayarlı görü uygulamaları geliştirme.",
    icon: "🤖",
    category: "Yapay Zeka",
    startingPrice: "₺18.000/ay'dan",
  },
];

// ============================================================
// Code Examples
// ============================================================
export const codeExamples: CodeExample[] = [
  {
    id: 1,
    title: "Next.js Server Action ile Form İşleme",
    language: "TypeScript",
    description: "Next.js 15'in yeni Server Actions özelliğini kullanarak sunucu taraflı form validasyonu ve veri kaydetme işlemi.",
    code: `'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const ContactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalı'),
})

export async function submitContact(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const result = ContactSchema.safeParse(raw)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  await db.contact.create({ data: result.data })
  revalidatePath('/iletisim')
  return { success: true }
}`,
  },
  {
    id: 2,
    title: "React Query ile Veri Çekme Hook'u",
    language: "TypeScript",
    description: "TanStack Query kullanarak sayfalama, önbellek ve hata yönetimi içeren özel bir veri çekme hook'u.",
    code: `import { useQuery, keepPreviousData } from '@tanstack/react-query'

interface NewsResponse {
  data: NewsItem[]
  total: number
  page: number
}

export function useNews(page: number, category?: string) {
  return useQuery<NewsResponse>({
    queryKey: ['news', page, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        ...(category && { category }),
      })
      const res = await fetch(\`/api/news?\${params}\`)
      if (!res.ok) throw new Error('Haberler yüklenemedi')
      return res.json()
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })
}`,
  },
  {
    id: 3,
    title: "Prisma ile Veritabanı İşlemleri",
    language: "TypeScript",
    description: "Prisma ORM ile ilişkisel veritabanında CRUD işlemleri, transaction yönetimi ve tip güvenli sorgular.",
    code: `import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getNewsWithCategories(limit = 10) {
  return prisma.news.findMany({
    take: limit,
    orderBy: { publishedAt: 'desc' },
    include: {
      category: true,
      author: {
        select: { name: true, avatar: true },
      },
    },
    where: { published: true },
  })
}

export async function publishNews(data: NewsInput) {
  return prisma.$transaction(async (tx) => {
    const news = await tx.news.create({ data })
    await tx.stats.update({
      where: { id: 'global' },
      data: { totalArticles: { increment: 1 } },
    })
    return news
  })
}`,
  },
  {
    id: 4,
    title: "Redis ile Önbellek Yönetimi",
    language: "TypeScript",
    description: "Redis kullanarak API yanıtlarını önbelleğe alma, TTL yönetimi ve cache invalidation stratejileri.",
    code: `import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)
const CACHE_TTL = 60 * 5 // 5 dakika

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = CACHE_TTL
): Promise<T> {
  const cached = await redis.get(key)

  if (cached) {
    return JSON.parse(cached) as T
  }

  const data = await fetcher()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}

// Kullanım
const news = await getCached(
  \`news:kategori:\${slug}\`,
  () => fetchNewsFromDB(slug),
  300
)`,
  },
];

// ============================================================
// Currency Data
// ============================================================
export const currencyData: CurrencyData[] = [
  { code: "USD", name: "Amerikan Doları", flag: "🇺🇸", buy: 32.45, sell: 32.68, change: 0.42 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", buy: 35.12, sell: 35.38, change: -0.18 },
  { code: "GBP", name: "İngiliz Sterlini", flag: "🇬🇧", buy: 41.20, sell: 41.55, change: 0.65 },
  { code: "JPY", name: "Japon Yeni", flag: "🇯🇵", buy: 0.2145, sell: 0.2162, change: -0.33 },
];

// ============================================================
// Stock Data
// ============================================================
export const stockIndices: StockIndex[] = [
  { name: "BIST 100", value: 11542.38, change: 187.42, changePercent: 1.65 },
  { name: "BIST 30", value: 13821.55, change: -42.18, changePercent: -0.30 },
];

export const stocks: Stock[] = [
  { symbol: "THYAO", name: "Türk Hava Yolları", price: 312.50, change: 8.20, changePercent: 2.70 },
  { symbol: "GARAN", name: "Garanti BBVA", price: 178.40, change: -2.60, changePercent: -1.44 },
  { symbol: "AKBNK", name: "Akbank", price: 154.80, change: 3.40, changePercent: 2.24 },
  { symbol: "EREGL", name: "Ereğli Demir Çelik", price: 89.15, change: -1.25, changePercent: -1.38 },
  { symbol: "BIMAS", name: "BİM Mağazalar", price: 445.20, change: 12.80, changePercent: 2.96 },
  { symbol: "SASA", name: "SASA Polyester", price: 67.30, change: 1.90, changePercent: 2.91 },
];

// ============================================================
// Weather Data
// ============================================================
export const weatherData: WeatherData = {
  city: "İstanbul",
  temp: 24,
  condition: "Parçalı Bulutlu",
  emoji: "⛅",
  humidity: 65,
  wind: 18,
  forecast: [
    { day: "Salı", condition: "Güneşli", emoji: "☀️", high: 27, low: 18 },
    { day: "Çarşamba", condition: "Bulutlu", emoji: "☁️", high: 22, low: 16 },
    { day: "Perşembe", condition: "Yağmurlu", emoji: "🌧️", high: 19, low: 14 },
    { day: "Cuma", condition: "Parçalı Bulutlu", emoji: "⛅", high: 23, low: 17 },
    { day: "Cumartesi", condition: "Güneşli", emoji: "☀️", high: 28, low: 19 },
  ],
};

// ============================================================
// Events
// ============================================================
export const events: Event[] = [
  { id: 1, title: "Türkiye Bilişim Zirvesi 2026", date: "2026-06-20", location: "İstanbul Kongre Merkezi", type: "Konferans" },
  { id: 2, title: "Fintek İstanbul Forumu", date: "2026-06-25", location: "Lütfi Kırdar ICEC", type: "Forum" },
  { id: 3, title: "Startup Türkiye Demo Day", date: "2026-07-02", location: "Zorlu PSM", type: "Demo" },
  { id: 4, title: "Siber Güvenlik Konferansı", date: "2026-07-10", location: "Online & Ankara", type: "Konferans" },
  { id: 5, title: "Yapay Zeka Hackathon 2026", date: "2026-07-18", location: "Teknopark İstanbul", type: "Hackathon" },
];

// ============================================================
// Recent Posts
// ============================================================
export const recentPosts: RecentPost[] = [
  { id: 1, title: "Kuantum Kriptografi ve Güvenliğin Geleceği", date: "17 Haz 2026", image: "https://picsum.photos/60/60?random=81", category: "Teknoloji" },
  { id: 2, title: "TCMB Para Politikasında Yeni Dönem", date: "16 Haz 2026", image: "https://picsum.photos/60/60?random=82", category: "Ekonomi" },
  { id: 3, title: "TypeScript 5.5 ile Gelen Yenilikler ve Performans İyileştirmeleri", date: "16 Haz 2026", image: "https://picsum.photos/60/60?random=83", category: "Teknoloji" },
  { id: 4, title: "Akdeniz Diyeti Beyin Sağlığını Koruyor", date: "15 Haz 2026", image: "https://picsum.photos/60/60?random=84", category: "Sağlık" },
  { id: 5, title: "Yapay Zeka Sanat Eseri mi Üretiyor?", date: "15 Haz 2026", image: "https://picsum.photos/60/60?random=85", category: "Kültür" },
  { id: 6, title: "Web3 ve Merkeziyetsiz Finans Rehberi", date: "14 Haz 2026", image: "https://picsum.photos/60/60?random=86", category: "Teknoloji" },
];

// ============================================================
// Most Commented Posts
// ============================================================
export const mostCommentedPosts: CommentedPost[] = [
  { id: 1, title: "ChatGPT Türkçe Eğitimde Ne Kadar Başarılı?", category: "Teknoloji", commentCount: 342 },
  { id: 2, title: "Emekli Maaşlarına Yapılacak Zam Beklentisi", category: "Ekonomi", commentCount: 289 },
  { id: 3, title: "Yapay Zeka ile İçerik Üretiminde Etik Sınırlar Nerede?", category: "Teknoloji", commentCount: 256 },
  { id: 4, title: "İstanbul'da Konut Fiyatları Nereye Gidiyor?", category: "Ekonomi", commentCount: 198 },
  { id: 5, title: "Sağlıklı Yaşam için 10 Altın Kural", category: "Sağlık", commentCount: 175 },
  { id: 6, title: "Türk Dizileri Küresel Rekabette Nerede?", category: "Kültür", commentCount: 143 },
];

// ============================================================
// This Day in History
// ============================================================
export const historicalEvents: HistoricalEvent[] = [
  { year: 1923, description: "Lozan Antlaşması müzakerelerinde Türk heyeti kritik toprak meselelerinde uzlaşma sağladı." },
  { year: 1985, description: "Türkiye, Avrupa Topluluğu'na tam üyelik başvurusunu resmen yaptı." },
  { year: 2013, description: "Gezi Parkı protestoları İstanbul'dan tüm büyük şehirlere yayıldı." },
];

// ============================================================
// Stats
// ============================================================
export const stats: Stat[] = [
  { id: 1, label: "Toplam Makale", value: 48250, suffix: "+", icon: "📰" },
  { id: 2, label: "Aylık Okuyucu", value: 2800000, suffix: "+", icon: "👥" },
  { id: 3, label: "Kategori", value: 24, suffix: "", icon: "📂" },
  { id: 4, label: "Yıllık Deneyim", value: 15, suffix: "+", icon: "🏆" },
];
