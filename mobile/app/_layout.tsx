import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initRevenueCat } from "@/lib/revenuecat";
import { initAdMob } from "@/lib/admob";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 2 } },
});

export default function RootLayout() {
  useEffect(() => {
    async function init() {
      await Promise.all([initRevenueCat(), initAdMob()]);
      await SplashScreen.hideAsync();
    }
    init();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#0F172A" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#0F172A" },
            headerTintColor: "#F59E0B",
            headerTitleStyle: { fontWeight: "800", letterSpacing: 1 },
            contentStyle: { backgroundColor: "#0F172A" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="giris" options={{ title: "Giriş Yap", presentation: "modal" }} />
          <Stack.Screen name="kayit" options={{ title: "Kayıt Ol", presentation: "modal" }} />
          <Stack.Screen name="abonelik" options={{ title: "Premium'a Geç" }} />
          <Stack.Screen name="video/[id]" options={{ title: "Video Oluştur" }} />
          <Stack.Screen name="haber/[id]" options={{ title: "" }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
