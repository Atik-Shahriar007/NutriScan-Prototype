import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  DemoNotice,
  PageHeader,
  Screen,
  SectionHeading,
  ToggleCard,
  usePalette,
} from "@/components/nutriscan-ui";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

export default function PreferencesScreen() {
  const router = useRouter();
  const palette = usePalette();
  const {
    language,
    setLanguage,
    appearance,
    setAppearance,
    halalMode,
    setHalalMode,
    childSafeMode,
    setChildSafeMode,
  } = useNutriScan();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const optionRow = (
    label: string,
    selected: boolean,
    onPress: () => void,
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: selected ? palette.green : palette.line,
        backgroundColor: selected ? palette.greenSoft : palette.card,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={selected ? palette.green : palette.muted}
      />
      <AppText weight={selected ? "semibold" : "medium"} style={{ flex: 1, fontSize: 13 }}>
        {label}
      </AppText>
      <MaterialCommunityIcons
        name={selected ? "radiobox-marked" : "radiobox-blank"}
        size={20}
        color={selected ? palette.green : palette.muted}
      />
    </Pressable>
  );

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={language === "en" ? "Preferences" : "পছন্দসমূহ"}
        back={() => router.back()}
      />

      <DemoNotice />

      <ToggleCard
        icon="shield-check-outline"
        title={t(language, "halalMode")}
        subtitle={t(language, "halalModeDescription")}
        value={halalMode}
        onValueChange={setHalalMode}
      />

      <View style={{ gap: 10 }}>
        <ToggleCard
          icon="baby-face-outline"
          title={t(language, "childSafeMode")}
          subtitle={
            language === "en"
              ? "Hide products scoring below 60/100"
              : "৬০/১০০-এর নিচে স্কোর করা পণ্য লুকান"
          }
          value={childSafeMode}
          onValueChange={setChildSafeMode}
          tone="amber"
        />
        {childSafeMode ? (
          <Card style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: palette.amberSoft }}>
            <MaterialCommunityIcons name="information-outline" size={18} color={palette.amberInk} />
            <AppText style={{ flex: 1, color: palette.amberInk, fontSize: 11, lineHeight: 17 }}>
              {language === "en"
                ? "Products with an NQSS below 60 will be hidden in Discover, search results, and recommendations."
                : "৬০-এর নিচে NQSS স্কোর থাকা পণ্যগুলো Discover, সার্চ ফলাফল এবং সুপারিশে লুকানো থাকবে।"}
            </AppText>
          </Card>
        ) : null}
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "Language" : "ভাষা"} />
        <View style={{ gap: 8 }}>
          {optionRow("English", language === "en", () => setLanguage("en"), "translate")}
          {optionRow("বাংলা", language === "bn", () => setLanguage("bn"), "translate")}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "Appearance" : "থিম"} />
        <View style={{ gap: 8 }}>
          {optionRow(
            language === "en" ? "Light" : "লাইট",
            appearance === "light",
            () => setAppearance("light"),
            "weather-sunny",
          )}
          {optionRow(
            language === "en" ? "Dark" : "ডার্ক",
            appearance === "dark",
            () => setAppearance("dark"),
            "weather-night",
          )}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "Notifications" : "বিজ্ঞপ্তি"} />
        <ToggleCard
          icon="bell-outline"
          title={language === "en" ? "Product & Expiry Alerts" : "পণ্য ও মেয়াদের সতর্কতা"}
          subtitle={
            language === "en"
              ? "Notifications not connected in this prototype"
              : "এই প্রোটোটাইপে নোটিফিকেশন যুক্ত নয়"
          }
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>
    </Screen>
  );
}
