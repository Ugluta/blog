import Purchases, {
  type PurchasesOffering,
  type CustomerInfo,
  LOG_LEVEL,
} from "react-native-purchases";
import { Platform } from "react-native";

const RC_API_KEY_IOS = process.env.EXPO_PUBLIC_RC_API_KEY_IOS ?? "";
const RC_API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_API_KEY_ANDROID ?? "";

export async function initRevenueCat(): Promise<void> {
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }
    const apiKey = Platform.OS === "ios" ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
    if (!apiKey) {
      console.warn("[RevenueCat] API key not set — skipping init");
      return;
    }
    Purchases.configure({ apiKey });
  } catch (err) {
    console.error("[RevenueCat] init error:", err);
  }
}

export async function identifyUser(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
  } catch (err) {
    console.error("[RevenueCat] logIn error:", err);
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await Purchases.logOut();
  } catch (err) {
    console.error("[RevenueCat] logOut error:", err);
  }
}

export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (err) {
    console.error("[RevenueCat] getOfferings error:", err);
    return null;
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch (err) {
    console.error("[RevenueCat] getCustomerInfo error:", err);
    return null;
  }
}

export async function purchasePackage(productId: string): Promise<CustomerInfo> {
  const offerings = await Purchases.getOfferings();
  const allPackages = Object.values(offerings.all).flatMap((o) => o.availablePackages);
  const pkg = allPackages.find((p) => p.product.identifier === productId);
  if (!pkg) throw new Error(`Paket bulunamadı: ${productId}`);
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

export async function hasEntitlement(entitlementId: string): Promise<boolean> {
  try {
    const info = await getCustomerInfo();
    if (!info) return false;
    return entitlementId in info.entitlements.active;
  } catch {
    return false;
  }
}

// Entitlement IDs matching RevenueCat dashboard config
export const ENTITLEMENTS = {
  PRO: "pro_access",
  STARTER: "starter_access",
  ENTERPRISE: "enterprise_access",
} as const;
