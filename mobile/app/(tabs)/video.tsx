import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { showInterstitialAd } from "@/lib/admob";

type AspectRatio = "9:16" | "1:1" | "16:9" | "4:5";
type Step = 1 | 2 | 3 | 4;

const RATIO_OPTIONS: { value: AspectRatio; label: string; icon: string; desc: string }[] = [
  { value: "9:16", label: "Dikey", icon: "📱", desc: "TikTok, Reels, Shorts" },
  { value: "1:1", label: "Kare", icon: "⬜", desc: "Instagram Feed" },
  { value: "16:9", label: "Yatay", icon: "🖥️", desc: "YouTube, Twitter" },
  { value: "4:5", label: "4:5", icon: "📷", desc: "Instagram Optimum" },
];

const PLATFORMS = [
  { id: "tiktok", label: "TikTok", icon: "♪" },
  { id: "instagram", label: "Instagram", icon: "📷" },
  { id: "youtube", label: "YouTube Shorts", icon: "▶️" },
  { id: "twitter", label: "Twitter/X", icon: "𝕏" },
  { id: "facebook", label: "Facebook", icon: "f" },
  { id: "linkedin", label: "LinkedIn", icon: "in" },
];

export default function VideoScreen() {
  const router = useRouter();
  const { isPro, videoQuota, usedVideos } = useSubscription();
  const [step, setStep] = useState<Step>(1);
  const [title, setTitle] = useState("");
  const [ratio, setRatio] = useState<AspectRatio>("9:16");
  const [scenes, setScenes] = useState<string[]>(["", "", ""]);
  const [hasMusicUri, setHasMusicUri] = useState(false);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("#kurumsal #haber");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["tiktok", "instagram"]);
  const [rendering, setRendering] = useState(false);

  const remaining = videoQuota - usedVideos;

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (remaining <= 0 && !isPro) {
      Alert.alert(
        "Kota Doldu",
        "Bu ay oluşturabilecek video sayısına ulaştınız. Pro plana geçerek sınırsız video oluşturabilirsiniz.",
        [
          { text: "İptal", style: "cancel" },
          { text: "Pro'ya Geç", onPress: () => router.push("/abonelik") },
        ]
      );
      return;
    }
    setRendering(true);
    // Show interstitial to free users during rendering
    if (!isPro) await showInterstitialAd();
    await new Promise((r) => setTimeout(r, 3000));
    setRendering(false);
    setStep(4);
  };

  if (step === 4) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center", padding: 24 }]}>
        <Text style={{ fontSize: 64 }}>🎬</Text>
        <Text style={styles.successTitle}>Video Hazır!</Text>
        <Text style={styles.successSub}>
          {selectedPlatforms.length} platforma paylaşılmak üzere kuyruğa alındı.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => { setStep(1); setTitle(""); setCaption(""); }}>
          <Text style={styles.primaryBtnText}>Yeni Video Oluştur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/publisher" as never)}>
          <Text style={styles.secondaryBtnText}>Yayın Kuyruğuna Git</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Step Bar */}
      <View style={styles.stepBar}>
        {([1, 2, 3] as const).map((s) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
              <Text style={[styles.stepNum, step >= s && styles.stepNumActive]}>{s}</Text>
            </View>
            <Text style={[styles.stepLabel, step >= s && styles.stepLabelActive]}>
              {s === 1 ? "Temel" : s === 2 ? "Sahneler" : "Yayın"}
            </Text>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      {/* Quota Warning */}
      {!isPro && remaining <= 1 && (
        <TouchableOpacity style={styles.quotaBanner} onPress={() => router.push("/abonelik")}>
          <Text style={styles.quotaBannerText}>
            {remaining === 0 ? "⚠️ Video kotanız doldu!" : `⚠️ ${remaining} video hakkınız kaldı`}
            {" "}Pro'ya geç →
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Video Başlığı & Format</Text>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Başlık</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Videonun başlığını girin..."
                placeholderTextColor="#64748B"
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>En-Boy Oranı</Text>
              <View style={styles.ratioGrid}>
                {RATIO_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.ratioCard, ratio === opt.value && styles.ratioCardActive]}
                    onPress={() => setRatio(opt.value)}
                  >
                    <Text style={styles.ratioIcon}>{opt.icon}</Text>
                    <Text style={[styles.ratioLabel, ratio === opt.value && styles.ratioLabelActive]}>{opt.label}</Text>
                    <Text style={styles.ratioDesc}>{opt.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Sahneler & Müzik</Text>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Müzik</Text>
              <TouchableOpacity
                style={[styles.musicBtn, hasMusicUri && styles.musicBtnActive]}
                onPress={() => setHasMusicUri(!hasMusicUri)}
              >
                <Text style={styles.musicIcon}>{hasMusicUri ? "🎵" : "📂"}</Text>
                <Text style={styles.musicText}>{hasMusicUri ? "müzik.mp3 seçildi" : "Müzik dosyası seç"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Sahneler ({scenes.length})</Text>
              {scenes.map((scene, idx) => (
                <View key={idx} style={styles.sceneRow}>
                  <View style={styles.sceneThumb}>
                    <Text style={{ color: "#64748B", fontSize: 20 }}>🖼</Text>
                  </View>
                  <TextInput
                    value={scene}
                    onChangeText={(v) => setScenes((p) => p.map((s, i) => i === idx ? v : s))}
                    placeholder={`Sahne ${idx + 1} metni...`}
                    placeholderTextColor="#64748B"
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  />
                  <TouchableOpacity onPress={() => setScenes((p) => p.filter((_, i) => i !== idx))}>
                    <Text style={{ color: "#EF4444", fontSize: 18 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addSceneBtn} onPress={() => setScenes((p) => [...p, ""])}>
                <Text style={styles.addSceneBtnText}>+ Sahne Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Yayın Ayarları</Text>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Açıklama / Caption</Text>
              <TextInput
                value={caption}
                onChangeText={setCaption}
                multiline
                numberOfLines={4}
                placeholder="Video açıklaması..."
                placeholderTextColor="#64748B"
                style={[styles.input, { height: 100, textAlignVertical: "top", paddingTop: 12 }]}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Hashtag&apos;ler</Text>
              <TextInput
                value={hashtags}
                onChangeText={setHashtags}
                placeholder="#tag1 #tag2 #tag3"
                placeholderTextColor="#64748B"
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Paylaşılacak Platformlar</Text>
              <View style={styles.platformGrid}>
                {PLATFORMS.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.platformBtn, selectedPlatforms.includes(p.id) && styles.platformBtnActive]}
                    onPress={() => togglePlatform(p.id)}
                  >
                    <Text style={styles.platformIcon}>{p.icon}</Text>
                    <Text style={[styles.platformLabel, selectedPlatforms.includes(p.id) && styles.platformLabelActive]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        {step > 1 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep((s) => (s - 1) as Step)}>
            <Text style={styles.backBtnText}>← Geri</Text>
          </TouchableOpacity>
        )}
        {step < 3 ? (
          <TouchableOpacity
            style={[styles.nextBtn, !title && step === 1 && styles.nextBtnDisabled]}
            disabled={step === 1 && !title}
            onPress={() => setStep((s) => (s + 1) as Step)}
          >
            <Text style={styles.nextBtnText}>Devam Et →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.nextBtn, rendering && styles.nextBtnDisabled]} disabled={rendering} onPress={handleCreate}>
            <Text style={styles.nextBtnText}>{rendering ? "Oluşturuluyor..." : "🎬 Video Oluştur"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  stepBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#1E293B", borderBottomWidth: 1, borderBottomColor: "#2d3f55" },
  stepItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#374e6a", alignItems: "center", justifyContent: "center" },
  stepCircleActive: { backgroundColor: "#F59E0B" },
  stepNum: { color: "#94A3B8", fontSize: 13, fontWeight: "700" },
  stepNumActive: { color: "#0F172A" },
  stepLabel: { color: "#64748B", fontSize: 11, marginLeft: 6, fontWeight: "600" },
  stepLabelActive: { color: "#F59E0B" },
  stepLine: { flex: 1, height: 2, backgroundColor: "#374e6a", marginHorizontal: 6 },
  stepLineActive: { backgroundColor: "#F59E0B" },
  quotaBanner: { backgroundColor: "#DC262610", borderBottomWidth: 1, borderBottomColor: "#DC262633", paddingHorizontal: 16, paddingVertical: 10 },
  quotaBannerText: { color: "#EF4444", fontSize: 12, fontWeight: "600", textAlign: "center" },
  stepContent: { padding: 16 },
  stepTitle: { color: "white", fontSize: 18, fontWeight: "800", marginBottom: 20 },
  field: { marginBottom: 20 },
  fieldLabel: { color: "#94A3B8", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  input: { backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#374e6a", color: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 8 },
  ratioGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  ratioCard: { width: "47%", backgroundColor: "#1E293B", borderRadius: 12, padding: 14, alignItems: "center", borderWidth: 2, borderColor: "#374e6a", gap: 4 },
  ratioCardActive: { borderColor: "#F59E0B", backgroundColor: "#F59E0B0A" },
  ratioIcon: { fontSize: 24 },
  ratioLabel: { color: "#94A3B8", fontSize: 13, fontWeight: "700" },
  ratioLabelActive: { color: "#F59E0B" },
  ratioDesc: { color: "#64748B", fontSize: 10, textAlign: "center" },
  musicBtn: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#374e6a", borderRadius: 12, padding: 14, borderStyle: "dashed" },
  musicBtnActive: { borderColor: "#F59E0B", borderStyle: "solid" },
  musicIcon: { fontSize: 24 },
  musicText: { color: "#94A3B8", fontSize: 14 },
  sceneRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  sceneThumb: { width: 48, height: 48, borderRadius: 8, backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#374e6a", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  addSceneBtn: { borderWidth: 1, borderColor: "#374e6a", borderStyle: "dashed", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 4 },
  addSceneBtnText: { color: "#64748B", fontSize: 13, fontWeight: "600" },
  platformGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  platformBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#374e6a", flexDirection: "row", alignItems: "center", gap: 6 },
  platformBtnActive: { borderColor: "#F59E0B", backgroundColor: "#F59E0B0A" },
  platformIcon: { fontSize: 16 },
  platformLabel: { color: "#94A3B8", fontSize: 12, fontWeight: "600" },
  platformLabelActive: { color: "#F59E0B" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: 10, padding: 16, backgroundColor: "#0F172A", borderTopWidth: 1, borderTopColor: "#1E293B" },
  backBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#374e6a", alignItems: "center" },
  backBtnText: { color: "#94A3B8", fontSize: 14, fontWeight: "600" },
  nextBtn: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: "#F59E0B", alignItems: "center" },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { color: "#0F172A", fontSize: 14, fontWeight: "800" },
  successTitle: { color: "white", fontSize: 24, fontWeight: "900", marginTop: 12 },
  successSub: { color: "#94A3B8", fontSize: 14, textAlign: "center", marginTop: 8, marginBottom: 32 },
  primaryBtn: { width: "100%", paddingVertical: 16, borderRadius: 14, backgroundColor: "#F59E0B", alignItems: "center", marginBottom: 12 },
  primaryBtnText: { color: "#0F172A", fontSize: 16, fontWeight: "800" },
  secondaryBtn: { width: "100%", paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: "#374e6a", alignItems: "center" },
  secondaryBtnText: { color: "#94A3B8", fontSize: 14, fontWeight: "600" },
});
