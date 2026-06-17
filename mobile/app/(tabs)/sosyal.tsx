import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSubscription } from "@/lib/hooks/useSubscription";

const PLATFORMS = [
  { id: "twitter", name: "X (Twitter)", icon: "🐦", color: "#1DA1F2", limit: { free: 1, starter: 2, pro: 5, enterprise: Infinity } },
  { id: "instagram", name: "Instagram", icon: "📸", color: "#E1306C", limit: { free: 1, starter: 2, pro: 5, enterprise: Infinity } },
  { id: "youtube", name: "YouTube", icon: "▶️", color: "#FF0000", limit: { free: 0, starter: 1, pro: 3, enterprise: Infinity } },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "#0A66C2", limit: { free: 0, starter: 1, pro: 3, enterprise: Infinity } },
  { id: "facebook", name: "Facebook", icon: "📘", color: "#1877F2", limit: { free: 0, starter: 1, pro: 3, enterprise: Infinity } },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "#FF0050", limit: { free: 0, starter: 1, pro: 3, enterprise: Infinity } },
  { id: "pinterest", name: "Pinterest", icon: "📌", color: "#E60023", limit: { free: 0, starter: 0, pro: 2, enterprise: Infinity } },
  { id: "telegram", name: "Telegram", icon: "✈️", color: "#2CA5E0", limit: { free: 0, starter: 1, pro: 3, enterprise: Infinity } },
  { id: "reddit", name: "Reddit", icon: "🤖", color: "#FF4500", limit: { free: 0, starter: 0, pro: 2, enterprise: Infinity } },
  { id: "medium", name: "Medium", icon: "✍️", color: "#00AB6C", limit: { free: 0, starter: 1, pro: 3, enterprise: Infinity } },
];

interface Account {
  id: string;
  platform: string;
  handle: string;
  autoPublish: boolean;
}

const MOCK_ACCOUNTS: Account[] = [
  { id: "1", platform: "twitter", handle: "@kurumsal_haber", autoPublish: true },
  { id: "2", platform: "instagram", handle: "kurumsal.haber", autoPublish: false },
];

export default function SosyalScreen() {
  const router = useRouter();
  const { currentPlan, isPro } = useSubscription();
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);

  const planKey = currentPlan as keyof typeof PLATFORMS[0]["limit"];

  const getLimit = (platform: typeof PLATFORMS[0]) => {
    return platform.limit[planKey] ?? 0;
  };

  const getConnectedCount = (platformId: string) =>
    accounts.filter((a) => a.platform === platformId).length;

  const toggleAutoPublish = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, autoPublish: !a.autoPublish } : a))
    );
  };

  const disconnectAccount = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return;
    const platform = PLATFORMS.find((p) => p.id === account.platform);
    Alert.alert(
      "Hesabı Kaldır",
      `${platform?.name} bağlantısını kesmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        { text: "Kaldır", style: "destructive", onPress: () => setAccounts((prev) => prev.filter((a) => a.id !== accountId)) },
      ]
    );
  };

  const handleConnect = (platform: typeof PLATFORMS[0]) => {
    const limit = getLimit(platform);
    const connected = getConnectedCount(platform.id);

    if (limit === 0) {
      Alert.alert(
        "Plan Gerekli",
        `${platform.name} hesabı eklemek için planınızı yükseltmeniz gerekiyor.`,
        [
          { text: "İptal", style: "cancel" },
          { text: "Planları Gör", onPress: () => router.push("/abonelik" as never) },
        ]
      );
      return;
    }

    if (connected >= limit) {
      Alert.alert(
        "Limit Doldu",
        `${platform.name} için maksimum ${limit} hesap bağlayabilirsiniz. Daha fazlası için planınızı yükseltin.`,
        [
          { text: "İptal", style: "cancel" },
          { text: "Yükselt", onPress: () => router.push("/abonelik" as never) },
        ]
      );
      return;
    }

    Alert.alert("Bağlan", `${platform.name} hesabınızla giriş yapın.`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Bağlan",
        onPress: () => {
          const newAccount: Account = {
            id: Date.now().toString(),
            platform: platform.id,
            handle: `@yeni_hesap_${platform.id}`,
            autoPublish: false,
          };
          setAccounts((prev) => [...prev, newAccount]);
        },
      },
    ]);
  };

  const connectedAccounts = accounts;
  const totalConnected = accounts.length;
  const totalAllowed = PLATFORMS.reduce((sum, p) => {
    const limit = getLimit(p);
    return sum + (limit === Infinity ? 999 : limit);
  }, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalConnected}</Text>
          <Text style={styles.summaryLabel}>Bağlı Hesap</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{PLATFORMS.filter((p) => getLimit(p) > 0).length}</Text>
          <Text style={styles.summaryLabel}>Erişilebilir Platform</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{connectedAccounts.filter((a) => a.autoPublish).length}</Text>
          <Text style={styles.summaryLabel}>Otomatik Yayın</Text>
        </View>
      </View>

      {/* Upgrade Banner (free users) */}
      {!isPro && (
        <TouchableOpacity style={styles.upgradeBanner} onPress={() => router.push("/abonelik" as never)}>
          <Text style={styles.upgradeBannerText}>⚡ Pro&apos;ya geç — 10 platforma kadar bağlan</Text>
          <Text style={styles.upgradeBannerCta}>Yükselt →</Text>
        </TouchableOpacity>
      )}

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bağlı Hesaplar</Text>
          {connectedAccounts.map((account) => {
            const platform = PLATFORMS.find((p) => p.id === account.platform);
            if (!platform) return null;
            return (
              <View key={account.id} style={styles.accountCard}>
                <View style={[styles.platformIcon, { backgroundColor: platform.color + "22" }]}>
                  <Text style={styles.platformEmoji}>{platform.icon}</Text>
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountPlatform}>{platform.name}</Text>
                  <Text style={styles.accountHandle}>{account.handle}</Text>
                </View>
                <View style={styles.accountActions}>
                  <Switch
                    value={account.autoPublish}
                    onValueChange={() => toggleAutoPublish(account.id)}
                    trackColor={{ false: "#374e6a", true: "#F59E0B44" }}
                    thumbColor={account.autoPublish ? "#F59E0B" : "#64748B"}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                  <TouchableOpacity
                    style={styles.disconnectBtn}
                    onPress={() => disconnectAccount(account.id)}
                  >
                    <Text style={styles.disconnectBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Platform List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Platform Ekle</Text>
        {PLATFORMS.map((platform) => {
          const limit = getLimit(platform);
          const connected = getConnectedCount(platform.id);
          const isLocked = limit === 0;
          const isFull = limit !== Infinity && connected >= limit;

          return (
            <TouchableOpacity
              key={platform.id}
              style={[styles.platformRow, isLocked && styles.platformRowLocked]}
              onPress={() => handleConnect(platform)}
            >
              <View style={[styles.platformIcon, { backgroundColor: platform.color + "22" }]}>
                <Text style={styles.platformEmoji}>{platform.icon}</Text>
              </View>
              <View style={styles.platformInfo}>
                <Text style={[styles.platformName, isLocked && styles.platformNameLocked]}>{platform.name}</Text>
                <Text style={styles.platformLimit}>
                  {isLocked
                    ? "Planınıza dahil değil"
                    : limit === Infinity
                    ? `${connected} bağlı • Sınırsız`
                    : `${connected}/${limit} bağlı`}
                </Text>
              </View>
              {isLocked ? (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockBadgeText}>🔒</Text>
                </View>
              ) : isFull ? (
                <View style={styles.fullBadge}>
                  <Text style={styles.fullBadgeText}>Dolu</Text>
                </View>
              ) : (
                <View style={[styles.connectBtn, { backgroundColor: platform.color }]}>
                  <Text style={styles.connectBtnText}>+ Ekle</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.note}>
        Otomatik yayın açıkken yeni içerikler ilgili platformlara otomatik olarak gönderilir.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  summaryCard: { flexDirection: "row", margin: 16, backgroundColor: "#1E293B", borderRadius: 16, padding: 16, justifyContent: "space-around" },
  summaryItem: { alignItems: "center", gap: 4 },
  summaryValue: { color: "white", fontSize: 22, fontWeight: "900" },
  summaryLabel: { color: "#64748B", fontSize: 10, fontWeight: "600", textAlign: "center" },
  summaryDivider: { width: 1, backgroundColor: "#374e6a" },
  upgradeBanner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 16, marginBottom: 8, backgroundColor: "#F59E0B11", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#F59E0B33" },
  upgradeBannerText: { color: "#F59E0B", fontSize: 12, fontWeight: "600", flex: 1 },
  upgradeBannerCta: { color: "#F59E0B", fontSize: 12, fontWeight: "700" },
  section: { marginTop: 8, marginHorizontal: 16 },
  sectionTitle: { color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", paddingVertical: 8 },
  accountCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E293B", borderRadius: 14, padding: 12, marginBottom: 8, gap: 10 },
  platformIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  platformEmoji: { fontSize: 18 },
  accountInfo: { flex: 1 },
  accountPlatform: { color: "white", fontSize: 13, fontWeight: "700" },
  accountHandle: { color: "#64748B", fontSize: 11, marginTop: 2 },
  accountActions: { flexDirection: "row", alignItems: "center", gap: 4 },
  disconnectBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#DC262622", alignItems: "center", justifyContent: "center" },
  disconnectBtnText: { color: "#EF4444", fontSize: 12 },
  platformRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E293B", borderRadius: 14, padding: 12, marginBottom: 8, gap: 10 },
  platformRowLocked: { opacity: 0.5 },
  platformInfo: { flex: 1 },
  platformName: { color: "white", fontSize: 14, fontWeight: "600" },
  platformNameLocked: { color: "#64748B" },
  platformLimit: { color: "#64748B", fontSize: 11, marginTop: 2 },
  lockBadge: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  lockBadgeText: { fontSize: 16 },
  fullBadge: { backgroundColor: "#374e6a", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  fullBadgeText: { color: "#64748B", fontSize: 11, fontWeight: "600" },
  connectBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  connectBtnText: { color: "white", fontSize: 11, fontWeight: "700" },
  note: { color: "#374e6a", fontSize: 10, textAlign: "center", paddingHorizontal: 24, lineHeight: 16, marginTop: 16 },
});
