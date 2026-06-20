// Site-wide settings types and defaults — stored in DB, loaded via API

export interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  target?: '_blank' | '_self';
  children?: NavMenuItem[];
  megaColumns?: NavMenuItem[][];
}

export interface AdZoneConfig {
  id: string;
  label: string;
  active: boolean;
  type: 'adsense' | 'html' | 'image';
  content: string; // AdSense client/slot, raw HTML, or image URL
  width: number;
  height: number;
}

export interface HomepageSection {
  id: string;
  label: string;
  active: boolean;
  order: number;
  config?: Record<string, unknown>;
}

export interface SiteSettings {
  general: {
    siteName: string;
    tagline: string;
    logoLight: string;
    logoDark: string;
    favicon: string;
    language: string;
    timezone: string;
    dateFormat: string;
    postsPerPage: number;
    darkMode: boolean;
    maintenanceMode: boolean;
  };
  header: {
    layout: 1 | 2 | 3;
    sticky: boolean;
    showTopBar: boolean;
    showSearch: boolean;
    showBreakingNews: boolean;
    showWeather: boolean;
    showCurrency: boolean;
    ctaLabel: string;
    ctaHref: string;
  };
  footer: {
    layout: 1 | 2 | 3 | 4;
    copyright: string;
    showSocialIcons: boolean;
    showNewsletter: boolean;
    accordionOnMobile: boolean;
    columns: {
      id: string;
      title: string;
      type: 'links' | 'text' | 'newsletter' | 'social';
      content: string;
      links?: { label: string; href: string }[];
      active: boolean;
    }[];
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    borderColor: string;
  };
  typography: {
    headingFont: 'Playfair Display' | 'Inter' | 'Roboto' | 'Montserrat' | 'Merriweather';
    bodyFont: 'Inter' | 'Roboto' | 'Open Sans' | 'Lato';
    baseFontSize: number;
    headingWeight: '400' | '600' | '700' | '800';
  };
  seo: {
    titleSeparator: string;
    titleTemplate: string;
    defaultDescription: string;
    ogImage: string;
    googleVerification: string;
    googleAnalyticsId: string;
    enableSitemap: boolean;
    enableRobots: boolean;
    schemaType: 'Organization' | 'NewsMediaOrganization' | 'Blog';
    canonicalUrl: string;
  };
  social: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    pinterest: string;
    reddit: string;
    medium: string;
    showShareButtons: boolean;
    shareButtonPosition: 'top' | 'bottom' | 'both' | 'floating';
  };
  performance: {
    lazyLoadImages: boolean;
    minifyHtml: boolean;
    enableCdn: boolean;
    cdnUrl: string;
    cacheMaxAge: number;
  };
  ads: {
    zones: AdZoneConfig[];
    adsenseClientId: string;
    globalAdsActive: boolean;
  };
  homepage: {
    sections: HomepageSection[];
  };
  navigation: {
    headerMenu: NavMenuItem[];
    footerMenuPrimary: NavMenuItem[];
    footerMenuSecondary: NavMenuItem[];
  };
}

export const defaultSettings: SiteSettings = {
  general: {
    siteName: 'KURUMSAL',
    tagline: "Türkiye'nin Öncü Haber & Analiz Platformu",
    logoLight: '/logo-light.svg',
    logoDark: '/logo-dark.svg',
    favicon: '/favicon.ico',
    language: 'tr',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD MMMM YYYY',
    postsPerPage: 12,
    darkMode: true,
    maintenanceMode: false,
  },
  header: {
    layout: 1,
    sticky: true,
    showTopBar: true,
    showSearch: true,
    showBreakingNews: true,
    showWeather: true,
    showCurrency: true,
    ctaLabel: 'Abone Ol',
    ctaHref: '/abone-ol',
  },
  footer: {
    layout: 4,
    copyright: `© ${new Date().getFullYear()} KURUMSAL. Tüm hakları saklıdır.`,
    showSocialIcons: true,
    showNewsletter: true,
    accordionOnMobile: true,
    columns: [
      {
        id: 'about',
        title: 'Hakkımızda',
        type: 'text',
        content: "Yapay zeka destekli içerik üretimi, sosyal medya yönetimi ve yayıncılık platformu.",
        active: true,
      },
      {
        id: 'quicklinks',
        title: 'Hızlı Bağlantılar',
        type: 'links',
        content: '',
        links: [
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Makaleler', href: '/haberler' },
          { label: 'Ürünler & Hizmetler', href: '/urunler' },
          { label: 'Hakkımızda', href: '/hakkimizda' },
          { label: 'İletişim', href: '/iletisim' },
        ],
        active: true,
      },
      {
        id: 'categories',
        title: 'Kategoriler',
        type: 'links',
        content: '',
        links: [
          { label: 'Teknoloji', href: '/kategori/teknoloji' },
          { label: 'Ekonomi', href: '/kategori/ekonomi' },
          { label: 'Dünya', href: '/kategori/dunya' },
          { label: 'Spor', href: '/kategori/spor' },
          { label: 'Sağlık', href: '/kategori/saglik' },
          { label: 'Kültür', href: '/kategori/kultur' },
        ],
        active: true,
      },
      {
        id: 'newsletter',
        title: 'Bülten',
        type: 'newsletter',
        content: 'Günlük haber özetini e-posta adresinize alın.',
        active: true,
      },
    ],
  },
  colors: {
    primary: '#F59E0B',
    secondary: '#3B82F6',
    accent: '#10B981',
    background: '#0F172A',
    cardBg: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    borderColor: '#1E293B',
  },
  typography: {
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
    baseFontSize: 16,
    headingWeight: '700',
  },
  seo: {
    titleSeparator: '|',
    titleTemplate: '%s | KURUMSAL',
    defaultDescription: "Yapay zeka destekli içerik üretimi ve yayıncılık platformu.",
    ogImage: '/og-default.jpg',
    googleVerification: '',
    googleAnalyticsId: '',
    enableSitemap: true,
    enableRobots: true,
    schemaType: 'Organization',
    canonicalUrl: 'https://kurumsal.com.tr',
  },
  social: {
    twitter: 'https://twitter.com/kurumsal',
    facebook: 'https://facebook.com/kurumsal',
    instagram: 'https://instagram.com/kurumsal',
    linkedin: 'https://linkedin.com/company/kurumsal',
    youtube: 'https://youtube.com/@kurumsal',
    tiktok: 'https://tiktok.com/@kurumsal',
    pinterest: '',
    reddit: '',
    medium: '',
    showShareButtons: true,
    shareButtonPosition: 'bottom',
  },
  performance: {
    lazyLoadImages: true,
    minifyHtml: false,
    enableCdn: false,
    cdnUrl: '',
    cacheMaxAge: 3600,
  },
  ads: {
    zones: [
      { id: 'header-leaderboard', label: 'Header Leaderboard (728×90)', active: true, type: 'html', content: '', width: 728, height: 90 },
      { id: 'hero-below', label: 'Hero Altı (970×90)', active: true, type: 'html', content: '', width: 970, height: 90 },
      { id: 'content-mid-1', label: 'İçerik Arası 1 (300×250)', active: true, type: 'html', content: '', width: 300, height: 250 },
      { id: 'content-mid-2', label: 'İçerik Arası 2 (300×250)', active: false, type: 'html', content: '', width: 300, height: 250 },
      { id: 'sidebar-top', label: 'Sidebar Üst (300×250)', active: true, type: 'html', content: '', width: 300, height: 250 },
      { id: 'sidebar-mid', label: 'Sidebar Orta (300×250)', active: true, type: 'html', content: '', width: 300, height: 250 },
      { id: 'sidebar-bottom', label: 'Sidebar Alt (300×600)', active: false, type: 'html', content: '', width: 300, height: 600 },
      { id: 'footer-banner', label: 'Footer Banner (728×90)', active: true, type: 'html', content: '', width: 728, height: 90 },
      { id: 'mobile-top', label: 'Mobil Üst (320×50)', active: true, type: 'html', content: '', width: 320, height: 50 },
    ],
    adsenseClientId: '',
    globalAdsActive: true,
  },
  homepage: {
    sections: [
      { id: 'breaking', label: 'Son Dakika Ticker', active: true, order: 0 },
      { id: 'hero', label: 'Manşet Haber', active: true, order: 1 },
      { id: 'ad-hero-below', label: 'Reklam — Hero Altı', active: true, order: 2 },
      { id: 'stats', label: 'İstatistik Sayaçları', active: true, order: 3 },
      { id: 'news-categories', label: 'Kategorili Haber Blokları', active: true, order: 4 },
      { id: 'ad-content-mid', label: 'Reklam — İçerik Arası', active: true, order: 5 },
      { id: 'blog', label: 'Blog Gönderileri', active: true, order: 6 },
      { id: 'products', label: 'Ürün & Hizmetler', active: true, order: 7 },
      { id: 'code', label: 'Kod Örnekleri', active: false, order: 8 },
    ],
  },
  navigation: {
    headerMenu: [
      { id: 'home', label: 'Ana Sayfa', href: '/' },
      {
        id: 'platform',
        label: 'Platform',
        href: '#',
        megaColumns: [
          [
            { id: 'icerik', label: '📝 İçerik Yönetimi', href: '/uygulama' },
            { id: 'sosyal', label: '🌐 Sosyal Medya', href: '/uygulama/sosyal-hesaplar' },
            { id: 'video', label: '🎬 Video Üretimi', href: '/uygulama/video-olustur' },
          ],
          [
            { id: 'analitik', label: '📊 Analitik', href: '/uygulama/analitik' },
            { id: 'fiyat', label: '💳 Fiyatlandırma', href: '/fiyatlandirma' },
          ],
        ],
      },
      { id: 'blog', label: 'Blog', href: '/blog' },
      { id: 'urunler', label: 'Ürünler & Hizmetler', href: '/urunler' },
      { id: 'kod', label: 'Kod Örnekleri', href: '/kod-ornekleri' },
      { id: 'hakkimizda', label: 'Hakkımızda', href: '/hakkimizda' },
      { id: 'iletisim', label: 'İletişim', href: '/iletisim' },
    ],
    footerMenuPrimary: [
      { id: 'gizlilik', label: 'Gizlilik Politikası', href: '/gizlilik' },
      { id: 'kullanim', label: 'Kullanım Şartları', href: '/kullanim-sartlari' },
      { id: 'cerez', label: 'Çerez Politikası', href: '/cerez-politikasi' },
      { id: 'kvkk', label: 'KVKK', href: '/kvkk' },
    ],
    footerMenuSecondary: [
      { id: 'iletisim', label: 'İletişim', href: '/iletisim' },
      { id: 'reklam', label: 'Reklam Ver', href: '/reklam' },
      { id: 'yazilar', label: 'Yazarlık Başvurusu', href: '/yazarlik' },
      { id: 'rss', label: 'RSS', href: '/rss.xml' },
    ],
  },
};
