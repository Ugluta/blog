import mobileAds, {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const isDev = __DEV__;

export const AD_UNITS = {
  BANNER: isDev
    ? TestIds.BANNER
    : (process.env.EXPO_PUBLIC_ADMOB_BANNER_ID ?? TestIds.BANNER),
  INTERSTITIAL: isDev
    ? TestIds.INTERSTITIAL
    : (process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID ?? TestIds.INTERSTITIAL),
  REWARDED: isDev
    ? TestIds.REWARDED
    : (process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID ?? TestIds.REWARDED),
};

export { BannerAdSize };

export async function initAdMob(): Promise<void> {
  try {
    await mobileAds().initialize();
  } catch (err) {
    console.error("[AdMob] init error:", err);
  }
}

export function showInterstitialAd(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const interstitial = InterstitialAd.createForAdRequest(AD_UNITS.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: false,
      });

      const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        unsubscribeClosed();
        resolve();
      });

      const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
        unsubscribeError();
        resolve();
      });

      interstitial.addAdEventListener(AdEventType.LOADED, () => {
        interstitial.show();
      });

      interstitial.load();
    } catch {
      resolve();
    }
  });
}

export function showRewardedAd(): Promise<{ earned: boolean; amount?: number }> {
  return new Promise((resolve) => {
    try {
      const rewarded = RewardedAd.createForAdRequest(AD_UNITS.REWARDED, {
        requestNonPersonalizedAdsOnly: false,
      });

      const unsubscribeClosed = rewarded.addAdEventListener(RewardedAdEventType.USER_EARNED_REWARD, (reward) => {
        unsubscribeClosed();
        resolve({ earned: true, amount: reward.amount });
      });

      rewarded.addAdEventListener(AdEventType.CLOSED as never, () => {
        resolve({ earned: false });
      });

      rewarded.addAdEventListener(AdEventType.ERROR as never, () => {
        resolve({ earned: false });
      });

      rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        rewarded.show();
      });

      rewarded.load();
    } catch {
      resolve({ earned: false });
    }
  });
}
