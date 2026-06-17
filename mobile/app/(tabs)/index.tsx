import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { BannerAdComponent } from "@/components/ads/BannerAd";
import { useSubscription } from "@/lib/hooks/useSubscription";

const BREAKING = [
  "Merkez Bankası faiz kararını açıkladı: Politika faizi sabit tutuldu",
  "BIST 100 güçlü yükselişle 11.500 puanı aştı",
  "Yerli yapay zeka modeli 'TürkAI' kamuoyuyla paylaşıldı",
];

const NEWS = [
  { id: "1", title: "Türkiye'nin Dijital Dönüşüm Stratejisi 2030", category: "Teknoloji", time: "1 sa", image: "https://picsum.photos/400/250?random=10" },
  { id: "2", title: "Küresel Ekonomide Resesyon Endişeleri: IMF Büyüme Tahminleri", category: "Ekonomi", time: "3 sa", image: "https://picsum.photos/400/250?random=11" },
  { id: "3", title: "Süper Yapay Zeka Yarışı Kızışıyor: OpenAI ve Google", category: "Teknoloji", time: "5 sa", image: "https://picsum.photos/400/250?random=12" },
  { id: "4", title: "Galatasaray Şampiyonlar Ligi'nde Büyük Başarı", category: "Spor", time: "6 sa", image: "https://picsum.photos/400/250?random=13" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Teknoloji: "#1d4ed8", Ekonomi: "#065f46", Spor: "#991b1b",
  Sağlık: "#155e75", Kültür: "#78350f", Dünya: "#4c1d95",
};

export default function HomeScreen() {
  const router = useRouter();
  const { isPro } = useSubscription();
  const [breakingIdx, setBreakingIdx] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />}
    >
      {/* Breaking News */}
      <View style={styles.breaking}>
        <View style={styles.breakingBadge}>
          <View style={styles.breakingDot} />
          <Text style={styles.breakingBadgeText}>SON DAKİKA</Text>
        </View>
        <TouchableOpacity
          style={styles.breakingText}
          onPress={() => setBreakingIdx((i) => (i + 1) % BREAKING.length)}
        >
          <Text style={styles.breakingContent} numberOfLines={1}>{BREAKING[breakingIdx]}</Text>
        </TouchableOpacity>
      </View>

      {/* Banner Ad (free users only) */}
      {!isPro && <BannerAdComponent />}

      {/* Featured Hero */}
      <TouchableOpacity style={styles.hero} onPress={() => router.push(`/haber/${NEWS[0].id}`)}>
        <Image source={{ uri: NEWS[0].image }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay}>
          <View style={[styles.badge, { backgroundColor: CATEGORY_COLORS[NEWS[0].category] ?? "#374e6a" }]}>
            <Text style={styles.badgeText}>{NEWS[0].category}</Text>
          </View>
          <Text style={styles.heroTitle}>{NEWS[0].title}</Text>
          <Text style={styles.heroTime}>{NEWS[0].time} önce</Text>
        </View>
      </TouchableOpacity>

      {/* News Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Son Haberler</Text>
        <TouchableOpacity onPress={() => router.push("/haberler")}>
          <Text style={styles.sectionMore}>Tümü →</Text>
        </TouchableOpacity>
      </View>

      {NEWS.slice(1).map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.newsCard}
          onPress={() => router.push(`/haber/${item.id}`)}
        >
          <Image source={{ uri: item.image }} style={styles.newsThumb} resizeMode="cover" />
          <View style={styles.newsInfo}>
            <View style={[styles.badge, { backgroundColor: CATEGORY_COLORS[item.category] ?? "#374e6a" }]}>
              <Text style={styles.badgeText}>{item.category}</Text>
            </View>
            <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.newsTime}>{item.time} önce</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Pro Upsell Banner */}
      {!isPro && (
        <TouchableOpacity style={styles.proBanner} onPress={() => router.push("/abonelik")}>
          <Text style={styles.proBannerEmoji}>⚡</Text>
          <View style={styles.proBannerText}>
            <Text style={styles.proBannerTitle}>Reklamsız Deneyim</Text>
            <Text style={styles.proBannerSub}>Pro&apos;ya geç, reklamlardan kurtul</Text>
          </View>
          <Text style={styles.proBannerCta}>Dene →</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  content: { paddingBottom: 24 },
  breaking: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E293B", paddingHorizontal: 12, height: 40, gap: 8 },
  breakingBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#DC2626", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  breakingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "white" },
  breakingBadgeText: { color: "white", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  breakingText: { flex: 1 },
  breakingContent: { color: "#E2E8F0", fontSize: 12, fontWeight: "500" },
  hero: { margin: 12, borderRadius: 16, overflow: "hidden", height: 220 },
  heroImage: { width: "100%", height: "100%", position: "absolute" },
  heroOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 14, backgroundColor: "rgba(15,23,42,0.7)" },
  heroTitle: { color: "white", fontSize: 16, fontWeight: "700", lineHeight: 22, marginTop: 4 },
  heroTime: { color: "#94A3B8", fontSize: 11, marginTop: 4 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: "white", fontSize: 9, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 8 },
  sectionTitle: { color: "white", fontSize: 16, fontWeight: "800" },
  sectionMore: { color: "#F59E0B", fontSize: 13, fontWeight: "600" },
  newsCard: { flexDirection: "row", gap: 12, paddingHorizontal: 12, paddingVertical: 8 },
  newsThumb: { width: 90, height: 72, borderRadius: 10 },
  newsInfo: { flex: 1, gap: 4 },
  newsTitle: { color: "#E2E8F0", fontSize: 13, fontWeight: "600", lineHeight: 18 },
  newsTime: { color: "#64748B", fontSize: 11 },
  proBanner: { margin: 12, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#1E293B", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#F59E0B44" },
  proBannerEmoji: { fontSize: 24 },
  proBannerText: { flex: 1 },
  proBannerTitle: { color: "#F59E0B", fontSize: 14, fontWeight: "700" },
  proBannerSub: { color: "#94A3B8", fontSize: 12, marginTop: 2 },
  proBannerCta: { color: "#F59E0B", fontSize: 14, fontWeight: "700" },
});
