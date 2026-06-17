import { useEffect, useState } from "react";
import { getCustomerInfo, hasEntitlement, ENTITLEMENTS } from "@/lib/revenuecat";

export type PlanId = "free" | "starter" | "pro" | "enterprise";

interface SubscriptionState {
  currentPlan: PlanId;
  isPro: boolean;
  isStarter: boolean;
  isEnterprise: boolean;
  videoQuota: number;
  usedVideos: number;
  remaining: number;
  expiresAt: string | null;
  loading: boolean;
}

const QUOTA_BY_PLAN: Record<PlanId, number> = {
  free: 3,
  starter: 10,
  pro: Infinity,
  enterprise: Infinity,
};

export function useSubscription(): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({
    currentPlan: "free",
    isPro: false,
    isStarter: false,
    isEnterprise: false,
    videoQuota: 3,
    usedVideos: 0,
    remaining: 3,
    expiresAt: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchSubscription() {
      try {
        const [isEnterprise, isPro, isStarter, info] = await Promise.all([
          hasEntitlement(ENTITLEMENTS.ENTERPRISE),
          hasEntitlement(ENTITLEMENTS.PRO),
          hasEntitlement(ENTITLEMENTS.STARTER),
          getCustomerInfo(),
        ]);

        if (!mounted) return;

        const currentPlan: PlanId = isEnterprise
          ? "enterprise"
          : isPro
          ? "pro"
          : isStarter
          ? "starter"
          : "free";

        const videoQuota = QUOTA_BY_PLAN[currentPlan];
        const usedVideos = 0; // TODO: fetch from backend usage API

        let expiresAt: string | null = null;
        if (info && currentPlan !== "free") {
          const entitlementId =
            currentPlan === "enterprise"
              ? ENTITLEMENTS.ENTERPRISE
              : currentPlan === "pro"
              ? ENTITLEMENTS.PRO
              : ENTITLEMENTS.STARTER;
          const entitlement = info.entitlements.active[entitlementId];
          if (entitlement?.expirationDate) {
            expiresAt = new Date(entitlement.expirationDate).toLocaleDateString("tr-TR");
          }
        }

        setState({
          currentPlan,
          isPro: isPro || isEnterprise,
          isStarter,
          isEnterprise,
          videoQuota,
          usedVideos,
          remaining: videoQuota === Infinity ? Infinity : Math.max(0, videoQuota - usedVideos),
          expiresAt,
          loading: false,
        });
      } catch {
        if (mounted) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    fetchSubscription();
    return () => { mounted = false; };
  }, []);

  return state;
}
