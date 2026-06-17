import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { BannerAdComponent } from "@/components/ads/BannerAd";
import { useSubscription } from "@/lib/hooks/useSubscription";

const CATEGORIES = ["Tümü", "Teknoloji", "Ekonomi", "Spor", "Sağlık", "Dünya", "Kültür"];

const NEWS = [
  { id: "1", title: "Türkiye'nin Dijital Dönüşüm Stratejisi 2030 açıklandı", category: "Teknoloji", time: "1 sa", image: "https://picsum.photos/400/250?random=10", summary: "Dijital ekonomide küresel rekabeti hedefleyen kapsamlı strateji belgesi kamuoyuyla paylaşıldı." },
  { id: "2", title: "Küresel Ekonomide Resesyon Endişeleri: IMF Büyüme Tahminleri", category: "Ekonomi", time: "3 sa", image: "https://picsum.photos/400/250?random=11", summary: "IMF, 2026 küresel büyüme tahminini %2.8'e düşürdü." },
  { id: "3", title: "Süper Yapay Zeka Yarışı Kızışıyor: OpenAI ve Google'ın son hamlesi", category: "Teknoloji", time: "5 sa", image: "https://picsum.photos/400/250?random=12", summary: "İki teknoloji devi arasındaki yapay zeka rekabeti yeni bir boyut kazandı." },
  { id: "4", title: "Galatasaray Şampiyonlar Ligi'nde Büyük Başarı", category: "Spor", time: "6 sa", image: "https://picsum.photos/400/250?random=13", summary: "Sarı-kırmızılılar grup aşamasını lider tamamladı." },
  { id: "5", title: "Sağlıkta Yapay Zeka Devrimi: Kanser Tespitinde %95 Başarı", category: "Sağlık", time: "8 sa", image: "https://picsum.photos/400/250?random=14", summary: "Yeni AI sistemi erken evre kanseri insanlardan çok daha yüksek doğrulukla tespit ediyor." },
  { id: "6", title: "Avrupa'da Yeni Göç Krizi: Siyasi Dengeler Değişiyor", category: "Dünya", time: "10 sa", image: "https://picsum.photos/400/250?random=15", summary: "AB ülkeleri göç politikalarını yeniden masaya yatırıyor." },
  { id: "7", title: "İstanbul Bienali 2026: Dünyadan Sanatçılar Geliyor", category: "Kültür", time: "12 sa", image: "https://picsum.photos/400/250?random=16", summary: "Bu yılki tema 'Sınırlar ve Köprüler' olarak belirlendi." },
  { id: "8", title: "Elektrikli Araç Satışları Benzinliyi Geçti", category: "Teknoloji", time: "14 sa", image: "https://picsum.photos/400/250?random=17", summary: "Türkiye'de ilk kez aylık elektrikli araç satışları içten yanmalı motorları geçti." },
  { id: "9", title: "Borsa İstanbul Tüm Zamanların En Yüksek Seviyesinde", category: "Ekonomi", time: "16 sa", image: "https://picsum.photos/400/250?random=18", summary: "BIST 100 endeksi günü rekor kapanışla tamamladı." },
];

const CATEGORY_COLORS: Record<string, string> = {
  Teknoloji: "#1d4ed8", Ekonomi: "#065f46", Spor: "#991b1b",
  Sağlık: "#155e75", Kültür: "#78350f", Dünya: "#4c1d95",
};

export default function HaberlerScreen() {
  const router = useRouter();
  const { isPro } = useSubscription();
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [search, setSearch] = useState("");

  const filtered = NEWS.filter((n) => {
    const matchCat = activeCategory === "Tümü" || n.category === activeCategory;
    const matchSearch = search === "" || n.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Haber ara..."
          placeholderTextColor="#64748B"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.catBtnText, activeCategory === cat && styles.catBtnTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {!isPro && <BannerAdComponent />}

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
          </View>
        ) : (
          filtered.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.newsCard}
                onPress={() => router.push(`/haber/${item.id}` as never)}
              >
                <Image source={{ uri: item.image }} style={styles.newsImage} resizeMode="cover" />
                <View style={styles.newsContent}>
                  <View style={[styles.badge, { backgroundColor: CATEGORY_COLORS[item.category] ?? "#374e6a" }]}>
                    <Text style={styles.badgeText}>{item.category}</Text>
                  </View>
                  <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.newsSummary} numberOfLines={1}>{item.summary}</Text>
                  <Text style={styles.newsTime}>{item.time} önce</Text>
                </View>
              </TouchableOpacity>
              {/* Ad every 4 items for free users */}
              {!isPro && (index + 1) % 4 === 0 && <BannerAdComponent />}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E293B", margin: 12, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, color: "white", fontSize: 14 },
  clearBtn: { color: "#64748B", fontSize: 16, paddingHorizontal: 4 },
  categoriesScroll: { maxHeight: 48 },
  categoriesContent: { paddingHorizontal: 12, gap: 8, alignItems: "center" },
  catBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#374e6a" },
  catBtnActive: { backgroundColor: "#1d4ed8", borderColor: "#1d4ed8" },
  catBtnText: { color: "#64748B", fontSize: 13, fontWeight: "600" },
  catBtnTextActive: { color: "white" },
  newsCard: { flexDirection: "row", gap: 12, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1E293B" },
  newsImage: { width: 96, height: 76, borderRadius: 10 },
  newsContent: { flex: 1, gap: 4 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: "white", fontSize: 9, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  newsTitle: { color: "#E2E8F0", fontSize: 13, fontWeight: "600", lineHeight: 18 },
  newsSummary: { color: "#64748B", fontSize: 11, lineHeight: 16 },
  newsTime: { color: "#64748B", fontSize: 11 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: "#64748B", fontSize: 16 },
});
