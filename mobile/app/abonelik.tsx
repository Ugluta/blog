import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { purchasePackage, restorePurchases } from "@/lib/revenuecat";
import { useSubscription } from "@/lib/hooks/useSubscription";

const PLANS = [
  {
    id: "free",
    name: "Ücretsiz",
    monthlyPrice: 0,
    features: ["3 video/ay", "500 MB depolama", "1 sosyal hesap", "Reklamlı deneyim"],
    limits: ["Sınırlı video", "Filigranlar", "Reklamlar"],
    color: "#374e6a",
    accent: "#94A3B8",
  },
  {
    id: "starter",
    name: "Başlangıç",
    monthlyPrice: 99,
    yearlyPrice: 890,
    revenueCatId: "starter_monthly",
    revenueCatYearlyId: "starter_yearly",
    features: ["10 video/ay", "5 GB depolama", "3 sosyal hesap", "Reklamsız", "720p çıktı"],
    color: "#1d4ed8",
    accent: "#60A5FA",
    badge: "Popüler",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 299,
    yearlyPrice: 2690,
    revenueCatId: "pro_monthly",
    revenueCatYearlyId: "pro_yearly",
    features: ["Sınırsız video", "50 GB depolama", "10 sosyal hesap", "Reklamsız", "1080p çıktı", "Öncelikli destek"],
    color: "#F59E0B",
    accent: "#FCD34D",
    badge: "Çok Satan",
  },
  {
    id: "enterprise",
    name: "Kurumsal",
    monthlyPrice: 999,
    revenueCatId: "enterprise_monthly",
    features: ["Sınırsız her şey", "500 GB depolama", "Sınırsız hesap", "API erişimi", "Özel marka", "Dedike destek"],
    color: "#8B5CF6",
    accent: "#C4B5FD",
  },
];

export default function AbonelikScreen() {
  const router = useRouter();
  const { currentPlan, isPro } = useSubscription();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (plan: typeof PLANS[0]) => {
    if (plan.id === "free") return;
    const productId = billing === "yearly" && plan.revenueCatYearlyId
      ? plan.revenueCatYearlyId
      : plan.revenueCatId;
    if (!productId) return;

    setLoading(plan.id);
    try {
      await purchasePackage(productId);
      Alert.alert("Teşekkürler!", "Aboneliğiniz aktif edildi. Hoş geldiniz!", [
        { text: "Tamam", onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Satın alma işlemi iptal edildi.";
      if (!message.includes("cancel")) {
        Alert.alert("Hata", message);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleRestore = async () => {
    setLoading("restore");
    try {
      await restorePurchases();
      Alert.alert("Başarılı", "Satın alımlarınız geri yüklendi.");
    } catch {
      Alert.alert("Hata", "Geri yükleme sırasında bir hata oluştu.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Premium&apos;a Geç</Text>
        <Text style={styles.headerSub}>İçerik oluşturmayı bir üst seviyeye taşıyın</Text>
        {/* Billing Toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.billingBtn, billing === "monthly" && styles.billingBtnActive]}
            onPress={() => setBilling("monthly")}
          >
            <Text style={[styles.billingBtnText, billing === "monthly" && styles.billingBtnTextActive]}>Aylık</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.billingBtn, billing === "yearly" && styles.billingBtnActive]}
            onPress={() => setBilling("yearly")}
          >
            <Text style={[styles.billingBtnText, billing === "yearly" && styles.billingBtnTextActive]}>Yıllık</Text>
            <View style={styles.saveBadge}><Text style={styles.saveBadgeText}>%25 İndirim</Text></View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Plan Cards */}
      <View style={styles.plans}>
        {PLANS.map((plan) => {
          const isCurrent = currentPlan.toLowerCase() === plan.id;
          const price = billing === "yearly" && plan.yearlyPrice ? plan.yearlyPrice : plan.monthlyPrice;
          const isLoading = loading === plan.id;

          return (
            <View key={plan.id} style={[styles.planCard, isCurrent && styles.planCardCurrent, { borderColor: plan.color + "66" }]}>
              {plan.badge && (
                <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.planBadgeText}>{plan.badge}</Text>
                </View>
              )}
              {isCurrent && (
                <View style={[styles.planBadge, { backgroundColor: "#10B981" }]}>
                  <Text style={styles.planBadgeText}>Mevcut Plan</Text>
                </View>
              )}

              <Text style={[styles.planName, { color: plan.accent }]}>{plan.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.currency}>₺</Text>
                <Text style={[styles.price, { color: plan.accent }]}>
                  {billing === "yearly" && plan.yearlyPrice
                    ? Math.round(plan.yearlyPrice / 12)
                    : plan.monthlyPrice}
                </Text>
                <Text style={styles.pricePeriod}>/ay</Text>
              </View>
              {billing === "yearly" && plan.yearlyPrice && (
                <Text style={styles.yearlyNote}>₺{plan.yearlyPrice} / yıl olarak faturalandırılır</Text>
              )}

              <View style={styles.features}>
                {plan.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Text style={[styles.featureCheck, { color: plan.accent }]}>✓</Text>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
                {plan.limits?.map((l) => (
                  <View key={l} style={styles.featureRow}>
                    <Text style={styles.featureCross}>✕</Text>
                    <Text style={styles.featureTextMuted}>{l}</Text>
                  </View>
                ))}
              </View>

              {plan.id !== "free" && !isCurrent && (
                <TouchableOpacity
                  style={[styles.buyBtn, { backgroundColor: plan.color }, isLoading && styles.buyBtnDisabled]}
                  disabled={isLoading}
                  onPress={() => handlePurchase(plan)}
                >
                  <Text style={styles.buyBtnText}>
                    {isLoading ? "İşleniyor..." : `${plan.name} Planı Seç`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {/* Restore */}
      <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore} disabled={loading === "restore"}>
        <Text style={styles.restoreBtnText}>
          {loading === "restore" ? "Yükleniyor..." : "Satın Alımları Geri Yükle"}
        </Text>
      </TouchableOpacity>

      {/* Legal */}
      <Text style={styles.legal}>
        Abonelikler, mevcut dönemin bitiminden en az 24 saat önce iptal edilmezse otomatik olarak yenilenir.
        Abonelikler iTunes Hesabınızdan yönetilebilir.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  header: { alignItems: "center", padding: 24, paddingBottom: 8 },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "900" },
  headerSub: { color: "#94A3B8", fontSize: 14, marginTop: 4, marginBottom: 20 },
  billingToggle: { flexDirection: "row", backgroundColor: "#1E293B", borderRadius: 12, padding: 4 },
  billingBtn: { flex: 1, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  billingBtnActive: { backgroundColor: "#374e6a" },
  billingBtnText: { color: "#64748B", fontSize: 14, fontWeight: "600" },
  billingBtnTextActive: { color: "white" },
  saveBadge: { backgroundColor: "#10B981", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  saveBadgeText: { color: "white", fontSize: 10, fontWeight: "800" },
  plans: { padding: 12, gap: 12 },
  planCard: { backgroundColor: "#1E293B", borderRadius: 20, padding: 20, borderWidth: 2, borderColor: "#374e6a", position: "relative" },
  planCardCurrent: { borderColor: "#10B98166" },
  planBadge: { position: "absolute", top: -10, right: 16, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  planBadgeText: { color: "white", fontSize: 11, fontWeight: "800" },
  planName: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  priceRow: { flexDirection: "row", alignItems: "flex-end", gap: 2, marginBottom: 4 },
  currency: { color: "#94A3B8", fontSize: 16, marginBottom: 4 },
  price: { fontSize: 40, fontWeight: "900", lineHeight: 44 },
  pricePeriod: { color: "#64748B", fontSize: 14, marginBottom: 6 },
  yearlyNote: { color: "#64748B", fontSize: 11, marginBottom: 12 },
  features: { gap: 8, marginVertical: 12 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureCheck: { fontSize: 14, fontWeight: "700", width: 18 },
  featureCross: { color: "#64748B", fontSize: 14, width: 18 },
  featureText: { color: "#E2E8F0", fontSize: 13 },
  featureTextMuted: { color: "#64748B", fontSize: 13 },
  buyBtn: { marginTop: 8, paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  buyBtnDisabled: { opacity: 0.6 },
  buyBtnText: { color: "#0F172A", fontSize: 15, fontWeight: "800" },
  restoreBtn: { marginHorizontal: 16, marginTop: 8, paddingVertical: 12, alignItems: "center" },
  restoreBtnText: { color: "#64748B", fontSize: 13, fontWeight: "600" },
  legal: { color: "#374e6a", fontSize: 10, textAlign: "center", paddingHorizontal: 24, lineHeight: 16, marginTop: 8 },
});
