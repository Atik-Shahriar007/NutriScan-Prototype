import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useNutriScan } from "@/lib/nutriscan-state";
import { t } from "@/lib/nutriscan-data";
import { fontFamily, palette } from "@/components/nutriscan-ui";

export default function TabLayout() {
  const { language } = useNutriScan();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarActiveTintColor: palette.green,
      tabBarInactiveTintColor: palette.muted,
      tabBarLabelStyle: { fontFamily: fontFamily(language, "medium"), fontSize: 9, marginTop: 1 },
      tabBarStyle: { paddingTop: 7, paddingBottom: bottomPadding, height: 59 + bottomPadding, backgroundColor: palette.card, borderTopColor: palette.line, borderTopWidth: 1, elevation: 0 },
    }}>
      <Tabs.Screen name="index" options={{ title: t(language, "scan"), tabBarIcon: ({ color }) => <MaterialCommunityIcons name="barcode-scan" size={21} color={color} /> }} />
      <Tabs.Screen name="history" options={{ title: t(language, "history"), tabBarIcon: ({ color }) => <MaterialCommunityIcons name="history" size={21} color={color} /> }} />
      <Tabs.Screen name="contribute" options={{ title: t(language, "contribute"), tabBarIcon: ({ color }) => <MaterialCommunityIcons name="camera-plus-outline" size={21} color={color} /> }} />
      <Tabs.Screen name="community" options={{ title: t(language, "community"), tabBarIcon: ({ color }) => <MaterialCommunityIcons name="trophy-outline" size={21} color={color} /> }} />
      <Tabs.Screen name="support" options={{ title: t(language, "support"), tabBarIcon: ({ color }) => <MaterialCommunityIcons name="heart-outline" size={21} color={color} /> }} />
    </Tabs>
  );
}
