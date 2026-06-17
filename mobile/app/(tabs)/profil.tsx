import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSubscription } from "@/lib/hooks/useSubscription";

const MENU_ITEMS = [
  { section: "Hesap", items: [
    { icon: "👤", label: "Profil Bilgileri", href: "/profil/bilgiler" },
    { icon: "🔔", label: "Bildirim Ayarları", href: "/profil/bildirimler" },
    { icon: "🔒", label: "Güvenlik", href: "/profil/guvenlik" },
  ]},
  { section: "Uygulama", items: [
    { icon: "🌐", label: "Dil", href: "/profil/dil" },
    { icon: "🎨", label: "Tema", href: "/profil/tema" },
    { icon: "⚡", label: "Abonelik", href: "/abonelik" },
  ]},
  { section: "Destek", items: [
    { icon: "❓", label: "Yardım & SSS", href: "/profil/yardim" },
    { icon: "📧", label: "İletişim", href: "/profil/iletisim" },
    { icon: "⭐", label: "Uygulamayı Puanla", href: null },
    { icon: "📤", label: "Arkadaşlarla Paylaş", href: null },
  ]},
  { section: "Yasal", items: [
    { icon: "📄", label: "Gizlilik Politikası", href: "/profil/gizlilik" },
    { icon: "📋", label: "Kullanım Şartları", href: "/profil/sartlar" },
    { icon: "🍪", label: "Çerez Politikası", href: "/profil/cerez" },
  ]},
];

export default function ProfilScreen() {
  const router = useRouter();
  const { isPro, currentPlan, expiresAt } = useSubscription();

  const handleLogout = () => {
    Alert.alert("Çıkış Yap", "Hesabınızdan çıkmak istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Çıkış Yap", style: "destructive", onPress: () => router.replace("/giris") },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>K</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Kullanıcı Adı</Text>
          <Text style={styles.profileEmail}>kullanici@email.com</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/profil/bilgiler" as never)} style={styles.editBtn}>
          <Text style={styles.editBtnText}>Düzenle</Text>
        </TouchableOpacity>
      </View>

      {/* Subscription Badge */}
      <TouchableOpacity style={[styles.subBadge, isPro && styles.subBadgePro]} onPress={() => router.push("/abonelik")}>
        <Text style={styles.subBadgeIcon}>{isPro ? "⚡" : "🔓"}</Text>
        <View style={styles.subBadgeInfo}>
          <Text style={styles.subBadgeTitle}>{currentPlan} Plan</Text>
          {isPro && expiresAt && (
            <Text style={styles.subBadgeSub}>Yenileme: {expiresAt}</Text>
          )}
          {!isPro && (
            <Text style={styles.subBadgeSub}>Daha fazla özellik için yükselt →</Text>
          )}
        </View>
        {!isPro && (
          <View style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>PRO</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Menu Sections */}
      {MENU_ITEMS.map((section) => (
        <View key={section.section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, idx < section.items.length - 1 && styles.menuItemBorder]}
                onPress={() => {
                  if (item.href) router.push(item.href as never);
                  else if (item.label === "Uygulamayı Puanla") Alert.alert("Teşekkürler!", "App Store'a yönlendiriliyorsunuz...");
                }}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Kurumsal v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 12, margin: 16, backgroundColor: "#1E293B", borderRadius: 16, padding: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#F59E0B33", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#F59E0B44" },
  avatarText: { color: "#F59E0B", fontSize: 22, fontWeight: "900" },
  profileInfo: { flex: 1 },
  profileName: { color: "white", fontSize: 16, fontWeight: "700" },
  profileEmail: { color: "#64748B", fontSize: 12, marginTop: 2 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#374e6a" },
  editBtnText: { color: "#94A3B8", fontSize: 12, fontWeight: "600" },
  subBadge: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 16, marginBottom: 8, backgroundColor: "#1E293B", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#374e6a" },
  subBadgePro: { borderColor: "#F59E0B44", backgroundColor: "#F59E0B0A" },
  subBadgeIcon: { fontSize: 24 },
  subBadgeInfo: { flex: 1 },
  subBadgeTitle: { color: "white", fontSize: 14, fontWeight: "700" },
  subBadgeSub: { color: "#64748B", fontSize: 12, marginTop: 2 },
  upgradeBtn: { backgroundColor: "#F59E0B", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  upgradeBtnText: { color: "#0F172A", fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  section: { marginTop: 8 },
  sectionTitle: { color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", paddingHorizontal: 16, paddingVertical: 8 },
  sectionCard: { marginHorizontal: 16, backgroundColor: "#1E293B", borderRadius: 14, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "#2d3f55" },
  menuIcon: { fontSize: 18, width: 24, textAlign: "center" },
  menuLabel: { flex: 1, color: "#E2E8F0", fontSize: 14, fontWeight: "500" },
  menuChevron: { color: "#64748B", fontSize: 20 },
  logoutBtn: { margin: 16, marginTop: 24, padding: 14, borderRadius: 14, backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#DC262633", alignItems: "center" },
  logoutText: { color: "#EF4444", fontSize: 14, fontWeight: "700" },
  version: { textAlign: "center", color: "#374e6a", fontSize: 11, marginBottom: 8 },
});
