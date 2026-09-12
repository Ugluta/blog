import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import type { BottomTabBarIconProps } from "@react-navigation/bottom-tabs";

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{icon}</Text>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0F172A" },
        headerTintColor: "#F59E0B",
        headerTitleStyle: { fontWeight: "800", letterSpacing: 1, fontSize: 16 },
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "KURUMSAL",
          tabBarIcon: ({ focused }: BottomTabBarIconProps) => (
            <TabIcon icon="🏠" label="Ana Sayfa" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="haberler"
        options={{
          title: "Haberler",
          tabBarIcon: ({ focused }: BottomTabBarIconProps) => (
            <TabIcon icon="📰" label="Haberler" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          title: "Video Oluştur",
          tabBarIcon: ({ focused }: BottomTabBarIconProps) => (
            <View style={styles.createBtn}>
              <Text style={styles.createIcon}>🎬</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sosyal"
        options={{
          title: "Sosyal Hesaplar",
          tabBarIcon: ({ focused }: BottomTabBarIconProps) => (
            <TabIcon icon="🔗" label="Sosyal" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profilim",
          tabBarIcon: ({ focused }: BottomTabBarIconProps) => (
            <TabIcon icon="👤" label="Profil" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#1E293B",
    borderTopColor: "#2d3f55",
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabIcon: {
    alignItems: "center",
    gap: 2,
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "500",
  },
  labelActive: {
    color: "#F59E0B",
  },
  createBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  createIcon: {
    fontSize: 24,
  },
});
