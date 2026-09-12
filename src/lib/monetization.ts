// Monetization configuration types and constants

// ─── AD NETWORKS ─────────────────────────────────────────────────────────────

export interface AdMobConfig {
  appIdAndroid: string;         // ca-app-pub-XXXXXXXX~XXXXXXXX
  appIdIos: string;             // ca-app-pub-XXXXXXXX~XXXXXXXX
  testMode: boolean;
  units: {
    bannerAndroid: string;      // ca-app-pub-XXXXXXXX/XXXXXXXX
    bannerIos: string;
    interstitialAndroid: string;
    interstitialIos: string;
    rewardedAndroid: string;
    rewardedIos: string;
    nativeAndroid: string;
    nativeIos: string;
  };
  // Frequency capping
  interstitialFrequency: number;  // Show every N actions
  rewardedFrequency: number;
}

export interface AdSenseConfig {
  clientId: string;             // ca-pub-XXXXXXXXXXXXXXXX
  autoAds: boolean;
  zones: Record<string, {
    slotId: string;
    format: "auto" | "rectangle" | "vertical" | "horizontal";
    responsive: boolean;
  }>;
}

export interface DirectAdConfig {
  enabled: boolean;
  contactEmail: string;
  minCPM: number;               // Minimum ₺ per 1000 impressions
}

// ─── IN-APP PURCHASES ─────────────────────────────────────────────────────────

export interface RevenueCatConfig {
  apiKeyAndroid: string;        // goog_XXXX
  apiKeyIos: string;            // appl_XXXX
  webhookSecret: string;
  entitlements: {
    pro: string;                // "pro_access"
    starter: string;            // "starter_access"
    enterprise: string;         // "enterprise_access"
  };
}

export interface StoreProduct {
  id: string;
  revenueCatId: string;
  platform: "ios" | "android" | "both";
  type: "subscription" | "consumable" | "non_consumable";
  // iOS App Store
  appStoreProductId?: string;   // com.yourapp.starter_monthly
  // Google Play
  playStoreProductId?: string;  // starter_monthly
  packageSlug: string;          // links to Package in DB
  billingPeriod: "monthly" | "yearly" | "lifetime";
  priceTRY: number;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "starter_monthly",
    revenueCatId: "starter_monthly",
    platform: "both",
    type: "subscription",
    appStoreProductId: "com.kurumsal.app.starter_monthly",
    playStoreProductId: "starter_monthly",
    packageSlug: "starter",
    billingPeriod: "monthly",
    priceTRY: 99,
  },
  {
    id: "starter_yearly",
    revenueCatId: "starter_yearly",
    platform: "both",
    type: "subscription",
    appStoreProductId: "com.kurumsal.app.starter_yearly",
    playStoreProductId: "starter_yearly",
    packageSlug: "starter",
    billingPeriod: "yearly",
    priceTRY: 890,
  },
  {
    id: "pro_monthly",
    revenueCatId: "pro_monthly",
    platform: "both",
    type: "subscription",
    appStoreProductId: "com.kurumsal.app.pro_monthly",
    playStoreProductId: "pro_monthly",
    packageSlug: "pro",
    billingPeriod: "monthly",
    priceTRY: 299,
  },
  {
    id: "pro_yearly",
    revenueCatId: "pro_yearly",
    platform: "both",
    type: "subscription",
    appStoreProductId: "com.kurumsal.app.pro_yearly",
    playStoreProductId: "pro_yearly",
    packageSlug: "pro",
    billingPeriod: "yearly",
    priceTRY: 2690,
  },
  {
    id: "enterprise_monthly",
    revenueCatId: "enterprise_monthly",
    platform: "both",
    type: "subscription",
    appStoreProductId: "com.kurumsal.app.enterprise_monthly",
    playStoreProductId: "enterprise_monthly",
    packageSlug: "enterprise",
    billingPeriod: "monthly",
    priceTRY: 999,
  },
  {
    id: "extra_videos_10",
    revenueCatId: "extra_videos_10",
    platform: "both",
    type: "consumable",
    appStoreProductId: "com.kurumsal.app.extra_videos_10",
    playStoreProductId: "extra_videos_10",
    packageSlug: "free",
    billingPeriod: "monthly",
    priceTRY: 29,
  },
];

// ─── REWARDED ADS REWARDS ─────────────────────────────────────────────────────

export type RewardType = "extra_video" | "extra_storage_mb" | "remove_watermark_temp";

export interface RewardConfig {
  type: RewardType;
  amount: number;
  label: string;
  icon: string;
}

export const REWARDED_AD_REWARDS: RewardConfig[] = [
  { type: "extra_video", amount: 1, label: "1 Ekstra Video Oluştur", icon: "🎬" },
  { type: "extra_storage_mb", amount: 100, label: "100 MB Ekstra Depolama", icon: "💾" },
  { type: "remove_watermark_temp", amount: 1, label: "24 Saatlik Filigransız", icon: "✨" },
];

// ─── REVENUE ANALYTICS ────────────────────────────────────────────────────────

export interface RevenueMetrics {
  mrr: number;           // Monthly Recurring Revenue ₺
  arppu: number;         // Average Revenue Per Paying User
  conversionRate: number; // Free → Paid %
  churnRate: number;     // Monthly churn %
  ltv: number;           // Lifetime Value estimate
  adRevenue: {
    adsense: number;
    admob: number;
    direct: number;
    total: number;
  };
}
