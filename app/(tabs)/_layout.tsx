import { Tabs, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, Pressable, View } from "react-native";
import { useNutriScan } from "@/lib/nutriscan-state";
import { t } from "@/lib/nutriscan-data";
import { fontFamily, usePalette } from "@/components/nutriscan-ui";

export default function TabLayout() {
  const router = useRouter();
  const { language } = useNutriScan();
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarActiveTintColor: palette.green,
      tabBarInactiveTintColor: palette.muted,
      tabBarLabelStyle: { fontFamily: fontFamily(language, "medium"), fontSize: 10, marginTop: 1 },
      tabBarStyle: { paddingTop: 7, paddingBottom: bottomPadding, height: 68 + bottomPadding, backgroundColor: palette.card, borderTopColor: palette.line, borderTopWidth: 1, elevation: 0 },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t(language, "home"),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-outline" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t(language, "discover"),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="compass-outline" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan-tab"
        options={{
          title: "",
          tabBarLabel: () => null,
          tabBarButton: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t(language, "scan")}
              onPress={() => router.push("/scan")}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -16,
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <View
                style={{
                  backgroundColor: palette.green,
                  borderRadius: 28,
                  width: 56,
                  height: 56,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: palette.green,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <MaterialCommunityIcons name="barcode-scan" size={28} color={palette.onGreen} />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="nouri"
        options={{
          title: t(language, "nouri"),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="robot-outline" size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t(language, "profile"),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle-outline" size={21} color={color} />,
        }}
      />
      <Tabs.Screen name="community" options={{ href: null }} />
      <Tabs.Screen name="contribute" options={{ href: null }} />
      <Tabs.Screen name="history" options={{ href: null }} />
      <Tabs.Screen name="more" options={{ href: null }} />
      <Tabs.Screen name="support" options={{ href: null }} />
      <Tabs.Screen name="nutrifacts" options={{ href: null }} />
    </Tabs>
  );
}
